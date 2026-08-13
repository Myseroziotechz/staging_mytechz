import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Sets the intended role as an HttpOnly server-side cookie.
 *
 * Client-side `document.cookie` is unreliable through the Google → Supabase →
 * localhost OAuth redirect chain. This API route sets the cookie via a proper
 * `Set-Cookie` header so the browser always sends it back on the redirect to
 * /auth/callback — regardless of cross-domain hops.
 */
export async function POST(request) {
  const { role } = await request.json()
  const normalizedRole = role === 'recruiter' ? 'recruiter' : 'candidate'

  const cookieStore = await cookies()
  cookieStore.set('mytechz_intended_role', normalizedRole, {
    path: '/',
    maxAge: 300, // 5 minutes — enough for the OAuth round-trip
    sameSite: 'lax',
    httpOnly: true,
  })

  return NextResponse.json({ ok: true })
}
