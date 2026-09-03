"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, MapPin, Phone, ChevronRight, AlertCircle, Navigation,
  Loader2, Filter, Syringe, Info, RotateCw,
} from "lucide-react"
import {
  PROVIDER_LABELS,
  errorMessage,
  type FoundClinic,
  type ProviderType,
  type VaxSearchOk,
  type VaxSearchError,
  type VaxSearchResponse,
} from "@/lib/vaxsearch/types"

const ClinicMap = dynamic(
  () => import("@/components/clinic-map").then((m) => m.ClinicMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-sky-50">
        <Loader2 className="h-6 w-6 text-sky-600 animate-spin" />
      </div>
    ),
  }
)

const hotlines = [
  { name: "CDC Vaccine Hotline", number: "1-800-232-4636", hours: "Mon–Fri, 8am–8pm ET", description: "Questions about vaccines, schedules, and safety." },
  { name: "Michigan DHHS Immunization", number: "1-888-535-6136", hours: "Mon–Fri, 8am–5pm ET", description: "Michigan-specific vaccine program inquiries." },
  { name: "Nurse Advice Line (24/7)", number: "1-800-942-5678", hours: "24/7 availability", description: "Talk to a registered nurse any time." },
  { name: "Poison Control Center", number: "1-800-222-1222", hours: "24/7 availability", description: "Concerns about medication or vaccine reactions." },
]

type ProviderFilter = "All" | ProviderType

/** What the page is currently showing. One atom, so the states cannot disagree. */
type ViewState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "results"; data: VaxSearchOk }
  | { phase: "error"; err: VaxSearchError }
  /** Browser denied or failed geolocation. Distinct from an API failure. */
  | { phase: "geo_denied" }

/** The search that produced the current view, so Retry can repeat it. */
type LastSearch = { kind: "query"; q: string } | { kind: "coords"; lat: number; lng: number }

/**
 * Always parse the body, regardless of res.ok. The route deliberately returns a
 * typed reason on failure; branching on res.ok would throw that away and is what
 * caused a busy upstream to be reported as "Location not found".
 */
async function fetchSearch(params: URLSearchParams): Promise<VaxSearchResponse> {
  try {
    const res = await fetch(`/api/vaxsearch?${params}`)
    return (await res.json()) as VaxSearchResponse
  } catch {
    // Network failure, or a non-JSON body such as a platform error page.
    return { status: "error", code: "upstream_unavailable", retryable: true }
  }
}

