"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, ChevronRight, AlertCircle, Navigation, Loader2 } from "lucide-react"

export interface FoundClinic {
  id: number
  name: string
  address: string
  phone?: string
  lat: number
  lng: number
  type: string
}

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

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    { headers: { "Accept-Language": "en" } }
  )
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

async function fetchClinics(lat: number, lng: number): Promise<FoundClinic[]> {
  const radius = 10000
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="pharmacy"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["healthcare"="centre"](around:${radius},${lat},${lng});
    );
    out body;
  `
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  })
  const data = await res.json()

  return data.elements
    .filter((el: { tags?: { name?: string }; lat?: number; lon?: number }) => el.tags?.name && el.lat && el.lon)
    .map((el: { id: number; tags: Record<string, string>; lat: number; lon: number }) => ({
      id: el.id,
      name: el.tags.name,
      address: [el.tags["addr:housenumber"], el.tags["addr:street"], el.tags["addr:city"]]
        .filter(Boolean)
        .join(" ") || "Address not listed",
      phone: el.tags.phone || el.tags["contact:phone"],
      lat: el.lat,
      lng: el.lon,
      type: el.tags.amenity || el.tags.healthcare || "clinic",
    }))
}

export default function VaxSearchPage() {
  const [query, setQuery] = useState("")
  const [clinics, setClinics] = useState<FoundClinic[]>([])
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  const runSearch = async (lat: number, lng: number) => {
    setLoading(true)
    setError("")
    setSearched(true)
    setMapCenter({ lat, lng })
    try {
      const results = await fetchClinics(lat, lng)
      setClinics(results)
      if (results.length === 0) setError("No clinics found nearby. Try a different location.")
    } catch {
      setError("Failed to load results. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError("")
    const coords = await geocode(query)
    if (!coords) {
      setError("Location not found. Try a city name or zip code.")
      setLoading(false)
      return
    }
    await runSearch(coords.lat, coords.lng)
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false)
        await runSearch(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        setLocating(false)
        setError("Could not access your location.")
      }
    )
  }

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
              <Button type="submit" className="h-12 px-5 bg-sky-600 hover:bg-sky-600/80 text-white rounded-xl shrink-0" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
              </Button>
            </form>
            <button
              onClick={handleGeolocate}
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
                <ClinicMap visibleClinics={clinics} center={mapCenter} />
              </div>

              {/* Results */}
              {!searched && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-sky-600/40" aria-hidden="true" />
                  <p>Search a location above to find vaccine providers near you.</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-red-500">{error}</p>
                </div>
              )}

              {loading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-sky-600 animate-spin" />
                </div>
              )}

              {!loading && clinics.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{clinics.length} locations found</p>
                  <div className="space-y-4">
                    {clinics.map((clinic) => (
                      <div key={clinic.id} className="bg-white rounded-2xl border border-sky-600/20 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{clinic.name}</h3>
                              <Badge variant="secondary" className="text-xs capitalize">{clinic.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {clinic.address}
                            </p>
                            {clinic.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
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
      </main>
      <Footer />
    </div>
  )
}
