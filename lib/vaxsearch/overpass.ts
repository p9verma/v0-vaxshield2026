import type { FoundClinic, ProviderType } from "./types"

const UA = "VaxShield/1.0 (vaxshieldteam@gmail.com)"

/**
 * Mirrors, tried in order and rotated per attempt.
 *
 * Both entries are verified to serve the full planet. Do NOT add
 * overpass.osm.ch: it is a Europe-only extract and returns HTTP 200 with zero
 * elements for US coordinates, which would silently reproduce the "finds
 * nothing" bug it is meant to prevent.
 */
const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
]

const MAX_ATTEMPTS = 3
const PER_ATTEMPT_MS = 10_000
const BACKOFF_MS = [0, 400, 1000]

export class OverpassUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OverpassUnavailableError"
  }
}

interface OverpassElement {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  /** Present on ways/relations thanks to `out center`. */
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

/** Round to ~1.1km so nearby searches share a cache entry, and so we never
 *  forward a user's exact GPS coordinates to a third party. */
const round2 = (n: number) => Math.round(n * 100) / 100

function buildQuery(lat: number, lng: number, radius: number): string {
  const around = `(around:${radius},${round2(lat)},${round2(lng)})`
  // `nwr` (node/way/relation) rather than `node`: many hospitals and clinics
  // are mapped as building polygons, not points. Restricting to nodes drops
  // 22-48% of providers, and up to 75% in rural areas.
  return `[out:json][timeout:20];
(
  nwr["amenity"="pharmacy"]${around};
  nwr["amenity"="clinic"]${around};
  nwr["amenity"="doctors"]${around};
  nwr["amenity"="hospital"]${around};
  nwr["healthcare"~"^(centre|clinic|hospital|pharmacy|doctor)$"]${around};
);
out body center;`
}

function classify(tags: Record<string, string>): ProviderType {
  const a = tags.amenity
  const h = tags.healthcare
  if (a === "pharmacy" || h === "pharmacy") return "pharmacy"
  if (a === "hospital" || h === "hospital") return "hospital"
  if (a === "doctors" || h === "doctor") return "doctor"
  // amenity=clinic, healthcare=centre, healthcare=clinic, and anything else.
  return "clinic"
}

function coordsOf(el: OverpassElement): { lat: number; lng: number } | null {
  const lat = el.type === "node" ? el.lat : el.center?.lat
  const lon = el.type === "node" ? el.lon : el.center?.lon
  // Number.isFinite, not truthiness: a truthiness check drops anything sitting
  // at exactly latitude or longitude 0.
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return { lat: lat as number, lng: lon as number }
}

function formatAddress(tags: Record<string, string>): string {
  const line1 = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ")
  const line2 = [tags["addr:city"], tags["addr:state"]].filter(Boolean).join(", ")
  return [line1, line2, tags["addr:postcode"]].filter(Boolean).join(", ") || "Address not listed"
}

const EARTH_RADIUS_M = 6_371_000

export function haversine(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(s))
}

/**
 * Large hospitals are routinely mapped twice: a node POI *and* a way polygon.
 * Collapse same-name entries within 200m of each other, preferring the record
 * with more tags (usually the node, which carries phone/website).
 * Same-name entries further apart are genuine separate branches and survive.
 */
function dedupe(clinics: (FoundClinic & { _tagCount: number })[]): FoundClinic[] {
  const byName = new Map<string, (FoundClinic & { _tagCount: number })[]>()
  for (const c of clinics) {
    const key = c.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
    const bucket = byName.get(key)
    if (bucket) bucket.push(c)
    else byName.set(key, [c])
  }

  const out: FoundClinic[] = []
  for (const bucket of byName.values()) {
    // Richest record first, so it is the one kept when duplicates collapse.
    bucket.sort((a, b) => b._tagCount - a._tagCount)
    const kept: (FoundClinic & { _tagCount: number })[] = []
    for (const c of bucket) {
      const dup = kept.some((k) => haversine(k.lat, k.lng, c.lat, c.lng) < 200)
      if (!dup) kept.push(c)
    }
    for (const k of kept) {
      const { _tagCount, ...rest } = k
      void _tagCount
      out.push(rest)
    }
  }
  return out
}

function normalize(
  elements: OverpassElement[],
  centerLat: number,
  centerLng: number
): FoundClinic[] {
  const mapped: (FoundClinic & { _tagCount: number })[] = []

  for (const el of elements) {
    const tags = el.tags
    if (!tags?.name) continue
    const coords = coordsOf(el)
    if (!coords) continue

    mapped.push({
      id: `${el.type}/${el.id}`,
      name: tags.name,
      address: formatAddress(tags),
      phone: tags.phone || tags["contact:phone"] || undefined,
      website: tags.website || tags["contact:website"] || undefined,
      lat: coords.lat,
      lng: coords.lng,
      type: classify(tags),
      distanceMeters: haversine(centerLat, centerLng, coords.lat, coords.lng),
      _tagCount: Object.keys(tags).length,
    })
  }

  return dedupe(mapped).sort((a, b) => a.distanceMeters - b.distanceMeters)
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

/**
 * Fetch providers from Overpass with retry across rotating mirrors.
 * Throws OverpassUnavailableError when every attempt fails.
 */
export async function fetchProviders(
  lat: number,
  lng: number,
  radius: number,
  deadline: number
): Promise<FoundClinic[]> {
  const ql = buildQuery(lat, lng, radius)
  let lastReason = "unknown"

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remaining = deadline - Date.now()
    if (remaining < 2000) {
      lastReason = "deadline exceeded before attempt"
      break
    }

    const wait = BACKOFF_MS[attempt] ?? 1000
    if (wait > 0) await new Promise((r) => setTimeout(r, wait + Math.random() * wait))

    // Rotate mirrors: the observed failures were 429/504 (server load), so
    // retrying the same host is close to useless.
    const mirror = MIRRORS[attempt % MIRRORS.length]
    // GET rather than POST so Next's Data Cache and any CDN can key on the URL.
    const url = `${mirror}?data=${encodeURIComponent(ql)}`

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(Math.min(PER_ATTEMPT_MS, deadline - Date.now())),
        next: { revalidate: 3600 },
      })

      if (res.status === 400) {
        // Our query is malformed. Retrying three mirrors will not help.
        throw new OverpassUnavailableError("Overpass rejected the query (400)")
      }
      if (isRetryableStatus(res.status)) {
        lastReason = `HTTP ${res.status} from ${mirror}`
        console.error(`[vaxsearch] overpass attempt ${attempt + 1}: ${lastReason}`)
        continue
      }
      if (!res.ok) {
        lastReason = `HTTP ${res.status} from ${mirror}`
        continue
      }

      const data = (await res.json()) as { elements?: OverpassElement[]; remark?: string }

      // Overpass reports server-side failures IN BAND with a 200 status.
      // Without this check a load-shed response parses as zero elements and
      // renders as "no clinics near you".
      if (data.remark && /timed out|out of memory|runtime error/i.test(data.remark)) {
        lastReason = `remark: ${data.remark.slice(0, 120)}`
        console.error(`[vaxsearch] overpass attempt ${attempt + 1}: ${lastReason}`)
        continue
      }

      return normalize(data.elements ?? [], lat, lng)
    } catch (err) {
      if (err instanceof OverpassUnavailableError) throw err
      lastReason = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
      console.error(`[vaxsearch] overpass attempt ${attempt + 1} failed: ${lastReason}`)
    }
  }

  throw new OverpassUnavailableError(`all ${MAX_ATTEMPTS} attempts failed (${lastReason})`)
}
