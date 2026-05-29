"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  School, Stethoscope, Building2, Users,
  CheckCircle, Package, Presentation, BookOpen,
  Video, Wrench, CheckCircle2, GraduationCap, Heart, Syringe, Info
} from "lucide-react"

const offerings = [
  {
    icon: Presentation,
    title: "Classroom Lesson Packs",
    description: "Complete standards-aligned lesson plan sets with educator guides, worksheets, and simulator integration. Suitable for 1–5 classrooms.",
    audiences: ["Schools"],
    available: true,
    longTerm: false,
  },
  {
    icon: Package,
    title: "Elementary Literacy Kits",
    description: "Hands-on kits for K–5 classrooms including germ-spread demonstrations, colorful worksheets, and teacher facilitator guides.",
    audiences: ["Schools", "Districts"],
    available: false,
    longTerm: false,
  },
  {
    icon: BookOpen,
    title: "Clinic Patient Education Kits",
    description: "Pamphlet sets, infographic bundles, and patient-facing materials for waiting rooms, intake conversations, and community health events.",
    audiences: ["Clinics", "Hospitals"],
    available: true,
    longTerm: false,
  },
  {
    icon: Video,
    title: "Provider Training Modules",
    description: "Short training modules for healthcare providers covering vaccine communication, addressing hesitancy, and using VaxShield materials with patients.",
    audiences: ["Clinics", "Hospitals"],
    available: false,
    longTerm: true,
  },
  {
    icon: Wrench,
    title: "District Implementation Package",
    description: "Full curriculum support for school districts: lesson plans, teacher training, implementation guidance, and access to digital resources.",
    audiences: ["Districts", "Nonprofits"],
    available: false,
    longTerm: true,
  },
  {
    icon: Users,
    title: "Workshop & Community Training",
    description: "Live or virtual workshops for community organizations, afterschool programs, and parent groups. Facilitation support available.",
    audiences: ["Nonprofits", "Community"],
    available: false,
    longTerm: false,
  },
]

const orgTypes = [
  { icon: School, label: "Schools & Districts", description: "Curriculum support, classroom kits, and district-scale rollout packages." },
  { icon: Stethoscope, label: "Clinics & Hospitals", description: "Patient education materials, provider training, and clinic distribution programs." },
  { icon: Building2, label: "Nonprofits & Community Programs", description: "Workshops, outreach kits, and partnership programs for community organizations." },
  { icon: Users, label: "Afterschool & Youth Programs", description: "Age-appropriate materials and facilitation support for youth-serving organizations." },
]

const process = [
  { step: "1", title: "Submit an Inquiry", body: "Fill out the form below with your organization type and what you need. We respond within 3 business days." },
  { step: "2", title: "Scoping Call", body: "We schedule a brief call to understand your context, goals, and the best materials and support for your setting." },
  { step: "3", title: "Pilot or Implementation", body: "We provide materials, guidance, and implementation support. Pilots are typically free for qualifying organizations." },
  { step: "4", title: "Evaluate & Expand", body: "We collect feedback and outcomes, then work with you to refine the implementation and scale impact." },
]

function JoinForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", school: "", year: "", role: "student", message: "" })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-sky-600/20 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-sky-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">You&apos;re in!</h3>
        <p className="text-muted-foreground">We&apos;ll reach out soon with next steps for joining or starting your chapter.</p>
        <Button className="mt-6 bg-sky-600 text-white hover:bg-sky-600/80" onClick={() => setSubmitted(false)}>
          Submit another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sky-600/20 p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="join-name">Your Name</Label>
          <Input id="join-name" placeholder="Jane Smith" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="join-email">Email</Label>
          <Input id="join-email" type="email" placeholder="jane@school.edu" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="join-role">I am a...</Label>
        <select
          id="join-role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="student">High school student</option>
          <option value="college">College student</option>
          <option value="educator">Educator / Teacher</option>
          <option value="volunteer">Community volunteer</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="join-school">School / Institution</Label>
          <Input id="join-school" placeholder="Huron High School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="join-year">Graduation Year</Label>
          <Input id="join-year" placeholder="2026" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="join-message">How do you want to get involved?</Label>
        <Textarea
          id="join-message"
          placeholder="Tell us about your interest — starting a chapter, volunteering, spreading awareness at your school..."
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="lg" disabled={loading} className="w-full bg-sky-600 text-white hover:bg-sky-600/80 font-semibold">
        {loading ? "Sending…" : "Join VaxShield"}
      </Button>
    </form>
  )
}

