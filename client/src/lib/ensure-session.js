import 'server-only'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Ensures the current user's session has been initialized.
 * Uses service_role admin client for direct database updates.
 */
export async function ensureSessionInitialized() {
  console.log('[ensure-session] START')

  // 1. Get current user from session cookies
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('[ensure-session] No user:', userError?.message)
    return null
  }

  console.log('[ensure-session] User:', user.email, 'ID:', user.id)

  // 2. Create admin client with service role key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('[ensure-session] SUPABASE_SERVICE_ROLE_KEY is missing!')
    return { user, role: 'candidate', onboardingCompleted: false }
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 3. Read profile with admin client
  const { data: profile, error: profileError } = await admin
    .from('user_profiles')
    .select('role, onboarding_completed, last_login_at, email')
    .eq('id', user.id)
    .maybeSingle()

  console.log('[ensure-session] Profile:', profile ? `role=${profile.role}, last_login=${profile.last_login_at}` : 'NULL', 'Error:', profileError?.message || 'none')

  // Profile row missing — the handle_new_user trigger failed.
  // Create it now using the admin client.
  if (!profile) {
    console.log('[ensure-session] Creating missing profile for:', user.email)

    // Read intended_role from cookie
    const cookieStore = await cookies()
    const roleCookie = cookieStore.get('mytechz_intended_role')
    const intendedRole = roleCookie?.value || null

    // Determine role
    let newRole = 'candidate'

    // Check admin whitelist
    const { data: wl } = await admin
      .from('admin_whitelist')
      .select('email')
      .eq('email', user.email)
      .maybeSingle()

    if (wl) {
      newRole = 'admin'
    } else if (intendedRole === 'recruiter') {
      newRole = 'recruiter'
    }

    const meta = user.user_metadata || {}
    const fullName = meta.full_name || meta.name || null
    const avatarUrl = meta.avatar_url || meta.picture || null

    const { error: insertError } = await admin
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        role: newRole,
        full_name: fullName,
        avatar_url: avatarUrl,
        last_login_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('[ensure-session] INSERT FAILED:', insertError.message)
      return { user, role: 'candidate', onboardingCompleted: false }
    }

    console.log('[ensure-session] CREATED profile:', user.email, '→', newRole)

    // Clean up cookie
    if (roleCookie) {
      try { cookieStore.set('mytechz_intended_role', '', { path: '/', maxAge: 0 }) } catch {}
    }

    return { user, role: newRole, onboardingCompleted: false }
  }

  // 4. Check if role needs updating (cookie present = fresh login with role intent)
  const cookieStore = await cookies()
  const roleCookie = cookieStore.get('mytechz_intended_role')
  const intendedRole = roleCookie?.value || null

  // If already initialized AND no new role intent, return early.
  if (profile.last_login_at && !intendedRole) {
    console.log('[ensure-session] Already initialized, no cookie, returning:', profile.role)
    return {
      user,
      role: profile.role,
      onboardingCompleted: Boolean(profile.onboarding_completed),
    }
  }

  // If already initialized but cookie says recruiter and user is still candidate,
  // allow re-promotion (user selected Recruiter tab on a fresh login).
  if (profile.last_login_at && intendedRole) {
    console.log('[ensure-session] Re-checking role, cookie:', intendedRole, 'current:', profile.role)
  }

  console.log('[ensure-session] intendedRole cookie:', intendedRole)

  let newRole = profile.role

  // Admin whitelist check
  const { data: whitelisted, error: wlError } = await admin
    .from('admin_whitelist')
    .select('email')
    .eq('email', profile.email)
    .maybeSingle()

  console.log('[ensure-session] Whitelist check:', whitelisted ? 'FOUND' : 'not found', 'Error:', wlError?.message || 'none')

  if (whitelisted && newRole !== 'admin') {
    newRole = 'admin'
  }

  // Recruiter promotion
  if (newRole === 'candidate' && intendedRole === 'recruiter') {
    newRole = 'recruiter'
  }

  // 6. Update the profile
  console.log('[ensure-session] Updating role:', profile.role, '→', newRole)

  const { error: updateError } = await admin
    .from('user_profiles')
    .update({
      role: newRole,
      last_login_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('[ensure-session] UPDATE FAILED:', updateError.message, updateError)
  } else {
    console.log('[ensure-session] UPDATE SUCCESS:', user.email, '→', newRole)
  }

  // Clean up cookie
  if (roleCookie) {
    try {
      cookieStore.set('mytechz_intended_role', '', { path: '/', maxAge: 0 })
    } catch { /* ignore */ }
  }

  return {
    user,
    role: newRole,
    onboardingCompleted: Boolean(profile.onboarding_completed),
  }
}
