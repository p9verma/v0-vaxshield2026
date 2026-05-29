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

const roleLabels: Record<string, string> = {
  student: "High school student",
  college: "College student",
  educator: "Educator / Teacher",
  volunteer: "Community volunteer",
  other: "Other",
}

export async function POST(req: NextRequest) {
  const { name, email, school, year, role, message } = await req.json()

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  await transporter.sendMail({
    from: `"VaxShield" <${process.env.GMAIL_USER}>`,
    to: "vaxshieldteam@gmail.com",
    subject: `New Team Application: ${name}`,
    html: `
      <h2>New Join the Team Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Role:</strong> ${roleLabels[role] ?? role}</p>
      <p><strong>School / Institution:</strong> ${school || "Not provided"}</p>
      <p><strong>Graduation Year:</strong> ${year || "Not provided"}</p>
      <hr />
      <p><strong>How they want to get involved:</strong></p>
      <p>${message ? message.replace(/\n/g, "<br/>") : "No message provided"}</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
