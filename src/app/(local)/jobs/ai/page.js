// Page Version: v1.0.0 | Last Updated: 2026-07-12
import { Suspense } from 'react'
import AiFeaturedJobsPage, { AiLoadingGrid } from '@/components/jobs/AiFeaturedJobsPage'
import { getJobs } from '@/lib/jobs/queries'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'AI-Matched Jobs India 2026 — Personalised Tech Job Recommendations (Free)',
  description: 'AI-ranked job matches personalized to your resume, skills, and ambitions. Find roles where you fit best — not just keyword matches. Free for all Indian job seekers.',
  keywords: 'AI matched jobs India, personalized job recommendations, AI job search, fit score jobs, resume-matched jobs India',
  alternates: { canonical: 'https://mytechz.com/jobs/ai' },
  openGraph: {
    title: 'AI-Matched Jobs — Personalised Tech Job Recommendations',
    description: 'AI-ranked job matches based on your resume, skills, and ambitions. Skip the noise — find roles where you actually fit.',
    url: 'https://mytechz.com/jobs/ai',
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: 'https://mytechz.com/og-image.png', width: 1200, height: 630, alt: 'AI Job Matching — MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
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
  let isAuthed = false, hasResume = false, savedJobUrls = []
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthed = true
      const { data: resume } = await supabase.from('resumes').select('id').eq('user_id', user.id).limit(1).maybeSingle()
      hasResume = !!resume
      const { data: saved } = await supabase.from('saved_jobs').select('job_url').eq('user_id', user.id)
      savedJobUrls = (saved || []).map((row) => row.job_url)
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mytechz.com/' },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: 'https://mytechz.com/jobs' },
      { '@type': 'ListItem', position: 3, name: 'AI Featured', item: 'https://mytechz.com/jobs/ai' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Suspense fallback={<AiLoadingGrid />}>
        <AiFeaturedJobsPage
          initialJobs={jobs}
          initialFilters={filters}
          initialError={error}
          isAuthed={isAuthed}
          hasResume={hasResume}
          savedJobUrls={savedJobUrls}
        />
      </Suspense>
    </>
  )
}
