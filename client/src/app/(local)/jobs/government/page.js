// Page Version: v1.0.0 | Last Updated: 2026-07-12
import { Suspense } from 'react'
import JobsListingPage, { JobsLoadingGrid } from '@/components/jobs/JobsListingPage'
import { getJobs } from '@/lib/jobs/queries'

const YEAR = new Date().getFullYear()

export const metadata = {
  title: `Government Jobs ${YEAR} — UPSC, SSC, PSU, State & Defence Vacancies`,
  description: `Latest central and state government job notifications ${YEAR}: UPSC, SSC, PSU, railways, banks, defence vacancies. Exam dates, age limits, eligibility, and official notification links. Updated daily.`,
  keywords: `government jobs ${YEAR}, UPSC vacancies, SSC jobs, PSU jobs India, state government jobs, defence jobs, railway jobs, bank jobs India, sarkari naukri`,
  alternates: { canonical: 'https://mytechz.com/jobs/government' },
  openGraph: {
    title: `Government Jobs ${YEAR} — UPSC, SSC, PSU & Defence Vacancies`,
    description: `Latest government job notifications in India ${YEAR}: UPSC, SSC, PSU, railways, banks, defence. Exam dates, age limits, official notifications.`,
    url: 'https://mytechz.com/jobs/government',
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: 'https://mytechz.com/og-image.png', width: 1200, height: 630, alt: `Government Jobs India ${YEAR} — MyTechZ` }],
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

const PAGE_CONFIG = {
  id: 'government',
  title: 'Government Jobs',
  subtitle: 'Central, state, PSU and defence vacancies with official notifications and exam schedules.',
  accentColor: 'emerald',
  heroBadge: 'Government / Public Sector',
  placeholder: 'Post, organization or qualification',
}

function parseFilters(sp) {
  const skills = sp?.skills ? String(sp.skills).split(',').map(s => s.trim()).filter(Boolean) : []
  return {
    q: sp?.q || '', location: sp?.loc || '',
    work_mode: sp?.mode || '', job_type: sp?.type || '',
    exp_min: sp?.exp_min || '', exp_max: sp?.exp_max || '',
    sal_min: sp?.sal_min || '', skills,
    sort: sp?.sort || 'newest', page: Number(sp?.page) || 1,
  }
}

export default async function GovernmentJobsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const { jobs, error } = await getJobs({ ...filters, category: 'government' })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mytechz.com/' },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: 'https://mytechz.com/jobs' },
      { '@type': 'ListItem', position: 3, name: 'Government Jobs', item: 'https://mytechz.com/jobs/government' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Suspense fallback={<JobsLoadingGrid />}>
        <JobsListingPage pageConfig={PAGE_CONFIG} initialJobs={jobs} initialFilters={filters} initialError={error} />
      </Suspense>
    </>
  )
}
