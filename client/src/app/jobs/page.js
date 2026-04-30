import { Suspense } from 'react'
import JobsPageClient, { JobsLoadingGrid } from '@/components/jobs/JobsPageClient'
import { getJobs } from '@/lib/jobs/queries'

export const metadata = {
  title: 'Jobs — Private, Government & AI Featured | MyTechz',
  description:
    'Search private, government and AI-personalized jobs in one place. Filter by skills, location, experience, salary and work mode.',
  alternates: { canonical: '/jobs' },
  openGraph: {
    title: 'Jobs — Private, Government & AI Featured | MyTechz',
    description: 'One place for private, government and AI-matched job openings.',
    url: '/jobs',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

function parseFilters(sp) {
  const skills = sp?.skills ? String(sp.skills).split(',').map(s => s.trim()).filter(Boolean) : []
  return {
    tab:       (sp?.tab || 'private'),
    q:         sp?.q || '',
    location:  sp?.loc || '',
    work_mode: sp?.mode || '',
    job_type:  sp?.type || '',
    exp_min:   sp?.exp_min || '',
    exp_max:   sp?.exp_max || '',
    sal_min:   sp?.sal_min || '',
    skills,
    sort:      sp?.sort || 'newest',
    page:      Number(sp?.page) || 1,
  }
}

export default async function JobsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const queryFilters = {
    ...filters,
    category: filters.tab === 'ai' ? null : filters.tab,
  }
  const { jobs, error } = await getJobs(queryFilters)

  return (
    <Suspense fallback={<JobsLoadingGrid />}>
      <JobsPageClient initialJobs={jobs} initialFilters={filters} initialError={error} />
    </Suspense>
  )
}
