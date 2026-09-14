"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Download, Search, ExternalLink, BookOpen } from "lucide-react"

/**
 * Every type a resource can have. The filter row is derived from what is
 * actually in `resources` below, so adding an infographic or pamphlet to the
 * array is all that is needed to make its chip appear.
 */
type ResourceType = "Lesson Plan" | "Worksheet" | "Infographic" | "Video" | "Kit" | "Pamphlet"
type TypeFilter = "All" | ResourceType
type Audience = "Students" | "Educators" | "Parents" | "Providers"
type AudienceFilter = "All" | Audience

const resources = [
  {
    title: "Worksheet 1: Original",
    description: "A foundational worksheet covering vaccine basics, disease spread, and herd immunity concepts, suitable for grades 9–12.",
    type: "Worksheet" as ResourceType,
    audience: ["Students", "Educators"] as Audience[],
    icon: FileText,
    free: true,
    featured: true,
    file: "/downloads/VaxImpact-Simulator-Worksheet.pdf",
  },
  {
    title: "Worksheet 2: Case Study",
    description: "The longer, case-study version and judges' favorite. Students analyze a real-world outbreak scenario and apply herd immunity concepts.",
    type: "Worksheet" as ResourceType,
    audience: ["Students", "Educators"] as Audience[],
    icon: FileText,
    free: true,
    featured: true,
    file: "/downloads/VaxImpact-Simulator-Case-Study.pdf",
  },
  {
  title: "NGSS-Aligned Worksheet: Printed Version",
  description:
    "A printable, NGSS-aligned investigation where students use the VaxImpact simulator to explore disease transmission, collect and analyze data, graph results, and evaluate how vaccination rates affect outbreaks.",
  type: "Worksheet" as ResourceType,
  audience: ["Students", "Educators"] as Audience[],
  icon: FileText,
  free: true,
  featured: true,
  file: "/downloads/VaxImpact_NGSS_Printed_Version_Document.pdf",
  },
  {
  title: "NGSS-Aligned Worksheet: Online Version",
  description:
    "A digital-friendly, NGSS-aligned investigation where students use computational modeling to test vaccination rates, analyze repeated trials, graph outbreak data, make predictions, and evaluate model limitations.",
  type: "Worksheet" as ResourceType,
  audience: ["Students", "Educators"] as Audience[],
  icon: FileText,
  free: true,
  featured: true,
  file: "/downloads/VaxImpact_NGSS_Colored_Online_Version.pdf",
  },
  {
  title: "VaxImpact Teacher Quick Guide",
  description:
    "A concise educator guide covering lesson goals, simulator controls, student workflow, classroom activity options, facilitation strategies, and important model limitations.",
  type: "Lesson Plan" as ResourceType,
  audience: ["Educators"] as Audience[],
  icon: BookOpen,
  free: true,
  featured: true,
  file: "/downloads/VaxImpact_Teacher_Quick_Guide.pdf",
  },
]

// Derived from the catalogue, so a chip is only ever offered when it has
// something behind it. Previously five of the seven chips matched nothing.
const types: TypeFilter[] = [
  "All",
  ...Array.from(new Set(resources.map((r) => r.type))),
]
const audiences: AudienceFilter[] = [
  "All",
  ...(["Students", "Educators", "Parents", "Providers"] as Audience[]).filter((a) =>
    resources.some((r) => r.audience.includes(a))
  ),
]

function handleDownload(file: string) {
  fetch("/api/track/download", { method: "POST" }).catch(() => {})
  const a = document.createElement("a")
  a.href = file
  a.download = ""
  a.click()
}

