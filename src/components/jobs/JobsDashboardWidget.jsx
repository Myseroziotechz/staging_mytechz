import Link from 'next/link'
import JobCard, { JobCardSkeleton } from './JobCard'
import {
  getRecentJobsForWidget, getRecruiterJobs, getAdminPendingJobs,
} from '@/lib/jobs/queries'

export default async function JobsDashboardWidget({
  variant = 'default',     // 'default' (user) | 'recruiter' | 'admin'
  userId   = null,
  limit    = 4,
  category = null,
  title,
  ctaHref  = '/jobs',
  ctaLabel = 'View all',
}) {
  let jobs = []
  let resolvedTitle = title

  if (variant === 'recruiter' && userId) {
    jobs = await getRecruiterJobs(userId)
    resolvedTitle ??= 'Your job postings'
  } else if (variant === 'admin') {
    jobs = await getAdminPendingJobs(limit)
    resolvedTitle ??= 'Awaiting approval'
  } else {
    jobs = await getRecentJobsForWidget(limit, category)
    resolvedTitle ??= category === 'government' ? 'Latest government jobs' : 'Latest jobs for you'
  }

  return (
    <section className="job-glass-panel rounded-2xl p-5 sm:p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{resolvedTitle}</h2>
        <Link href={ctaHref} className="text-xs font-semibold text-blue-700 hover:text-blue-800">{ctaLabel} →</Link>
      </header>

      {jobs.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-500">
          {variant === 'recruiter' && 'You haven\'t posted any jobs yet.'}
          {variant === 'admin' && 'No jobs awaiting approval.'}
          {variant === 'default' && 'New jobs will appear here once recruiters post them.'}
        </div>
      ) : (
        <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 gap-3">
          {jobs.slice(0, limit).map(j => (
            <JobCard key={j.id} job={j} variant={variant === 'admin' || variant === 'recruiter' ? variant : 'compact'} />
          ))}
        </div>
      )}
    </section>
  )
}

export function JobsDashboardWidgetSkeleton() {
  return (
    <section className="job-glass-panel rounded-2xl p-5 sm:p-6">
      <div className="h-5 w-40 rounded job-card-skeleton mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <JobCardSkeleton variant="compact" />
        <JobCardSkeleton variant="compact" />
      </div>
    </section>
  )
}
