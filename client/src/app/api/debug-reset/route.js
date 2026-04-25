import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Temporary debug route — DELETE after testing.
// Resets a user's role to candidate so you can test recruiter/admin promotion again.
export async function GET(request) {
  const email = new URL(request.url).searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email param required' })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error } = await admin
    .from('user_profiles')
    .update({ role: 'candidate', last_login_at: null, onboarding_completed: false, updated_at: new Date().toISOString() })
    .eq('email', email)

  if (error) return NextResponse.json({ error: error.message })

  const { error: delErr } = await admin
    .from('user_profiles')
    .delete()
    .eq('email', email)

  return NextResponse.json({ success: `Reset/deleted profile for ${email}` })
}