export default function ResourcesPage() {
  const [search, setSearch] = useState("")
  const [activeType, setActiveType] = useState<TypeFilter>("All")
  const [activeAudience, setActiveAudience] = useState<AudienceFilter>("All")

  const filtered = resources.filter((r) => {
    const matchSearch = search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    const matchType = activeType === "All" || r.type === activeType
    const matchAudience = activeAudience === "All" || r.audience.includes(activeAudience)
    return matchSearch && matchType && matchAudience
  })

  const featured = filtered.filter((r) => r.featured)
  // Only split out a "Featured" band when there is also something below it.
  // Otherwise every resource is featured and the second grid renders empty
  // under a count heading that claims results exist.
  const rest = filtered.filter((r) => !r.featured)
  const showFeaturedBand = featured.length > 0 && rest.length > 0
  const listed = showFeaturedBand ? rest : filtered

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-14 px-4 text-center">
          <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest mb-2">Resource Hub</p>
          <h1 className="text-4xl font-bold mb-4 text-balance text-white">
            Free tools for learning, teaching,<br />and building healthier communities.
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Every resource is designed with a specific audience and use case in mind: searchable, downloadable, and ready to use.
          </p>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-sky-600/20 p-5 mb-8 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search resources"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-muted-foreground self-center mr-1">Type:</span>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    activeType === t ? "bg-sky-600 text-white border-sky-600" : "border-sky-600/30 text-slate-900 hover:border-sky-600"
                  }`}
                  aria-pressed={activeType === t}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-muted-foreground self-center mr-1">Audience:</span>
              {audiences.map((a) => (
                <button
                  key={a}
                  onClick={() => setActiveAudience(a)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    activeAudience === a ? "bg-slate-900 text-white border-slate-900" : "border-sky-600/30 text-slate-900 hover:border-sky-600"
                  }`}
                  aria-pressed={activeAudience === a}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          {showFeaturedBand && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Featured Resources</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {featured.map((r) => {
                  const Icon = r.icon
                  return (
                    <div key={r.title} className="bg-sky-50 rounded-2xl border border-sky-600/30 p-5 flex flex-col ring-1 ring-sky-600/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-sky-600/15 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          <Badge className="bg-sky-600 text-white border-0 text-xs">Featured</Badge>
                          {r.free ? <Badge variant="outline" className="text-xs text-green-700 border-green-300">Free</Badge> : <Badge variant="outline" className="text-xs">Org Only</Badge>}
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{r.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                        {r.audience.map((a) => (
                          <span key={a} className="text-xs bg-white border border-sky-600/20 text-slate-900 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                      <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-600/80 gap-2 w-full" onClick={() => handleDownload(r.file)}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* All resources */}
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listed.map((r) => {
              const Icon = r.icon
              return (
                <div key={r.title} className="bg-white rounded-2xl border border-sky-600/20 p-5 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-sky-600/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-sky-600" aria-hidden="true" />
                    </div>
                    <div className="flex gap-1.5">
                      {r.free
                        ? <Badge variant="outline" className="text-xs text-green-700 border-green-300">Free</Badge>
                        : <Badge variant="outline" className="text-xs border-sky-600/30 text-sky-600">Org Only</Badge>
                      }
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{r.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{r.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3 mb-3">
                    <span className="text-xs bg-sky-50 text-slate-900 border border-sky-600/15 px-2 py-0.5 rounded-full">{r.type}</span>
                    {r.audience.map((a) => (
                      <span key={a} className="text-xs bg-sky-50 text-slate-900 border border-sky-600/15 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white gap-2" onClick={() => r.free && handleDownload(r.file)}>
                    {r.free ? <Download className="h-3.5 w-3.5" aria-hidden="true" /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                    {r.free ? "Download" : "Request Access"}
                  </Button>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-sky-600/40" aria-hidden="true" />
              <p>No resources match your search. Try different filters.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">Need organizational access?</h2>
            <p className="text-slate-300 mb-5">Schools, clinics, and districts can access premium kits and request bulk materials.</p>
            <Button asChild className="bg-sky-600 text-white hover:bg-sky-600/80 gap-2">
              <a href="/organizations">View Organizational Offerings</a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
