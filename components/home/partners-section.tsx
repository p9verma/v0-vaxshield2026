import { Shield } from "lucide-react"
import { featuredPartners } from "@/lib/partners"

export function PartnersSection() {
  return (
    <section className="py-14 bg-blue-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2">Trusted By</p>
          <h2 className="text-2xl font-bold text-white text-balance">
            Built in partnership with institutions that matter.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {featuredPartners.map(({ name }) => (
            <div
              key={name}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5 border border-white/20 text-white text-sm font-medium"
            >
              <Shield className="h-4 w-4 text-sky-500" aria-hidden="true" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
