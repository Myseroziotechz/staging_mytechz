import { createClient } from '@/lib/supabase-server'
import CompanyProfileForm from '@/components/recruiter/CompanyProfileForm'

export const metadata = {
  title: 'Complete Your Company Profile - MyTechZ',
  description: 'Tell us about your company to start posting jobs on MyTechZ.',
}

// The surrounding /recruiter/layout.js has already ensured the user is an
// authenticated recruiter. This page is intentionally reachable whether or
// not onboarding_completed is true — it doubles as the company-profile
// editor after setup.
export default async function RecruiterOnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Prefill from existing row if the recruiter has saved partial data
  // previously (or is coming back to edit).
  const { data: existing } = await supabase
    .from('recruiter_profiles')
    .select(
      'company_name, company_website, industry, company_size, head_office_location, work_mode, company_description, gst_or_cin'
    )
    .eq('user_id', user.id)
    .maybeSingle()

  const isEdit = Boolean(existing)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit company profile' : 'Set up your company profile'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isEdit
                ? 'Keep your company details current — candidates see this on every job post.'
                : 'A few details about your company before you can post your first job.'}
            </p>
          </header>

          <CompanyProfileForm initial={existing ?? undefined} />
        </div>
      </div>
    </div>
  )
}
