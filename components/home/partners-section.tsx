import { Shield } from "lucide-react"

const partners = [
  "University of Michigan",
  "UM School of Public Health",
  "Michigan Medicine",
  "Ross Business School",
  "Cass Clinic",
  "Jackson Public Schools",
  "Huron High School",
  "UM Optimize",
]

export function PartnersSection() {
  return (
    <section className="py-14 bg-[--navy]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Trusted By</p>
          <h2 className="text-2xl font-bold text-white text-balance">
            Built in partnership with institutions that matter.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex items-center gap-2 bg-white/8 rounded-full px-5 py-2.5 border border-white/15 text-white/70 text-sm font-medium"
            >
              <Shield className="h-4 w-4 text-[--sky]" aria-hidden="true" />
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
