import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const topicLabels: Record<string, string> = {
  worksheet1: "Worksheet 1: Original",
  worksheet2: "Worksheet 2: Case Study",
  simulator: "VaxImpact Herd Immunity Simulator",
  both: "Worksheets + Simulator",
  other: "Other resource",
}

export async function POST(req: NextRequest) {
  const { name, email, topic, feedback } = await req.json()

  if (!feedback?.trim()) {
    return NextResponse.json({ error: "Feedback is required" }, { status: 400 })
  }

  await transporter.sendMail({
    from: `"VaxShield Feedback" <${process.env.GMAIL_USER}>`,
    to: "vaxshieldteam@gmail.com",
    subject: `Feedback: ${topicLabels[topic] ?? topic}`,
    html: `
      <h2>New Feedback Submission</h2>
      <p><strong>Topic:</strong> ${topicLabels[topic] ?? topic}</p>
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <hr />
      <p><strong>Feedback:</strong></p>
      <p>${feedback.replace(/\n/g, "<br/>")}</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
