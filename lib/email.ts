import nodemailer from "nodemailer"

const TO = "vaxshieldteam@gmail.com"

/**
 * Escape user-supplied text before interpolating it into an email HTML body.
 * Without this, a `<script>` or stray tag in a form field lands in the message.
 */
export function esc(value: string | undefined | null): string {
  if (!value) return ""
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Escape, then convert newlines to <br/> for multi-line fields. */
export function escMultiline(value: string | undefined | null): string {
  return esc(value).replace(/\n/g, "<br/>")
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new EmailConfigError(
      "GMAIL_USER and GMAIL_APP_PASSWORD must both be set for email delivery"
    )
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  })
  return transporter
}

/** Thrown when SMTP credentials are missing, so it can be logged distinctly from a send failure. */
export class EmailConfigError extends Error {}

/**
 * Send one notification email to the VaxShield inbox.
 * Throws on failure; callers are expected to catch, log, and return a 502.
 */
export async function sendNotification(opts: {
  fromLabel: string
  subject: string
  html: string
  replyTo?: string
}): Promise<void> {
  const from = `"${opts.fromLabel}" <${process.env.GMAIL_USER}>`
  await getTransporter().sendMail({
    from,
    to: TO,
    subject: opts.subject,
    html: opts.html,
    // Lets the team hit Reply and reach the submitter directly.
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  })
}

/**
 * Shared failure handling for the three form routes. Logs the real cause to the
 * server (visible in Vercel function logs) and returns a safe message for the client.
 */
export function describeEmailFailure(route: string, err: unknown): string {
  if (err instanceof EmailConfigError) {
    console.error(`[${route}] email not configured: ${err.message}`)
    return "Email delivery is not configured. Please email vaxshieldteam@gmail.com directly."
  }
  const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  console.error(`[${route}] sendMail failed: ${detail}`)
  return "We could not send your message right now. Please try again, or email vaxshieldteam@gmail.com directly."
}
