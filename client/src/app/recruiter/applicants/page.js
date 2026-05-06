import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import {
  getRecruiterApplicants,
  getRecruiterJobsLite,
} from '@/lib/applicants/queries'
import ApplicantPipeline from '@/components/recruiter/ApplicantPipeline'

export const metadata = {
  title: 'Applicants | MyTechZ Recruiter',
  description: 'Review candidates and move them through your hiring pipeline.',
}

export default async function ApplicantsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnTo=/recruiter/applicants')

  const [{ applicants }, jobs] = await Promise.all([
    getRecruiterApplicants(user.id),
    getRecruiterJobsLite(user.id),
  ])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Applicants</h1>
          <p className="mt-1 text-sm text-slate-500">
            Move candidates through your hiring stages. Click any card to add notes,
            rate them, or change status.
          </p>
        </header>
        <ApplicantPipeline applicants={applicants} jobs={jobs} />
      </div>
    </div>
  )
}
