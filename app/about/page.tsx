import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Target, Eye, Heart, Users, BookOpen } from "lucide-react"

const partners = [
  { name: "University of Michigan", role: "Academic home and Optimize program support" },
  { name: "UM School of Public Health", role: "Advisors, research collaboration, and expert review" },
  { name: "Michigan Medicine", role: "Clinician advisors and public health expertise" },
  { name: "Ross Business School", role: "Strategy and organizational development support" },
  { name: "Cass Clinic — Detroit", role: "Pilot site and community healthcare partner" },
  { name: "Jackson Public School System", role: "Classroom pilot and student engagement partner" },
  { name: "Huron High School — Ann Arbor", role: "Curriculum testing and educator feedback" },
  { name: "UM Optimize Program", role: "Startup and nonprofit development support" },
]

const values = [
  { icon: BookOpen, title: "Education, Not Fear", body: "We believe in empowering people with knowledge, not alarming them. Every resource is designed to build understanding, not anxiety." },
  { icon: Users, title: "Community-Centered", body: "VaxShield is built around the communities most affected by vaccine hesitancy — with their voices, their stories, and their needs front and center." },
  { icon: Target, title: "Science-Backed", body: "Everything we create is grounded in public health evidence, reviewed by clinical and academic advisors, and updated as science evolves." },
  { icon: Heart, title: "Empowering Youth", body: "Young people are often left out of health conversations, yet directly affected by vaccine decisions. VaxShield puts them at the center." },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[--navy] text-white py-16 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="w-16 h-16 rounded-full bg-[--sky]/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-[--sky]" aria-hidden="true" />
            </div>
            <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">About VaxShield</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-balance mb-6">
              Rooted in community.<br />Built on science.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              VaxShield is a digital and classroom resource designed to reduce vaccine stigma by teaching the science behind infectious diseases and vaccines — in a way that is accessible, engaging, and empowering.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
                <h2 className="text-3xl font-bold text-[--navy] text-balance mb-4">Why we started VaxShield</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  VaxShield was founded in communities where vaccine conversations are often shaped by hesitation, historical mistrust, and rapidly spreading misinformation. The founders recognized that existing resources were either too clinical, too fear-based, or simply not reaching the people who needed them most.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The goal was never to lecture or alarm. It was to meet people where they are — with curiosity, with respect, and with tools that make complex public health science genuinely understandable and interesting.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From its roots at the University of Michigan, VaxShield has grown into a platform connecting students, educators, clinicians, and communities around a shared belief: that informed communities are healthier communities.
                </p>
              </div>
              <div className="bg-[--sky-pale] rounded-2xl p-8 border border-[--sky]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-[--sky]" aria-hidden="true" />
                  <h3 className="font-bold text-[--navy] text-lg">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A world where every student understands how vaccines work, every community has access to honest public health education, and misinformation no longer drives decisions that affect lives.
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-[--sky]" aria-hidden="true" />
                  <h3 className="font-bold text-[--navy] text-lg">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To reduce vaccine stigma and misinformation through engaging, science-backed educational tools that foster curiosity, scientific literacy, and community responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[--sky-pale]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">What We Believe</p>
              <h2 className="text-3xl font-bold text-[--navy] text-balance">Our core principles</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-[--sky]/20">
                  <div className="w-10 h-10 rounded-full bg-[--sky]/15 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[--sky]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-[--navy] mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Our Partners</p>
              <h2 className="text-3xl font-bold text-[--navy] text-balance">Collaborative, advisor-informed, expert-connected</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                VaxShield is student-led but never alone. We are built with and supported by a network of public health professionals, clinicians, educators, and institutions.
              </p>
            </div>
            <div className="space-y-3">
              {partners.map(({ name, role }) => (
                <div key={name} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[--sky-pale] rounded-xl px-5 py-4 border border-[--sky]/20 gap-1">
                  <p className="font-semibold text-[--navy]">{name}</p>
                  <p className="text-sm text-muted-foreground">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[--navy] text-white text-center px-4">
          <h2 className="text-2xl font-bold mb-3 text-balance">Ready to get involved?</h2>
          <p className="text-white/65 mb-6 max-w-lg mx-auto">
            Whether you want to partner, donate, volunteer, or bring VaxShield to your school or clinic — we want to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-[--sky] text-white hover:bg-[--sky]/80">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/impact">See Our Impact</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
