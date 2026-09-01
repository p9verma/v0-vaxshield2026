"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, MessageSquare } from "lucide-react"

export function FeedbackSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", topic: "worksheet1", feedback: "" })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/feedback", {
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

  return (
    <section className="py-16 bg-[--sky-light]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-600/10 mb-4">
            <MessageSquare className="h-6 w-6 text-sky-600" aria-hidden="true" />
          </div>
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Share Your Experience</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance mb-3">
            Feedback on our tools
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Used a worksheet or the simulator in your class, clinic, or community? Let us know what worked and what we can improve.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-sky-600/20 p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-sky-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h3>
            <p className="text-muted-foreground">Your feedback helps us improve our tools for students and educators everywhere.</p>
            <Button className="mt-6 bg-sky-600 text-white hover:bg-sky-600/80" onClick={() => setSubmitted(false)}>
              Submit more feedback
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sky-600/20 p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fb-name">Your Name (optional)</Label>
                <Input id="fb-name" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fb-email">Email (optional)</Label>
                <Input id="fb-email" type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fb-topic">What are you giving feedback on?</Label>
              <select
                id="fb-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="worksheet1">Worksheet 1: Original</option>
                <option value="worksheet2">Worksheet 2: Case Study</option>
                <option value="simulator">VaxImpact Herd Immunity Simulator</option>
                <option value="both">Worksheets + Simulator</option>
                <option value="other">Other resource</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fb-feedback">Your feedback</Label>
              <Textarea
                id="fb-feedback"
                placeholder="What worked well? What could be improved? How did students respond? Any bugs or suggestions?"
                rows={5}
                required
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" size="lg" disabled={loading} className="w-full bg-sky-600 text-white hover:bg-sky-600/80 font-semibold">
              {loading ? "Sending…" : "Submit Feedback"}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