export default function VaxSearchPage() {
  const [query, setQuery] = useState("")
  const [view, setView] = useState<ViewState>({ phase: "idle" })
  const [locating, setLocating] = useState(false)
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("All")
  const lastSearch = useRef<LastSearch | null>(null)

  const data = view.phase === "results" ? view.data : null
  const clinics = useMemo<FoundClinic[]>(() => data?.clinics ?? [], [data])

  // Counts drive the filter chips: a bucket with zero results is never offered,
  // so it is not possible to select a filter that yields a blank page.
  const counts = useMemo(() => {
    const m = new Map<ProviderType, number>()
    for (const c of clinics) m.set(c.type, (m.get(c.type) ?? 0) + 1)
    return m
  }, [clinics])

  const filteredClinics = useMemo(
    () => (providerFilter === "All" ? clinics : clinics.filter((c) => c.type === providerFilter)),
    [clinics, providerFilter]
  )

  const runSearch = async (target: LastSearch) => {
    lastSearch.current = target
    setProviderFilter("All") // never carry a stale filter into a new city
    setView({ phase: "loading" })

    const params =
      target.kind === "query"
        ? new URLSearchParams({ q: target.q })
        : new URLSearchParams({ lat: String(target.lat), lng: String(target.lng) })

    const res = await fetchSearch(params)
    setView(res.status === "ok" ? { phase: "results", data: res } : { phase: "error", err: res })
  }

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    void runSearch({ kind: "query", q: query.trim() })
  }

  /**
   * `userInitiated` distinguishes the button from the on-mount attempt. A denied
   * permission prompt on page load should leave the page in its normal empty
   * state, not show a red error before the user has done anything.
   */
  const handleGeolocate = (userInitiated: boolean) => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        void runSearch({ kind: "coords", lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        setLocating(false)
        if (userInitiated) setView({ phase: "geo_denied" })
      }
    )
  }

  useEffect(() => { handleGeolocate(false) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = () => { if (lastSearch.current) void runSearch(lastSearch.current) }

  const chips: { label: string; value: ProviderFilter; count: number }[] = [
    { label: "All", value: "All", count: clinics.length },
    ...(Object.keys(PROVIDER_LABELS) as ProviderType[])
      .filter((t) => (counts.get(t) ?? 0) > 0)
      .map((t) => ({ label: PROVIDER_LABELS[t], value: t as ProviderFilter, count: counts.get(t) ?? 0 })),
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">VaxSearch</p>
            <h1 className="text-4xl font-bold mb-4 text-balance">Find vaccines near you</h1>
            <p className="text-white/70 text-lg mb-8">
              Locate nearby clinics, pharmacies, and hospitals offering vaccines in your community.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Enter city, zip code, or address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 h-12 text-foreground bg-white border-0 shadow-lg rounded-xl"
                  aria-label="Search for vaccine locations"
                />
              </div>
              <Button type="submit" className="h-12 px-5 bg-sky-600 hover:bg-sky-600/80 text-white rounded-xl shrink-0" disabled={view.phase === "loading"}>
                {view.phase === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
              </Button>
            </form>
            <button
              onClick={() => handleGeolocate(true)}
              disabled={locating}
              className="mt-3 text-sm text-white/60 hover:text-white flex items-center gap-1.5 mx-auto transition-colors"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Use my current location
            </button>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-sky-600/20 h-80 mb-6">
                <ClinicMap
                  visibleClinics={filteredClinics}
                  center={data?.center ?? null}
                  radiusMeters={data?.radiusMeters}
                />
              </div>

              {/* Filters, derived from what the search actually returned */}
              {view.phase === "results" && clinics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <Filter className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  {chips.map(({ label, value, count }) => (
                    <button
                      key={value}
                      onClick={() => setProviderFilter(value)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                        providerFilter === value
                          ? "bg-sky-600 text-white border-sky-600"
                          : "border-sky-600/30 text-slate-900 hover:border-sky-600"
                      }`}
                      aria-pressed={providerFilter === value}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              )}

              {/* Idle */}
              {view.phase === "idle" && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-sky-600/40" aria-hidden="true" />
                  <p>Search a location above to find vaccine providers near you.</p>
                </div>
              )}

              {view.phase === "loading" && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-sky-600 animate-spin" />
                </div>
              )}

              {/* Geolocation denied (only ever from an explicit button press) */}
              {view.phase === "geo_denied" && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center">
                  <Navigation className="h-8 w-8 text-amber-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-slate-900 font-medium">
                    We could not access your location. Check your browser&apos;s location permission, or search by
                    city or ZIP code instead.
                  </p>
                </div>
              )}

              {/* Error */}
              {view.phase === "error" && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-slate-900 font-medium mb-1">{errorMessage(view.err)}</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {view.err.retryable && (
                      <Button size="sm" onClick={retry} className="bg-sky-600 text-white hover:bg-sky-600/80 gap-1.5">
                        <RotateCw className="h-4 w-4" aria-hidden="true" />
                        Try again
                      </Button>
                    )}
                    {view.err.code === "geocode_too_broad" && (
                      <Button size="sm" variant="outline" onClick={() => handleGeolocate(true)} className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white gap-1.5">
                        <Navigation className="h-4 w-4" aria-hidden="true" />
                        Use my current location
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Genuinely empty result: neutral, not an error */}
              {view.phase === "results" && clinics.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-sky-600/40" aria-hidden="true" />
                  {data!.redirectedFromState && (
                    <p className="mb-1">
                      You searched all of {data!.redirectedFromState}, so we looked near {data!.placeLabel}, its
                      largest city.
                    </p>
                  )}
                  <p>
                    No vaccine providers are listed within {Math.round(data!.radiusMeters / 1000)} km
                    {data!.placeLabel ? ` of ${data!.placeLabel}` : ""}. Try a nearby city.
                  </p>
                </div>
              )}

              {/* Results */}
              {view.phase === "results" && clinics.length > 0 && (
                <>
                  {data!.redirectedFromState && (
                    <div className="rounded-xl border border-sky-600/30 bg-sky-50 px-4 py-3 mb-4 text-sm text-slate-900 flex gap-2">
                      <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        You searched all of {data!.redirectedFromState}, so we&apos;re showing results near{" "}
                        {data!.placeLabel}, its largest city. Search a specific city or ZIP for more precise results.
                      </span>
                    </div>
                  )}

                  {data!.widened && (
                    <div className="rounded-xl border border-sky-600/30 bg-sky-50 px-4 py-3 mb-4 text-sm text-slate-900 flex gap-2">
                      <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        No providers within 12 km{data!.placeLabel ? ` of ${data!.placeLabel}` : ""}, so we widened
                        the search to {Math.round(data!.radiusMeters / 1000)} km.
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-4">
                    {filteredClinics.length} location{filteredClinics.length !== 1 ? "s" : ""} shown
                    {data!.totalMatched > clinics.length && providerFilter === "All"
                      ? ` (closest ${clinics.length} of ${data!.totalMatched})`
                      : ""}
                  </p>

                  {filteredClinics.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No {providerFilter} locations in these results.</p>
                      <Button size="sm" variant="outline" className="mt-3 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white" onClick={() => setProviderFilter("All")}>
                        Show all {clinics.length}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredClinics.map((clinic) => (
                        <div key={clinic.id} className="bg-white rounded-2xl border border-sky-600/20 p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900">{clinic.name}</h3>
                                <Badge variant="secondary" className="text-xs">{PROVIDER_LABELS[clinic.type]}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {(clinic.distanceMeters / 1000).toFixed(1)} km away
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {clinic.address}
                              </p>
                              {clinic.phone && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                  <a href={`tel:${clinic.phone}`} className="hover:text-sky-600">{clinic.phone}</a>
                                </p>
                              )}
                            </div>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="ghost" className="text-sky-600 hover:bg-sky-600/10 shrink-0 gap-1">
                                Directions
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="mt-10 lg:mt-0">
              <div className="bg-slate-900 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-sky-600" aria-hidden="true" />
                  <h2 className="font-bold text-lg">Vaccine Helplines</h2>
                </div>
                <p className="text-white/65 text-sm mb-5">
                  Have questions about vaccine safety, schedules, or side effects? These trusted resources can help.
                </p>
                <div className="space-y-5">
                  {hotlines.map((h) => (
                    <div key={h.name} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                      <p className="font-semibold text-white text-sm">{h.name}</p>
                      <a href={`tel:${h.number}`} className="text-sky-600 font-bold text-lg hover:underline">{h.number}</a>
                      <p className="text-white/50 text-xs mt-0.5">{h.hours}</p>
                      <p className="text-white/60 text-xs mt-1">{h.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-600/20">
                <h2 className="font-bold text-slate-900 mb-3">Trusted Resources</h2>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: "CDC Vaccines & Immunizations", href: "https://cdc.gov/vaccines" },
                    { label: "WHO Vaccine Safety", href: "https://www.who.int/health-topics/vaccines-and-immunization" },
                    { label: "Vaccines.gov Finder", href: "https://www.vaccines.gov/" },
                    { label: "AAP Immunization", href: "https://aap.org" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How to get vaccinated */}
        <section className="py-14 bg-sky-50 border-t border-sky-600/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Getting Vaccinated</p>
              <h2 className="text-2xl font-bold text-slate-900">Ready to go? Here&apos;s what to know</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-sky-600/20 p-5">
                <div className="w-10 h-10 rounded-full bg-sky-600/15 flex items-center justify-center mb-3">
                  <Syringe className="h-5 w-5 text-sky-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Where to get vaccinated</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vaccines are available at your doctor&apos;s office, community health clinics, pharmacies (CVS, Walgreens, Rite Aid), and local health departments. Use the map above to find a provider near you.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-sky-600/20 p-5">
                <div className="w-10 h-10 rounded-full bg-sky-600/15 flex items-center justify-center mb-3">
                  <Info className="h-5 w-5 text-sky-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Preparing for your appointment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bring your vaccination record or immunization history, your insurance card if applicable, and a list of any allergies or current medications. Let your provider know if you are immunocompromised or pregnant, as some vaccines have specific recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
