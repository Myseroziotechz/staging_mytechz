import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

/**
 * Call from the top of any /recruiter/* server component that should be
 * inaccessible until onboarding is complete. Redirects to /recruiter/onboarding
 * if the recruiter has not yet submitted their company profile.
 *
 * The surrounding /recruiter/layout.js has already ensured the user is
 * authenticated and has role='recruiter', so this helper only re-reads
 * onboarding_completed.
 */
export async function requireRecruiterOnboarded() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/recruiter/dashboard')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/recruiter/onboarding')
  }
}
