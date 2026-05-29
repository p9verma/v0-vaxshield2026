"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, Clock, ChevronRight, Filter, AlertCircle } from "lucide-react"
import { clinicLocations } from "@/lib/clinic-data"

const ClinicMap = dynamic(
  () => import("@/components/clinic-map").then((m) => m.ClinicMap),
  { ssr: false, loading: () => (
    <div className="h-full flex items-center justify-center bg-sky-50 rounded-2xl">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  )}
)

const hotlines = [
  { name: "CDC Vaccine Hotline", number: "1-800-232-4636", hours: "Mon–Fri, 8am–8pm ET", description: "Questions about vaccines, schedules, and safety." },
  { name: "Michigan DHHS Immunization", number: "1-888-535-6136", hours: "Mon–Fri, 8am–5pm ET", description: "Michigan-specific vaccine program inquiries." },
  { name: "Nurse Advice Line (24/7)", number: "1-800-942-5678", hours: "24/7 availability", description: "Talk to a registered nurse any time." },
  { name: "Poison Control Center", number: "1-800-222-1222", hours: "24/7 availability", description: "Concerns about medication or vaccine reactions." },
]

const vaccineTypes = ["All", "Flu", "COVID", "MMR", "Tdap", "Hepatitis", "Travel"]

export default function VaxSearchPage() {
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [showFree, setShowFree] = useState(false)

  const filtered = useMemo(() => clinicLocations.filter((c) => {
    const matchQuery = query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.address.toLowerCase().includes(query.toLowerCase())
    const matchType = selectedType === "All" || c.types.some((t) => t.toLowerCase().includes(selectedType.toLowerCase()))
    const matchFree = !showFree || c.free
    return matchQuery && matchType && matchFree
  }), [query, selectedType, showFree])

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
              Locate nearby clinics, free vaccine programs, and trusted resources in your community.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Enter your city, zip code, or clinic name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-11 h-12 text-foreground bg-white border-0 shadow-lg rounded-xl"
                aria-label="Search for vaccine locations"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Map placeholder + filters */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {vaccineTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                      selectedType === type
                        ? "bg-sky-700 text-white border-sky-700"
                        : "border-sky-600/30 text-slate-900 hover:border-sky-600"
                    }`}
                    aria-pressed={selectedType === type}
                  >
                    {type}
                  </button>
                ))}
                <button
                  onClick={() => setShowFree(!showFree)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    showFree ? "bg-green-500 text-white border-green-500" : "border-sky-600/30 text-slate-900 hover:border-sky-600"
                  }`}
                  aria-pressed={showFree}
                >
                  Free Only
                </button>
              </div>

              {/* Interactive Map */}
              <div className="rounded-2xl overflow-hidden border border-sky-600/20 h-72 mb-6">
                <ClinicMap visibleClinics={filtered} />
              </div>

              {/* Clinic list */}
              <p className="text-sm text-muted-foreground mb-4">{filtered.length} locations found</p>
              <div className="space-y-4">
                {filtered.map((clinic) => (
                  <div key={clinic.name} className="bg-white rounded-2xl border border-sky-600/20 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{clinic.name}</h3>
                          {clinic.free && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Free</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {clinic.address}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                          {clinic.phone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {clinic.hours}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {clinic.types.map((t) => (
                            <span key={t} className="text-xs bg-sky-50 text-slate-900 border border-sky-600/20 px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-sky-600 hover:bg-sky-600/10 shrink-0 gap-1">
                        Directions
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="h-10 w-10 mx-auto mb-2 text-sky-600/40" aria-hidden="true" />
                    <p>No clinics match your search. Try adjusting filters.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Hotlines */}
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

              {/* Trusted resources */}
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
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline flex items-center gap-1"
                      >
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
