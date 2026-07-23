import Link from 'next/link'
import { getRecentJobsForWidget } from '@/lib/jobs/queries'
import HomeSection from './HomeSection'
import TrendingJobsFilters from './TrendingJobsFilters'

// Fetch a wider pool than we display so the Location/Education/Experience/Salary
// filters below have something real to narrow down client-side.
const POOL_SIZE = 24

export default async function TrendingJobs() {
  const topJobs = await getRecentJobsForWidget(POOL_SIZE)
  if (topJobs.length === 0) return null

  return (
    <HomeSection tone="light" pad="pt-6 pb-8 sm:pt-8 sm:pb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Trending right now</h3>
          <p className="text-sm text-slate-500">The newest verified roles on MyTechz.</p>
        </div>
        <Link href="/jobs" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all →</Link>
      </div>
      <TrendingJobsFilters jobs={topJobs} />
    </HomeSection>
  )
}
