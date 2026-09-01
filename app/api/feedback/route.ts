import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { esc, escMultiline, sendNotification, describeEmailFailure } from "@/lib/email"

const topicLabels: Record<string, string> = {
  worksheet1: "Worksheet 1: Original",
  worksheet2: "Worksheet 2: Case Study",
  simulator: "VaxImpact Herd Immunity Simulator",
  both: "Worksheets + Simulator",
  other: "Other resource",
}

const FeedbackSchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  // Optional, but must be a real address when provided.
  email: z.string().trim().email("Please enter a valid email address").max(320).optional().or(z.literal("")),
  topic: z.string().trim().max(100).default("other"),
  feedback: z.string({ required_error: "Feedback is required" }).trim().min(1, "Feedback is required").max(5000),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = FeedbackSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Invalid submission" }, { status: 400 })
  }

  const { name, email, topic, feedback } = parsed.data
  const label = topicLabels[topic] ?? topic

  try {
    await sendNotification({
      fromLabel: "VaxShield Feedback",
      subject: `Feedback: ${label}`,
      replyTo: email || undefined,
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Topic:</strong> ${esc(label)}</p>
        <p><strong>Name:</strong> ${esc(name) || "Anonymous"}</p>
        <p><strong>Email:</strong> ${esc(email) || "Not provided"}</p>
        <hr />
        <p><strong>Feedback:</strong></p>
        <p>${escMultiline(feedback)}</p>
      `,
    })
  } catch (err) {
    return NextResponse.json({ error: describeEmailFailure("feedback", err) }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
