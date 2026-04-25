import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'My Applications - MyTechZ',
  description: 'Track the status of every job you have applied to.',
}

const STATUS_BADGE = {
  applied: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewing: 'bg-amber-50 text-amber-700 border-amber-200',
  interview: 'bg-purple-50 text-purple-700 border-purple-200',
  offered: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default async function MyApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?returnTo=/my-applications')

  const { data: applications = [] } = await supabase
    .from('job_applications')
    .select('id, job_url, job_title, company_name, status, applied_at')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false })

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track the status of every job you have applied to.
          </p>
        </header>

        {applications.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Job</th>
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-5 py-3.5">
                        {app.job_url ? (
                          <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:text-blue-800">
                            {app.job_title}
                          </a>
                        ) : (
                          <span className="font-medium text-gray-900">{app.job_title}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">{app.company_name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[app.status] || STATUS_BADGE.applied}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start applying to jobs and track your progress here.
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
