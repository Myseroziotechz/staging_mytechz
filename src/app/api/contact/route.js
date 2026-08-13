import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER

    const safe = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

    await sendEmail({
      to,
      replyTo: email,
      subject: `[MyTechZ Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="margin:0 0 16px;color:#1e40af">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safe(name)}</p>
          <p><strong>Email:</strong> ${safe(email)}</p>
          <p><strong>Subject:</strong> ${safe(subject)}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="white-space:pre-wrap;line-height:1.6">${safe(message)}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('contact route error:', err)
    const message = err.message === 'Mail service is not configured on the server'
      ? err.message
      : 'Failed to send message'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
