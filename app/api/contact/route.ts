import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { esc, escMultiline, sendNotification, describeEmailFailure } from "@/lib/email"

const typeLabels: Record<string, string> = {
  school: "School Partnership",
  sponsor: "Sponsorship",
  media: "Media / Press",
  volunteer: "Volunteer",
  donate: "Donation Support",
  general: "General Question",
}

const ContactSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(1, "Name is required").max(200),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(320),
  org: z.string().trim().max(300).optional().or(z.literal("")),
  type: z.string().trim().max(100).default("general"),
  message: z.string({ required_error: "Message is required" }).trim().min(1, "Message is required").max(5000),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Invalid submission" }, { status: 400 })
  }

  const { name, email, org, type, message } = parsed.data
  const label = typeLabels[type] ?? type

  try {
    await sendNotification({
      fromLabel: "VaxShield Contact",
      subject: `Contact: ${label} from ${name}`,
      replyTo: email,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Type of Inquiry:</strong> ${esc(label)}</p>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Organization:</strong> ${esc(org) || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escMultiline(message)}</p>
      `,
    })
  } catch (err) {
    return NextResponse.json({ error: describeEmailFailure("contact", err) }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
