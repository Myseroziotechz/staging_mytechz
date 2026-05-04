import { Suspense } from 'react'
import AiFeaturedJobsPage, { AiLoadingGrid } from '@/components/jobs/AiFeaturedJobsPage'
import { getJobs } from '@/lib/jobs/queries'
import { createClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'AI Featured Jobs — Personalized matches | MyTechz',
  description: 'AI-ranked job matches based on your resume, skills and ambitions. Skip the noise.',
  alternates: { canonical: '/jobs/ai' },
}

export const dynamic = 'force-dynamic'

function parseFilters(sp) {
  return {
    prompt:        sp?.prompt || '',
    category:      sp?.category || '',
    job_type:      sp?.type || '',
    work_mode:     sp?.mode || '',
    match_min:     sp?.match_min || '',
    deadline_days: sp?.deadline_days || '',
  }
}

export default async function AiFeaturedPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)

  // Auth + resume check (so the page shows the right CTA)
  let isAuthed = false, hasResume = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthed = true
      const { data: resume } = await supabase.from('resumes').select('id').eq('user_id', user.id).limit(1).maybeSingle()
      hasResume = !!resume
    }
  } catch { /* table may not exist yet */ }

  const queryFilters = {
    sort: 'newest',
    per_page: 12,
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.job_type ? { job_type: filters.job_type } : {}),
    ...(filters.work_mode ? { work_mode: filters.work_mode } : {}),
    q: filters.prompt || '',
  }

  const { jobs, error } = await getJobs(queryFilters)

  return (
    <Suspense fallback={<AiLoadingGrid />}>
      <AiFeaturedJobsPage
        initialJobs={jobs}
        initialFilters={filters}
        initialError={error}
        isAuthed={isAuthed}
        hasResume={hasResume}
      />
    </Suspense>
  )
}
