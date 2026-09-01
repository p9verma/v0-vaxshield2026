import { featuredPartners } from "@/lib/partners"

export function PartnersSection() {
  return (
    <section className="py-14 bg-blue-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Deliberately describes feedback received, not endorsement given. None
            of these institutions has reviewed, approved, or endorsed VaxShield.
            The shield icon was removed from each pill because a badge beside an
            institution name reads as a seal of certification. */}
        <div className="text-center mb-8">
          <p className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2">Our Collaborators</p>
          <h2 className="text-2xl font-bold text-white text-balance max-w-3xl mx-auto">
            Developed with feedback from educators, clinicians, researchers, and institutional collaborators at:
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {featuredPartners.map(({ name }) => (
            <div
              key={name}
              className="bg-white/10 rounded-full px-5 py-2.5 border border-white/20 text-white text-sm font-medium"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
