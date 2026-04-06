import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserRound, GraduationCap, School, Stethoscope, ArrowRight } from "lucide-react"

const audiences = [
  {
    icon: UserRound,
    label: "Parents & Caregivers",
    description: "Clear, trustworthy answers to your vaccine questions. Find clinics, read myth-busting content, and access family-friendly materials.",
    href: "/resources?audience=parents",
    cta: "Resources for Parents",
  },
  {
    icon: GraduationCap,
    label: "Students",
    description: "Interactive simulations, engaging worksheets, and age-appropriate explanations that make public health real and relatable.",
    href: "/resources?audience=students",
    cta: "Student Resources",
  },
  {
    icon: School,
    label: "Schools & Educators",
    description: "Standards-aligned lesson plans, printable worksheets, and educational kits your classroom can use tomorrow.",
    href: "/resources?audience=educators",
    cta: "Educator Resources",
  },
  {
    icon: Stethoscope,
    label: "Healthcare Providers",
    description: "Pamphlets, training materials, and patient education resources to support vaccine conversations in clinical settings.",
    href: "/resources?audience=providers",
    cta: "Clinical Resources",
  },
]

export function AudienceSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Who We Serve</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance">Built for your community</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            VaxShield is designed with different audiences in mind. Find the resources most relevant to you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(({ icon: Icon, label, description, href, cta }) => (
            <div key={label} className="flex flex-col rounded-2xl border border-[--sky]/20 bg-[--sky-pale] p-6 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-full bg-[--sky]/15 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[--sky]" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-[--navy] mb-2">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
              <Button asChild variant="ghost" size="sm" className="mt-4 -ml-2 text-[--sky] hover:text-[--sky] hover:bg-[--sky]/10 justify-start gap-1 w-fit">
                <Link href={href}>
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
