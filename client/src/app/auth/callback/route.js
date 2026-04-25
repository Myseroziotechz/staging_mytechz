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

  // 1. Exchange code for session
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
  if (sessionError) {
    console.error('[auth/callback] session failed:', sessionError.message)
    return NextResponse.redirect(new URL('/auth/error?reason=auth_failed', origin))
  }

  // 2. Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/error?reason=auth_failed', origin))
  }

  // 3. Read intended_role — try URL params, cookie, then localStorage-backed
  //    Supabase state param. Google OAuth strips custom query params from the
  //    redirect URL, so the cookie is the primary carrier for OAuth flows.
  let intendedRole = searchParams.get('intended_role') || ''
  if (!intendedRole) {
    const roleCookie = cookieStore.get('mytechz_intended_role')
    intendedRole = roleCookie?.value || ''
  }
  // Fallback: check raw_user_meta_data.intended_role set by the
  // handle_new_user trigger (magic-link sets this via signInWithOtp data).
  if (!intendedRole) {
    const meta = user.user_metadata || {}
    intendedRole = meta.intended_role || ''
  }

  console.log('[auth/callback]', user.email, 'intendedRole:', intendedRole || '(none)')

  // 4. Admin client — handles ALL role logic
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 5. Check if profile exists
  const { data: profile } = await admin
    .from('user_profiles')
    .select('role, onboarding_completed, last_login_at, email')
    .eq('id', user.id)
    .maybeSingle()

  let role = 'candidate'
  let onboardingCompleted = false

  if (!profile) {
    // ---- Profile MISSING — create it now ----
    // Check admin whitelist
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

    // Check if role needs updating
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

  // 6. Redirect based on role
  let destination = '/dashboard'
  if (role === 'admin') destination = '/admin/dashboard'
  else if (role === 'recruiter') destination = onboardingCompleted ? '/recruiter/dashboard' : '/recruiter/onboarding'

  console.log('[auth/callback] Redirecting to:', destination)

  const response = NextResponse.redirect(new URL(destination, origin))
  response.cookies.set('mytechz_intended_role', '', { path: '/', maxAge: 0 })
  response.cookies.set('mytechz_return_to', '', { path: '/', maxAge: 0 })
  return response
}
