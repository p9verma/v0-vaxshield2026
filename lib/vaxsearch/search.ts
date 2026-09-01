import { fetchProviders } from "./overpass"
import type { FoundClinic } from "./types"

/**
 * Radius ladder, chosen from measured Overpass cost:
 *
 *   Arlington VA (dense)   10km 2.5s/314   12km 3.8s/367   25km 19.3s/634
 *   Farmville VA (rural)   12km 1.0s/13    40km 1.7s/36
 *
 * A flat 25km times out in dense metros, so start narrow and escalate only
 * where the data is genuinely sparse. Switching the query from `node` to `nwr`
 * already recovers 3-4x more providers at any given radius, so 12km now
 * returns more than the old 10km node-only query did.
 */
const RADII = [12_000, 40_000] as const
const MIN_RESULTS = 8
const DISPLAY_CAP = 150

export interface SearchOutcome {
  clinics: FoundClinic[]
  radiusMeters: number
  widened: boolean
  totalMatched: number
}

export async function searchProviders(
  lat: number,
  lng: number,
  deadline: number
): Promise<SearchOutcome> {
  // A failure here propagates as OverpassUnavailableError. We deliberately do
  // NOT widen in response to an error: that would fire a larger, more expensive
  // query into the exact upstream that just rejected us.
  const first = await fetchProviders(lat, lng, RADII[0], deadline)

  if (first.length >= MIN_RESULTS || deadline - Date.now() < 9000) {
    return {
      clinics: first.slice(0, DISPLAY_CAP),
      radiusMeters: RADII[0],
      widened: false,
      totalMatched: first.length,
    }
  }

  // Sparse area: widen once and tell the caller so the UI can say why.
  const second = await fetchProviders(lat, lng, RADII[1], deadline)
  return {
    clinics: second.slice(0, DISPLAY_CAP),
    radiusMeters: RADII[1],
    widened: true,
    totalMatched: second.length,
  }
}
