"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Linkedin, CheckCircle2 } from "lucide-react"

const inquiryTypes = [
  { value: "school", label: "School Partnership" },
  { value: "sponsor", label: "Sponsorship" },
  { value: "media", label: "Media / Press" },
  { value: "volunteer", label: "Volunteer" },
  { value: "donate", label: "Donation Support" },
  { value: "general", label: "General Question" },
]

const VALID_TYPES = new Set(inquiryTypes.map((t) => t.value))

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", org: "", type: "general", message: "" })

  // Donate buttons across the site link to /contact?type=donate. Honour it so a
  // donation enquiry arrives labelled as one instead of "General Question".
  //
  // Read from window rather than useSearchParams: this page is statically
  // prerendered, and useSearchParams would force its Suspense boundary to stay
  // in the fallback, leaving the form unhydrated and silently falling back to a
  // native GET submit.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("type")
    if (requested && VALID_TYPES.has(requested)) {
      setForm((f) => ({ ...f, type: requested }))
    }
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        // The route returns a specific reason (validation message or delivery failure).
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? "Failed to send")
      }
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed to send"
          ? err.message
          : "Something went wrong. Please try again or email vaxshieldteam@gmail.com directly."
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-sky-600 mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Message received!</h2>
        <p className="text-muted-foreground max-w-sm">
          Thank you for reaching out. A member of the VaxShield team will be in touch shortly.
        </p>
        <Button className="mt-6 bg-sky-600 text-white hover:bg-sky-600/80" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sky-600/20 p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" placeholder="Jane Smith" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="jane@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org">Organization (optional)</Label>
        <Input id="org" placeholder="School, district, company..." value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="type">Type of Inquiry</Label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {inquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us how we can help or how you want to get involved..."
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="lg" disabled={loading} className="w-full bg-sky-600 text-white hover:bg-sky-600/80 font-semibold">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 text-white py-14 px-4 text-center">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-4xl font-bold mb-4 text-balance">Let&apos;s build healthier communities together.</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Whether you&apos;re a school, clinic, donor, volunteer, or just curious, we&apos;d love to hear from you.
          </p>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-600/20">
                <h2 className="font-bold text-slate-900 mb-4">Direct Contact</h2>
                <a href="mailto:vaxshieldteam@gmail.com" className="flex items-center gap-2 text-sky-600 hover:underline text-sm font-medium">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  vaxshieldteam@gmail.com
                </a>
                <p className="text-xs text-muted-foreground mt-3">
                  For urgent inquiries or press requests, please email directly.
                </p>
              </div>

              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-600/20">
                <h2 className="font-bold text-slate-900 mb-4">Ways to Get Involved</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Volunteer as a health educator",
                    "Become a youth ambassador",
                    "Partner as a school or district",
                    "Sponsor a classroom kit",
                    "Join our advisory network",
                    "Donate to support education",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 text-white">
                <h2 className="font-bold mb-3">Follow VaxShield</h2>
                <div className="flex gap-4">
                  <a href="https://linkedin.com/in/vaxshield-inc-5811143bb" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-600 transition-colors"><Linkedin className="h-5 w-5" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
