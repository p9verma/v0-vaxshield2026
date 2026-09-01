import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Image as ImageIcon, BookOpen, FlaskConical, Video, Presentation, Package, ArrowRight } from "lucide-react"

const products = [
  {
    icon: Presentation,
    title: "Lesson Plans",
    description: "Standards-aligned lesson plans for high school classrooms, including simulator-based activities.",
    tag: "Available",
    tagVariant: "default" as const,
    href: "/resources",
  },
  {
    icon: FileText,
    title: "Worksheets",
    description: "Worksheet 1: Original and Worksheet 2: Case Study, the longer version judges loved.",
    tag: "Available",
    tagVariant: "default" as const,
    href: "/resources",
  },
  {
    icon: ImageIcon,
    title: "Infographics",
    description: "Emotional short-form and science-focused infographics for parents, students, and community distribution.",
    tag: "Available",
    tagVariant: "default" as const,
    href: "/resources",
  },
  {
    icon: Package,
    title: "Elementary Kits",
    description: "Hands-on vaccine literacy kits including germ-spread demonstration materials for younger learners.",
    tag: "In Development",
    tagVariant: "secondary" as const,
    href: "/organizations",
  },
  {
    icon: Video,
    title: "Educational Videos",
    description: "Short-form videos explaining disease spread, vaccine science, and herd immunity.",
    tag: "Long-term Goal",
    tagVariant: "secondary" as const,
    href: "/resources",
  },
  {
    icon: BookOpen,
    title: "Children's Book",
    description: "A children's book making vaccine concepts accessible and friendly for early learners.",
    tag: "In Development",
    tagVariant: "secondary" as const,
    href: "/organizations",
  },
  {
    icon: FlaskConical,
    title: "Training Modules",
    description: "Provider-facing training content for vaccine administrators, educators, and community health workers.",
    tag: "Long-term Goal",
    tagVariant: "secondary" as const,
    href: "/organizations",
  },
  {
    icon: Package,
    title: "Organizational Kits",
    description: "Full educational kits for schools, clinics, and districts, including printable and digital materials.",
    tag: "For Organizations",
    tagVariant: "outline" as const,
    href: "/organizations",
  },
]

export function ProductsSection() {
  return (
    <section className="py-16 bg-[--sky-light]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Our Products</p>
            <h2 className="text-3xl font-bold text-[--navy] text-balance">
              Tools teachers can trust.<br />Content students remember.
            </h2>
          </div>
          <Button asChild variant="outline" className="border-[--sky] text-[--sky] hover:bg-[--sky] hover:text-white gap-2 self-start sm:self-auto">
            <Link href="/resources">
              View All Resources
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(({ icon: Icon, title, description, tag, tagVariant, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col bg-white rounded-2xl p-5 border border-[--sky]/15 hover:border-[--sky]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[--sky]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[--sky]" aria-hidden="true" />
                </div>
                <Badge variant={tagVariant} className="text-xs">{tag}</Badge>
              </div>
              <h3 className="font-semibold text-[--navy] mb-1 group-hover:text-[--sky] transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
