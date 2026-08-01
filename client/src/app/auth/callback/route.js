import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/auth/error?reason=${encodeURIComponent(error)}`, origin))
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
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Ignored */ }
        },
      },
    }
  )

  let user = null
  try {
    // 1. Exchange code for session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    if (sessionError) {
      console.error('[auth/callback] session exchange failed:', sessionError.message)
      return NextResponse.redirect(new URL('/auth/error?reason=auth_failed', origin))
    }

    // 2. Get the authenticated user
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error('[auth/callback] unexpected error exchanging code for session:', err.message)
    return NextResponse.redirect(new URL('/auth/error?reason=auth_failed', origin))
  }
  if (!user) {
    console.error('[auth/callback] session exchanged but no user was returned')
    return NextResponse.redirect(new URL('/auth/error?reason=no_session', origin))
  }

  // 3. Read intended_role — try URL params, cookie, then localStorage-backed
  //    Supabase state param. Google OAuth strips custom query params from the
  //    redirect URL, so the cookie is the primary carrier for OAuth flows.
  let intendedRole = searchParams.get('intended_role') || ''
  if (!intendedRole) {
    const roleCookie = cookieStore.get('mytechz_intended_role')
    intendedRole = roleCookie?.value || ''
  }
  if (!intendedRole) {
    const meta = user.user_metadata || {}
    intendedRole = meta.intended_role || ''
  }

  // 3b. Read returnTo the same way — URL param first (survives on Google's
  // redirect back to us), then the cookie LoginForm set before leaving for
  // Google (belt-and-suspenders, since some OAuth apps/redirect chains strip
  // extra query params). Only a same-origin relative path is honored — a
  // returnTo of "//evil.com" or "https://evil.com" is rejected so this can't
  // be turned into an open redirect.
  let returnTo = searchParams.get('returnTo') || ''
  if (!returnTo) {
    const returnToCookie = cookieStore.get('mytechz_return_to')
    returnTo = returnToCookie?.value || ''
  }
  const isSafeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') && !returnTo.startsWith('/\\')

  console.log('[auth/callback]', user.email, 'intendedRole:', intendedRole || '(none)', 'returnTo:', returnTo || '(none)')

  // 4-6. Role lookup/creation and redirect target. The session itself is
  // already valid at this point (exchangeCodeForSession succeeded above), so
  // a failure here — bad service-role key, DB unreachable, etc. — must NOT
  // strand an authenticated user on the error page. Fall back to '/dashboard'
  // and let the per-route session guards (ensure-session.js) self-heal the
  // profile row on next load, instead of discarding a valid login.
  let destination = '/dashboard'
  try {
    // Admin client — handles ALL role logic
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await admin
      .from('user_profiles')
      .select('role, onboarding_completed, last_login_at, email')
      .eq('id', user.id)
      .maybeSingle()

    let role = 'candidate'
    let onboardingCompleted = false

    if (!profile) {
      // ---- Profile MISSING — create it now ----
      const { data: wl } = await admin
        .from('admin_whitelist')
        .select('email')
        .eq('email', user.email)
        .maybeSingle()

      if (wl) {
        role = 'admin'
      } else if (intendedRole === 'recruiter') {
        role = 'recruiter'
      }

      const meta = user.user_metadata || {}
      const { error: insertErr } = await admin.from('user_profiles').insert({
        id: user.id,
        email: user.email,
        role,
        full_name: meta.full_name || meta.name || null,
        avatar_url: meta.avatar_url || meta.picture || null,
        last_login_at: new Date().toISOString(),
      })

      if (insertErr) {
        console.error('[auth/callback] INSERT failed:', insertErr.message)
      } else {
        console.log('[auth/callback] CREATED:', user.email, '→', role)
      }
    } else {
      // ---- Profile EXISTS ----
      role = profile.role
      onboardingCompleted = Boolean(profile.onboarding_completed)

      let needsUpdate = false

      // Admin whitelist (always check)
      if (role !== 'admin') {
        const { data: wl } = await admin
          .from('admin_whitelist')
          .select('email')
          .eq('email', profile.email)
          .maybeSingle()
        if (wl) {
          role = 'admin'
          needsUpdate = true
        }
      }

      // Recruiter promotion (candidate → recruiter)
      if (role === 'candidate' && intendedRole === 'recruiter') {
        role = 'recruiter'
        needsUpdate = true
      }

      // Recruiter demotion (recruiter → candidate) — only allowed if the
      // recruiter hasn't completed onboarding yet (i.e. never filled the
      // company profile). Once onboarding is done they are a confirmed
      // recruiter and the toggle on the login page won't demote them.
      if (role === 'recruiter' && intendedRole === 'candidate' && !onboardingCompleted) {
        role = 'candidate'
        needsUpdate = true
      }

      // Update role + stamp last_login_at
      if (needsUpdate || !profile.last_login_at) {
        const { error: updateErr } = await admin
          .from('user_profiles')
          .update({ role, last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq('id', user.id)

        if (updateErr) {
          console.error('[auth/callback] UPDATE failed:', updateErr.message)
        } else {
          console.log('[auth/callback] UPDATED:', user.email, '→', role)
        }
      } else {
        // Just stamp last_login_at
        await admin
          .from('user_profiles')
          .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq('id', user.id)
        console.log('[auth/callback] Login:', user.email, 'role:', role)
      }
    }

    if (role === 'admin') destination = '/admin/dashboard'
    else if (role === 'recruiter') destination = onboardingCompleted ? '/recruiter/dashboard' : '/recruiter/onboarding'
  } catch (err) {
    console.error('[auth/callback] role lookup/creation failed, falling back to /dashboard:', err.message)
  }

  // A page the user was actually trying to reach (e.g. /profile, bounced here
  // by middleware) wins over the generic role-based dashboard — that's the
  // whole point of returnTo. Role-based routing is only the fallback for a
  // plain "sign in" with no prior destination.
  if (isSafeReturnTo) destination = returnTo

  console.log('[auth/callback] Redirecting to:', destination)

  const response = NextResponse.redirect(new URL(destination, origin))
  response.cookies.set('mytechz_intended_role', '', { path: '/', maxAge: 0 })
  response.cookies.set('mytechz_return_to', '', { path: '/', maxAge: 0 })
  return response
}
