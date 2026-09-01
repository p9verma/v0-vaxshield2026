import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { geocode } from "@/lib/vaxsearch/geocode"
import { searchProviders } from "@/lib/vaxsearch/search"
import { OverpassUnavailableError } from "@/lib/vaxsearch/overpass"
import type { VaxSearchResponse, VaxSearchError } from "@/lib/vaxsearch/types"

export const runtime = "nodejs"
export const maxDuration = 30

const BUDGET_MS = 22_000

const CoordsSchema = z.object({
  lat: z.coerce.number().finite().min(-90).max(90),
  lng: z.coerce.number().finite().min(-180).max(180),
})
const QuerySchema = z.string().trim().min(2).max(120)

function errorResponse(err: VaxSearchError, httpStatus: number): NextResponse<VaxSearchResponse> {
  const res = NextResponse.json<VaxSearchResponse>(err, { status: httpStatus })
  // Never cache a failure, or one brief outage becomes a long one.
  res.headers.set("Cache-Control", "no-store")
  if (err.retryable) res.headers.set("Retry-After", "5")
  return res
}

export async function GET(req: NextRequest): Promise<NextResponse<VaxSearchResponse>> {
  const deadline = Date.now() + BUDGET_MS
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  const latParam = searchParams.get("lat")
  const lngParam = searchParams.get("lng")

  let lat: number
  let lng: number
  let placeLabel: string | undefined

  if (latParam !== null || lngParam !== null) {
    // Coordinate search (browser geolocation). Validate: parseFloat on garbage
    // yields NaN, which would be interpolated straight into the Overpass query.
    const parsed = CoordsSchema.safeParse({ lat: latParam, lng: lngParam })
    if (!parsed.success) {
      return errorResponse({ status: "error", code: "invalid_request", retryable: false }, 400)
    }
    lat = parsed.data.lat
    lng = parsed.data.lng
  } else if (q !== null) {
    const parsedQuery = QuerySchema.safeParse(q)
    if (!parsedQuery.success) {
      return errorResponse(
        { status: "error", code: "geocode_not_found", query: q, retryable: false },
        200
      )
    }

    const result = await geocode(parsedQuery.data, deadline)
    switch (result.kind) {
      case "not_found":
        return errorResponse(
          { status: "error", code: "geocode_not_found", query: q, retryable: false },
          200
        )
      case "too_broad":
        return errorResponse(
          {
            status: "error",
            code: "geocode_too_broad",
            query: q,
            matchedPlace: result.label,
            matchedKind: result.placeKind,
            retryable: false,
          },
          200
        )
      case "unavailable":
        return errorResponse(
          { status: "error", code: "geocode_unavailable", query: q, retryable: true },
          503
        )
      case "found":
        lat = result.lat
        lng = result.lng
        placeLabel = result.label
        break
    }
  } else {
    return errorResponse({ status: "error", code: "invalid_request", retryable: false }, 400)
  }

  try {
    const outcome = await searchProviders(lat, lng, deadline)
    const res = NextResponse.json<VaxSearchResponse>({
      status: "ok",
      center: { lat, lng },
      placeLabel,
      radiusMeters: outcome.radiusMeters,
      widened: outcome.widened,
      clinics: outcome.clinics,
      totalMatched: outcome.totalMatched,
    })
    res.headers.set("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600")
    return res
  } catch (err) {
    if (err instanceof OverpassUnavailableError) {
      console.error(`[vaxsearch] upstream unavailable: ${err.message}`)
      return errorResponse(
        { status: "error", code: "upstream_unavailable", query: q ?? undefined, retryable: true },
        503
      )
    }
    console.error("[vaxsearch] unexpected failure:", err)
    return errorResponse(
      { status: "error", code: "upstream_unavailable", query: q ?? undefined, retryable: true },
      503
    )
  }
}
