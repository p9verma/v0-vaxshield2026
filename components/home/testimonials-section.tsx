import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "VaxShield gave us materials we could actually use in the classroom. Students were engaged in a way we hadn't seen with other health content. They were asking real questions.",
    author: "Educator",
    role: "Huron High School, Ann Arbor",
  },
  {
    quote: "I didn't know much about herd immunity before. The simulator made it click for me. I actually showed my parents after class.",
    author: "Student",
    role: "Jackson Public School System",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Community Stories</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance">Real voices. Real impact.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map(({ quote, author, role }) => (
            <figure key={author} className="bg-[--sky-pale] rounded-2xl p-6 border border-[--sky]/20">
              <Quote className="h-8 w-8 text-[--sky]/30 mb-3" aria-hidden="true" />
              <blockquote className="text-[--navy] leading-relaxed mb-4 text-sm">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption>
                <p className="font-semibold text-[--navy] text-sm">{author}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
