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

export async function POST(req: NextRequest) {
  const { name, email, org, orgType, size, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
  }

  await transporter.sendMail({
    from: `"VaxShield Inquiries" <${process.env.GMAIL_USER}>`,
    to: "vaxshieldteam@gmail.com",
    subject: `Organization Inquiry: ${org || name}`,
    html: `
      <h2>New Organization Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organization:</strong> ${org || "Not provided"}</p>
      <p><strong>Organization Type:</strong> ${orgType}</p>
      <p><strong>Approximate Size:</strong> ${size || "Not provided"}</p>
      <hr />
      <p><strong>What they're looking for:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
