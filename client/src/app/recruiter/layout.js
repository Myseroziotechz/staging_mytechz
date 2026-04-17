import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

// Strict recruiter-only gate.
//
// Onboarding enforcement (profile.onboarding_completed) is NOT done here — it
// lives in each /recruiter/* page that requires a completed profile, so that
// /recruiter/onboarding itself is always reachable to fresh signups.
// Helper: `requireRecruiterOnboarded()` in [client/src/lib/recruiter-auth.js].
export default async function RecruiterLayout({ children }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/recruiter/dashboard')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active || profile.role !== 'recruiter') {
    redirect('/')
  }

  return children
}
