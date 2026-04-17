import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Fallback used if initialize_session() fails for any reason.
const ROLE_FALLBACK_REDIRECT = '/dashboard'

function redirectForRole({ role, onboardingCompleted, returnTo }) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'recruiter':
      return onboardingCompleted ? '/recruiter/dashboard' : '/recruiter/onboarding'
    case 'candidate':
      // Candidates honor returnTo (e.g. "Apply now" deep links) before the
      // generic dashboard.
      return returnTo || '/dashboard'
    default:
      return ROLE_FALLBACK_REDIRECT
  }
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // OAuth error (user denied access, etc.)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored
          }
        },
      },
    }
  )

  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (sessionError) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
  }

  // Read transient cookies set by the login page.
  const intendedRole = cookieStore.get('intended_role')?.value ?? null
  const returnTo = cookieStore.get('return-to')?.value ?? null

  // Resolve final role via RPC. Handles first-login promotion, stamps
  // last_login_at, returns the role + onboarding state we need for redirect.
  let role = null
  let onboardingCompleted = false

  const { data, error: rpcError } = await supabase.rpc('initialize_session', {
    p_intended_role: intendedRole,
  })

  if (!rpcError && Array.isArray(data) && data.length > 0) {
    role = data[0].role
    onboardingCompleted = Boolean(data[0].onboarding_completed)
  }

  const redirectUrl = redirectForRole({
    role,
    onboardingCompleted,
    returnTo,
  })

  const response = NextResponse.redirect(new URL(redirectUrl, origin))

  // Clear transient cookies — they've served their purpose.
  response.cookies.delete('return-to')
  response.cookies.delete('intended_role')

  return response
}
