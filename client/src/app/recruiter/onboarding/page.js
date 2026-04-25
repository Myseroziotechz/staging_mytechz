import { createClient } from '@/lib/supabase-server'
import RecruiterOnboardingOverlay from '@/components/recruiter/RecruiterOnboardingOverlay'

export const metadata = {
  title: 'Complete Your Company Profile - MyTechZ',
  description: 'Tell us about your company to start posting jobs on MyTechZ.',
}

export default async function RecruiterOnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile for prefilling name/phone
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch existing recruiter profile for edit mode
  const { data: existing } = await supabase
    .from('recruiter_profiles')
    .select(
      'company_name, company_website, industry, company_size, head_office_location, work_mode, company_description, gst_or_cin, designation'
    )
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <RecruiterOnboardingOverlay
      initial={existing ?? undefined}
      userName={userProfile?.full_name ?? ''}
      userPhone={userProfile?.phone ?? ''}
    />
  )
}