export default function OrganizationsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", org: "", orgType: "school", size: "", message: "" })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-16 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">For Organizations</p>
            <h1 className="text-4xl font-bold mb-4 text-balance">
              Bring VaxShield to your school, clinic, or organization.
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              VaxShield offers tailored educational kits, training materials, and implementation support for schools, clinics, districts, hospitals, and nonprofits.
            </p>
            <Button asChild className="bg-sky-600 text-white hover:bg-sky-600/80 font-semibold">
              <Link href="#request">Request Materials or Demo</Link>
            </Button>
          </div>
        </section>

        {/* Who we serve */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Who We Work With</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">Built for institutional adoption</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {orgTypes.map(({ icon: Icon, label, description }) => (
                <div key={label} className="bg-sky-50 rounded-2xl p-5 border border-sky-600/20">
                  <div className="w-10 h-10 rounded-full bg-sky-600/15 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="py-16 bg-[--sky-light]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Offer</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">Materials, training, and implementation support</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                VaxShield can support pilots, classroom use, clinic distribution, and full program implementation. Pricing is added as capacity grows.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {offerings.map(({ icon: Icon, title, description, audiences, available, longTerm }) => (
                <div key={title} className="bg-white rounded-2xl border border-sky-600/20 p-5 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-600/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    </div>
                    <Badge variant={available ? "default" : "secondary"} className={available ? "bg-sky-600 text-white border-0" : ""}>
                      {available ? "Available" : longTerm ? "Long-term Goal" : "Coming Soon"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {audiences.map((a) => (
                      <span key={a} className="text-xs border border-sky-600/25 text-slate-900 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">How It Works</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">From inquiry to implementation</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map(({ step, title, body }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-center mb-6">Why organizations choose VaxShield</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Expert-reviewed, standards-aligned content",
                "Free pilot access for qualifying organizations",
                "Dedicated implementation support",
                "Audience-specific materials (K–5 through adult)",
                "Evidence-based, non-fear-based approach",
                "Developed in partnership with UM and Michigan Medicine",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-sky-600 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Vaccinated / Minor Consent */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Getting Vaccinated</p>
              <h2 className="text-3xl font-bold text-slate-900 text-balance">How to get vaccinated — at any age</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Whether you are a student, parent, or healthcare provider, here is what you need to know about accessing vaccines.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <div className="bg-sky-50 rounded-2xl border border-sky-600/20 p-5">
                <div className="w-10 h-10 rounded-full bg-sky-600/15 flex items-center justify-center mb-3">
                  <Syringe className="h-5 w-5 text-sky-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Where to get vaccinated</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vaccines are available at your doctor's office, community health clinics, pharmacies (CVS, Walgreens, Meijer), and local health departments. Use our{" "}
                  <Link href="/vaxsearch" className="text-sky-600 hover:underline">VaxSearch tool</Link> to find a location near you, including free options.
                </p>
              </div>
              <div className="bg-sky-50 rounded-2xl border border-sky-600/20 p-5">
                <div className="w-10 h-10 rounded-full bg-sky-600/15 flex items-center justify-center mb-3">
                  <Info className="h-5 w-5 text-sky-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Preparing for your appointment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bring your vaccination record (or Michigan Care Improvement Registry number), your insurance card if applicable, and a list of any allergies or current medications. Let your provider know if you are immunocompromised or pregnant, as some vaccines have specific recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Team */}
        <section id="join" className="py-16 bg-[--sky-light]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Join the Team</p>
                <h2 className="text-3xl font-bold text-slate-900 text-balance mb-4">
                  Start or join a VaxShield chapter
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We welcome passionate students, educators, and health advocates to join VaxShield — whether as an individual volunteer, a school chapter leader, or a college program partner.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  If you are interested in starting a VaxShield chapter at your high school or college, fill out the form and tell us about your school and graduation year. We will provide materials, mentorship, and support to get your chapter off the ground.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Heart, text: "Volunteer as a youth health educator" },
                    { icon: School, text: "Start a chapter at your high school or college" },
                    { icon: GraduationCap, text: "Earn community service or leadership hours" },
                    { icon: Users, text: "Join our national ambassador network" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-600/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-sky-600" aria-hidden="true" />
                      </div>
                      <p className="text-sm text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <JoinForm />
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section id="request" className="py-16 bg-sky-50">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Get Started</p>
              <h2 className="text-3xl font-bold text-slate-900">Request a demo or materials</h2>
              <p className="text-muted-foreground mt-2">No commitment required. We will reach out within 3 business days.</p>
            </div>
            {submitted ? (
              <div className="bg-white rounded-2xl border border-sky-600/20 p-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-sky-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Inquiry Received!</h3>
                <p className="text-muted-foreground">We&apos;ll be in touch within 3 business days to set up a scoping conversation.</p>
                <Button className="mt-6 bg-sky-600 text-white hover:bg-sky-600/80" onClick={() => setSubmitted(false)}>
                  Submit another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sky-600/20 p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="org-name">Your Name</Label>
                    <Input id="org-name" placeholder="Dr. Jane Smith" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="org-email">Work Email</Label>
                    <Input id="org-email" type="email" placeholder="jane@yourorg.org" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="org-org">Organization Name</Label>
                  <Input id="org-org" placeholder="Jefferson Middle School / City Health Clinic..." required value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="org-type">Organization Type</Label>
                    <select
                      id="org-type"
                      value={form.orgType}
                      onChange={(e) => setForm({ ...form, orgType: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="school">School</option>
                      <option value="district">School District</option>
                      <option value="clinic">Clinic</option>
                      <option value="hospital">Hospital</option>
                      <option value="nonprofit">Nonprofit</option>
                      <option value="community">Community Program</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="org-size">Approximate Size</Label>
                    <Input id="org-size" placeholder="e.g. 300 students, 5 clinicians..." value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="org-message">What are you looking for?</Label>
                  <Textarea
                    id="org-message"
                    placeholder="Tell us about your setting, what materials or support you are interested in, and any relevant context..."
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" size="lg" disabled={loading} className="w-full bg-sky-600 text-white hover:bg-sky-600/80 font-semibold">
                  {loading ? "Sending…" : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
