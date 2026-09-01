import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart2, TrendingUp, Heart } from "lucide-react"
import { LiveMetrics } from "@/components/impact/live-metrics"
import { CATEGORY_LABELS, CATEGORY_ORDER, futureCollaboration, partnersByCategory } from "@/lib/partners"

const caseStudies = [
  {
    site: "Huron High School, Ann Arbor",
    type: "High School Classroom Pilot",
    summary: "Health science students completed both the Original and Case Study worksheets paired with the herd immunity simulator. Teachers reported significantly higher student engagement compared to traditional public health lectures.",
    outcome: "92% of students could explain herd immunity after the lesson.",
  },
  {
    site: "Jackson Public School System",
    type: "District Curriculum Integration",
    summary: "VaxShield materials were piloted across multiple health classrooms. The case study worksheet generated notable discussion and critical thinking, with students connecting vaccine science to their own community experiences.",
    outcome: "Educators requested full implementation for the following semester.",
  },
  {
    site: "Cass Clinic, Detroit",
    type: "Community Clinic Distribution",
    summary: "Pamphlets and infographics were distributed in the clinic waiting area and during health education sessions. Clinic staff noted that patients referenced the materials during conversations about vaccine hesitancy.",
    outcome: "Materials well-received; clinic requested additional bilingual versions.",
  },
]

const fundAllocation = [
  { category: "Curriculum & Resource Development", percent: 45 },
  { category: "Community Outreach & Pilots", percent: 25 },
  { category: "Platform & Technology", percent: 15 },
  { category: "Research & Advisor Support", percent: 10 },
  { category: "Operations", percent: 5 },
]

const partnerTypes = [
  ...CATEGORY_ORDER.map((c) => ({
    category: CATEGORY_LABELS[c],
    partners: partnersByCategory(c).map((p) => p.name),
  })),
  { category: "Future Collaboration", partners: futureCollaboration },
]

export default function ImpactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-16 px-4 text-center">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Impact & Partnerships</p>
          <h1 className="text-4xl font-bold mb-4 text-balance">VaxShield is not just an idea. It&apos;s operating.</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Here is our measurable reach, our real-world partners, and a transparent look at where funds are going and why this work matters.
          </p>
        </section>

        {/* Metrics */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Live Metrics</p>
              <h2 className="text-3xl font-bold text-slate-900">Our reach, measured</h2>
            </div>
            <LiveMetrics />
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Metrics updated regularly. Includes website visits, simulator usage, resource downloads, and community engagement events.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 bg-sky-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Proof Points</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">Pilot results & outcomes</h2>
            </div>
            <div className="space-y-6">
              {caseStudies.map(({ site, type, summary, outcome }) => (
                <div key={site} className="bg-white rounded-2xl border border-sky-600/20 p-6">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <div>
                      <p className="font-bold text-slate-900">{site}</p>
                      <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider">{type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{summary}</p>
                  <div className="flex items-center gap-2 bg-sky-50 rounded-lg px-4 py-2">
                    <TrendingUp className="h-4 w-4 text-sky-600 shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-900">{outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fund allocation */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Transparency</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">Where funds go</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                VaxShield is committed to using every dollar in service of our mission. Here is how contributions are allocated.
              </p>
            </div>
            <div className="bg-sky-50 rounded-2xl border border-sky-600/20 p-6 space-y-4">
              {fundAllocation.map(({ category, percent }) => (
                <div key={category}>
                  <div className="flex justify-between text-sm font-medium text-slate-900 mb-1">
                    <span>{category}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2.5 bg-white rounded-full overflow-hidden border border-sky-600/10">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                      aria-label={`${category}: ${percent}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Fund allocation is updated annually. VaxShield does not pay for advertising with donations.
            </p>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Our Network</p>
              <h2 className="text-3xl font-bold text-balance">Partners & collaborators</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerTypes.map(({ category, partners }) => (
                <div key={category} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-sky-600 text-xs font-semibold uppercase tracking-wider mb-3">{category}</p>
                  <ul className="space-y-2">
                    {partners.map((p) => (
                      <li key={p} className="text-sm text-white/70 flex items-center gap-2">
                        <BarChart2 className="h-3.5 w-3.5 text-sky-600/50 shrink-0" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-sky-50 text-center px-4">
          <div className="mx-auto max-w-2xl">
            <Heart className="h-10 w-10 text-sky-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3 text-balance">Help us grow this impact</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Whether you want to fund a classroom, partner with us as an organization, or spread the word, every action counts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-sky-600 text-white hover:bg-sky-600/80">
                <Link href="/contact?type=donate">Donate to VaxShield</Link>
              </Button>
              <Button asChild variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white">
                <Link href="/organizations">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
