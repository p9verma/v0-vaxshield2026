import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { esc, escMultiline, sendNotification, describeEmailFailure } from "@/lib/email"

const roleLabels: Record<string, string> = {
  student: "High school student",
  college: "College student",
  educator: "Educator / Teacher",
  volunteer: "Community volunteer",
  other: "Other",
}

const JoinSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(1, "Name is required").max(200),
  email: z.string({ required_error: "Email is required" }).trim().min(1, "Email is required").email("Please enter a valid email address").max(320),
  school: z.string().trim().max(300).optional().or(z.literal("")),
  year: z.string().trim().max(50).optional().or(z.literal("")),
  role: z.string().trim().max(100).default("other"),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = JoinSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Invalid submission" }, { status: 400 })
  }

  const { name, email, school, year, role, message } = parsed.data

  try {
    await sendNotification({
      fromLabel: "VaxShield",
      subject: `New Team Application: ${name}`,
      replyTo: email,
      html: `
        <h2>New Join the Team Submission</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Role:</strong> ${esc(roleLabels[role] ?? role)}</p>
        <p><strong>School / Institution:</strong> ${esc(school) || "Not provided"}</p>
        <p><strong>Graduation Year:</strong> ${esc(year) || "Not provided"}</p>
        <hr />
        <p><strong>How they want to get involved:</strong></p>
        <p>${message ? escMultiline(message) : "No message provided"}</p>
      `,
    })
  } catch (err) {
    return NextResponse.json({ error: describeEmailFailure("join", err) }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
