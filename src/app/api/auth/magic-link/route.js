import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDisposableEmail } from '@/lib/disposable-domains'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isSafeReturnTo(returnTo) {
  return (
    typeof returnTo === 'string' &&
    returnTo.startsWith('/') &&
    !returnTo.startsWith('//') &&
    !returnTo.startsWith('/\\')
  )
}

/**
 * Sends a Supabase Magic Link to the exact email address the user entered.
 * Mirrors the intended_role/returnTo propagation used by the Google OAuth
 * flow (see LoginForm.jsx + /auth/callback), but carries them via the
 * emailRedirectTo URL instead of a short-lived cookie — a magic link can sit
 * unopened in an inbox far longer than the 5-minute OAuth round trip, and may
 * even be opened on a different device, so state that has to survive that
 * gap belongs in the link itself, not in this browser's cookie jar.
 */
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const intendedRole = body?.intendedRole === 'recruiter' ? 'recruiter' : 'candidate'
  const returnTo = body?.returnTo

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (process.env.BLOCK_DISPOSABLE_EMAILS === 'true' && isDisposableEmail(email)) {
    return NextResponse.json(
      { error: 'Please use a permanent email address to sign in.' },
      { status: 400 }
    )
  }

  const origin = new URL(request.url).origin
  const callbackUrl = new URL('/auth/callback', origin)
  if (intendedRole !== 'candidate') callbackUrl.searchParams.set('intended_role', intendedRole)
  if (isSafeReturnTo(returnTo)) callbackUrl.searchParams.set('returnTo', returnTo)

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        shouldCreateUser: true,
        data: { intended_role: intendedRole },
      },
    })

    if (error) {
      // For a 5xx from Supabase Auth (which is exactly what an SMTP/email-
      // sending failure surfaces as), @supabase/auth-js's handleError()
      // deliberately does NOT parse the response body at all — it throws a
      // generic AuthRetryableFetchError with error.code left undefined and
      // error.message reduced to a stringified Response object, before ever
      // reading the real `error_code`/`msg` (e.g. "unexpected_failure" /
      // "Error sending confirmation email"). So error.status is the only
      // reliable signal for this failure class here — matching on
      // error.message/.code for a 5xx would silently never fire. Confirmed
      // against this project's live Supabase auth logs (get_logs → auth):
      // a real "535 Username and Password not accepted" Gmail SMTP-auth
      // rejection surfaces to this code as status 500 with no other detail.
      console.error('[api/auth/magic-link] signInWithOtp failed:', error.status, error.name, error.code, error.message)

      if (error.status === 429 || /security purposes|seconds/i.test(error.message || '')) {
        return NextResponse.json(
          { error: "You've already requested a link recently. Please wait a minute and check your inbox." },
          { status: 429 }
        )
      }
      if (/signups? not allowed|email logins? (is|are) disabled/i.test(error.message || '')) {
        return NextResponse.json(
          { error: "Email sign-in isn't available right now. Please use Continue with Google instead." },
          { status: 503 }
        )
      }
      // Supabase's auth server itself failed (most likely its configured
      // SMTP relay rejected the send) rather than rejecting the request as
      // invalid. The user has a real, immediate alternative — surface that
      // instead of a dead end.
      if (error.status >= 500) {
        return NextResponse.json(
          { error: "We're having trouble sending emails right now. Please use Continue with Google instead, or try again shortly." },
          { status: 502 }
        )
      }
      return NextResponse.json(
        { error: 'We could not send the login link. Please try again in a moment.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/auth/magic-link] unexpected error:', err.message)
    return NextResponse.json(
      { error: 'Server unavailable. Please try again shortly.' },
      { status: 500 }
    )
  }
}
