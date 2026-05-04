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
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Find the Latest <span className="hero-gradient-text">Opportunities</span> Faster
        </h2>
        <p className="text-lg text-slate-600">
          Skip the noise. Instantly search verified jobs across top companies — matched to your skills and aspirations.
        </p>
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
