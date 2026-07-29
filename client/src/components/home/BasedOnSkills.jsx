import { getRecentJobsForWidget } from '@/lib/jobs/queries'
import HomeSection from './HomeSection'
import BasedOnSkillsTabs from './BasedOnSkillsTabs'

// Wider pool than TrendingJobs so every skill tab has enough matches to show.
const POOL_SIZE = 60

export default async function BasedOnSkills() {
  const jobs = await getRecentJobsForWidget(POOL_SIZE)
  if (jobs.length === 0) return null

  return (
    <HomeSection tone="light" pad="pt-2 pb-8 sm:pt-4 sm:pb-10">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Based on Skills</h3>
        <p className="text-sm text-slate-500">Roles grouped by the skills employers are hiring for.</p>
      </div>
      <BasedOnSkillsTabs jobs={jobs} />
    </HomeSection>
  )
}
