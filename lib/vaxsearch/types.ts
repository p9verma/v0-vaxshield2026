/**
 * Shared contract for the VaxSearch provider lookup.
 *
 * Lives in lib/ (not in the page) so both the API route and the client
 * components can import it without a page module becoming a dependency of a
 * leaf UI component.
 */

export type ProviderType = "pharmacy" | "clinic" | "hospital" | "doctor"

export interface FoundClinic {
  /**
   * Composite "<osmType>/<osmId>", e.g. "node/12345" or "way/12345".
   * Overpass IDs are unique only *per element type*, so the raw numeric id
   * collides between a node and a way and would break React keys.
   */
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  lat: number
  lng: number
  type: ProviderType
  /** Straight-line distance from the search centre. */
  distanceMeters: number
}

export type VaxSearchErrorCode =
  | "invalid_request"
  | "geocode_not_found"
  | "geocode_too_broad"
  | "geocode_unavailable"
  | "upstream_unavailable"

export type VaxSearchOk = {
  status: "ok"
  center: { lat: number; lng: number }
  /** Human-readable match from the geocoder. Absent for coordinate searches. */
  placeLabel?: string
  /** Set when the query was a bare state ("Virginia") and we redirected the
   *  search to that state's largest city instead of erroring. Holds the state
   *  name so the UI can say "showing results near <placeLabel>, Virginia's
   *  largest city". */
  redirectedFromState?: string
  radiusMeters: number
  /** True when the first pass was thin and the radius was escalated. */
  widened: boolean
  clinics: FoundClinic[]
  /** Count before the display cap, so the UI can say "showing 150 of 412". */
  totalMatched: number
}

export type VaxSearchError = {
  status: "error"
  code: VaxSearchErrorCode
  /** Echo of what the user typed, for message interpolation. */
  query?: string
  /** For geocode_too_broad: e.g. "Virginia" and "state". */
  matchedPlace?: string
  matchedKind?: string
  retryable: boolean
}

export type VaxSearchResponse = VaxSearchOk | VaxSearchError

export const PROVIDER_LABELS: Record<ProviderType, string> = {
  pharmacy: "Pharmacy",
  clinic: "Clinic",
  hospital: "Hospital",
  doctor: "Doctor",
}

/**
 * User-facing copy for each failure. Kept next to the codes so the message and
 * the code cannot drift apart.
 */
export function errorMessage(err: VaxSearchError): string {
  switch (err.code) {
    case "geocode_not_found":
      return `We couldn't find "${err.query ?? "that location"}". Try a city, ZIP code, or full street address.`
    case "geocode_too_broad":
      return `"${err.matchedPlace ?? "That"}" covers a whole ${err.matchedKind ?? "region"}. Enter a city, ZIP code, or address within it, or use your current location.`
    case "geocode_unavailable":
      return "Our location lookup is temporarily unavailable. Please try again in a moment."
    case "upstream_unavailable":
      return "The provider directory is busy right now. This usually clears within a few seconds."
    case "invalid_request":
    default:
      return "Something went wrong with that search. Please try again."
  }
}
