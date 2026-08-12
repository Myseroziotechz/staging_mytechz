import 'server-only'
import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return transporter
}

/**
 * Shared transactional email sender — extracted from the contact form route
 * so job-alert emails reuse the same SMTP transport/config instead of a
 * second copy. Throws if SMTP isn't configured or the send fails; callers
 * decide how to handle that (contact route surfaces it to the user, job
 * alert dispatch logs and continues so one bad send doesn't abort a batch).
 */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const t = getTransporter()
  if (!t) throw new Error('Mail service is not configured on the server')

  const { SMTP_FROM, SMTP_USER } = process.env
  const from = SMTP_FROM || `MyTechZ <${SMTP_USER}>`

  await t.sendMail({ from, to, replyTo, subject, html, text })
}
