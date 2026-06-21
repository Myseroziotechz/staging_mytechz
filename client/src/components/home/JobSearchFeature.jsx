import Link from 'next/link'
import JobSearchForm from './JobSearchForm'
import JobCard from '@/components/jobs/JobCard'
import { getRecentJobsForWidget } from '@/lib/jobs/queries'
import HomeSection from './HomeSection'

export default async function JobSearchFeature() {
  const topJobs = await getRecentJobsForWidget(6)

  return (
    <HomeSection tone="light">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-block px-6 py-3 rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Hire Smarter
          </h2>
        </div>
      </div>

      <JobSearchForm />

      {topJobs.length > 0 && (
        <div className="mt-14">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Trending right now</h3>
              <p className="text-sm text-slate-500">The newest verified roles on MyTechz.</p>
            </div>
            <Link href="/jobs" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all →</Link>
          </div>
          <div className="job-card-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topJobs.slice(0, 6).map(job => (
              <JobCard key={job.id} job={job} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </HomeSection>
  )
}
