import { STATE_LARGEST_CITY } from "./us-states"

const UA = "VaxShield/1.0 (vaxshieldteam@gmail.com)"
const NOMINATIM = "https://nominatim.openstreetmap.org/search"

export type GeocodeResult =
  | { kind: "found"; lat: number; lng: number; label: string; redirectedFromState?: string }
  | { kind: "too_broad"; label: string; placeKind: string }
  | { kind: "not_found" }
  | { kind: "unavailable" }

interface NominatimHit {
  lat: string
  lon: string
  display_name?: string
  name?: string
  /** jsonv2 renames `class` to `category`; accept either. */
  category?: string
  class?: string
  type?: string
  addresstype?: string
  place_rank?: number
  boundingbox?: [string, string, string, string]
}

/** Collapse whitespace and case so equivalent queries share a cache entry. */
function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * Detect a match that covers a state or larger.
 *
 * Typing a bare state ("VA", "Virginia") geocodes to the state centroid, which
 * for Virginia is empty farmland in Prince Edward County. Searching a normal
 * radius there legitimately returns nothing, which the user reads as "the app
 * is broken". Detecting it lets the caller redirect to the state's largest
 * city instead (see the state-redirect block in `geocode`), or, for the rare
 * case of a whole country, ask the user to narrow.
 *
 * The reliable discriminator is `addresstype`, not `place_rank`. Virginia's
 * independent cities are county-equivalents and rank 12 (Richmond,
 * Charlottesville, Arlington all rank 12) -- the same band as a state under a
 * naive threshold, which would wrongly reject real cities. Virginia the state
 * is rank 8 with addresstype "state", so rank is only a backstop at <= 8.
 */
function isTooBroad(hit: NominatimHit): boolean {
  const category = hit.category ?? hit.class
  const rank = hit.place_rank ?? 99

  if (hit.addresstype === "country" || hit.addresstype === "state") return true
  if (category === "boundary" && hit.type === "administrative" && rank <= 8) return true

  // Secondary guard: anything spanning > 2 degrees of latitude is state-sized
  // regardless of classification. Virginia spans ~3.2 deg; the largest US
  // county (San Bernardino) spans ~1.5 deg.
  const bb = hit.boundingbox
  if (bb) {
    const south = Number(bb[0])
    const north = Number(bb[1])
    if (Number.isFinite(south) && Number.isFinite(north) && north - south > 2.0) return true
  }
  return false
}

/** Short, human-friendly label: "Richmond, Virginia" rather than the full display_name. */
function shortLabel(hit: NominatimHit): string {
  const full = hit.display_name ?? hit.name ?? ""
  const parts = full.split(",").map((p) => p.trim()).filter(Boolean)
  if (parts.length <= 2) return full
  // Drop the country and any trailing postcode.
  const trimmed = parts.filter((p) => p !== "United States" && !/^\d{5}(-\d{4})?$/.test(p))
  return trimmed.slice(0, 2).join(", ") || full
}

/** Nominatim's `name` is the bare state name ("Virginia") for a state-level
 *  hit; display_name's first segment is the same thing as a fallback. */
function stateNameOf(hit: NominatimHit): string | null {
  if (hit.name) return hit.name
  return hit.display_name?.split(",")[0]?.trim() || null
}

export async function geocode(
  rawQuery: string,
  deadline: number,
  // Internal: prevents a redirected city search from being redirected again.
  allowStateRedirect = true
): Promise<GeocodeResult> {
  const q = normalizeQuery(rawQuery)
  const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=jsonv2&limit=1&countrycodes=us&addressdetails=0`

  // One retry: Nominatim is generally reliable, but a transient failure here
  // must never be reported to the user as "location not found".
  for (let attempt = 0; attempt < 2; attempt++) {
    const remaining = deadline - Date.now()
    if (remaining < 1500) break

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en" },
        signal: AbortSignal.timeout(Math.min(4000, remaining)),
        // City coordinates are stable; caching also keeps us well inside
        // Nominatim's 1 request/second usage policy.
        next: { revalidate: 86400 },
      })

      if (res.status >= 500 || res.status === 429) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 400))
          continue
        }
        return { kind: "unavailable" }
      }
      if (!res.ok) return { kind: "unavailable" }

      const data = (await res.json()) as NominatimHit[]
      if (!Array.isArray(data) || data.length === 0) return { kind: "not_found" }

      const hit = data[0]
      const lat = parseFloat(hit.lat)
      const lng = parseFloat(hit.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { kind: "not_found" }

      if (isTooBroad(hit)) {
        const stateName = allowStateRedirect ? stateNameOf(hit) : null
        const redirectCity = stateName ? STATE_LARGEST_CITY[stateName] : undefined

        // A bare state ("VA", "Virginia") is real intent -- the user wants
        // "somewhere in this state", not an error. Redirect to the state's
        // largest city (real provider density) rather than the geometric
        // centroid (often empty farmland) or a dead end telling them to type
        // something more specific. Countries aren't redirected: there's no
        // single sane city to guess, so that case still reports too_broad.
        if (redirectCity) {
          const inner = await geocode(redirectCity, deadline, false)
          if (inner.kind === "found") {
            return { ...inner, redirectedFromState: stateName ?? undefined }
          }
          // Redirect target failed to geocode (shouldn't happen -- it's a
          // real city we chose) or Nominatim/network hiccuped: fall through
          // to the original too_broad response rather than lose the search.
        }

        return {
          kind: "too_broad",
          label: shortLabel(hit).split(",")[0]?.trim() || rawQuery,
          placeKind: hit.addresstype === "country" ? "country" : "state",
        }
      }

      return { kind: "found", lat, lng, label: shortLabel(hit) }
    } catch (err) {
      console.error(`[vaxsearch] geocode attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : err)
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 400))
        continue
      }
      return { kind: "unavailable" }
    }
  }
  return { kind: "unavailable" }
}
