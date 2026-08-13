import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

// Roles a user can switch TO (admin is whitelist-only, never self-assigned)
const ALLOWED_TARGET_ROLES = ['candidate', 'recruiter']

export async function POST(request) {
  try {
    const { role: newRole } = await request.json()

    if (!ALLOWED_TARGET_ROLES.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch current role — only recruiter and admin can switch
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const currentRole = profile?.role ?? 'candidate'

    // Candidates cannot initiate role switching
    if (currentRole === 'candidate') {
      return NextResponse.json({ error: 'Candidates cannot switch roles' }, { status: 403 })
    }

    // Admins cannot downgrade to admin (they already are); recruiter cannot switch to recruiter
    if (currentRole === newRole) {
      return NextResponse.json({ error: 'Already in that role' }, { status: 400 })
    }

    // Update role — use admin client to bypass RLS; only changes user_profiles.role, no data is deleted
    const adminClient = getAdminClient()
    const { error: updateError } = await adminClient
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Determine redirect target
    let redirectTo = '/dashboard'
    if (newRole === 'recruiter') {
      // Check if recruiter_profiles already exists (don't re-onboard)
      const { data: recruiterProfile } = await adminClient
        .from('recruiter_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      redirectTo = recruiterProfile ? '/recruiter/dashboard' : '/recruiter/onboarding'
    }

    return NextResponse.json({ redirectTo })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
