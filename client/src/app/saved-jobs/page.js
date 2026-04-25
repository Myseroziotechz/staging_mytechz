import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import RemoveSavedJobButton from '@/components/saved-jobs/RemoveSavedJobButton'

export const metadata = {
  title: 'Saved Jobs - MyTechZ',
  description: 'Your bookmarked job opportunities.',
}

export default async function SavedJobsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?returnTo=/saved-jobs')

  const { data: savedJobs = [] } = await supabase
    .from('saved_jobs')
    .select('id, job_url, job_title, company_name, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Jobs you have bookmarked for later. {savedJobs.length > 0 && `${savedJobs.length} saved.`}
          </p>
        </header>

        {savedJobs.length > 0 ? (
          <div className="grid gap-3">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  {job.job_url ? (
                    <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-700 hover:text-blue-800">
                      {job.job_title}
                    </a>
                  ) : (
                    <p className="text-base font-semibold text-gray-900">{job.job_title}</p>
                  )}
                  {job.company_name && (
                    <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Saved {new Date(job.saved_at).toLocaleDateString()}
                  </p>
                </div>
                <RemoveSavedJobButton jobId={job.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900">No saved jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bookmark jobs you like and come back when you are ready to apply.
            </p>
            <Link
              href="/jobs/private"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
