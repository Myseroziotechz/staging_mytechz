// Page Version: v1.0.0 | Last Updated: 2026-07-12
import { Suspense } from 'react'
import JobsListingPage, { JobsLoadingGrid } from '@/components/jobs/JobsListingPage'
import { getJobs } from '@/lib/jobs/queries'
import { getPrivateJobFacets } from '@/lib/jobs/facets'

export const metadata = {
  title: 'Private Tech Jobs — IT, Software, Startups, BFSI & MNC Openings in India',
  description: 'Browse verified private-sector tech job openings across IT services, product companies, BFSI, high-growth startups, and MNCs. Updated daily. Apply now on MyTechZ.',
  keywords: 'private tech jobs India, IT jobs, software developer jobs, MNC jobs India, startup jobs, BFSI jobs, verified private jobs',
  alternates: { canonical: 'https://mytechz.com/jobs/private' },
  openGraph: {
    title: 'Private Tech Jobs — IT, Software, Startups, BFSI & MNC Openings',
    description: 'Verified private-sector tech jobs in India: IT, software, startups, MNCs, BFSI. Updated daily.',
    url: 'https://mytechz.com/jobs/private',
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: 'https://mytechz.com/og-image.png', width: 1200, height: 630, alt: 'Private Tech Jobs India — MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

const PAGE_CONFIG = {
  id: 'private',
  title: 'Private Jobs',
  subtitle: 'Top companies, startups and MNCs hiring across India.',
  accentColor: 'blue',
  heroBadge: 'Private sector',
  placeholder: 'Job title, company or skill',
}

function csv(v) {
  return v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []
}

function parseFilters(sp) {
  return {
    q: sp?.q || '', location: sp?.loc || '',
    work_mode: sp?.mode || '', job_type: sp?.type || '',
    exp_min: sp?.exp_min || '', exp_max: sp?.exp_max || '',
    sal_min: sp?.sal_min || '', skills: csv(sp?.skills),
    sort: sp?.sort || 'newest', page: Number(sp?.page) || 1,
    departments: csv(sp?.dept), work_modes: csv(sp?.wmodes), cities: csv(sp?.city),
    industries: csv(sp?.ind), educations: csv(sp?.edu), companyIds: csv(sp?.co),
    salaryBuckets: csv(sp?.sal), highlight: csv(sp?.hl),
  }
}

export default async function PrivateJobsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const [{ jobs, error }, facets] = await Promise.all([
    getJobs({ ...filters, category: 'private', exclude_internships: true }),
    getPrivateJobFacets(),
  ])

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mytechz.com/' },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: 'https://mytechz.com/jobs' },
      { '@type': 'ListItem', position: 3, name: 'Private Jobs', item: 'https://mytechz.com/jobs/private' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Suspense fallback={<JobsLoadingGrid />}>
        <JobsListingPage pageConfig={PAGE_CONFIG} initialJobs={jobs} initialFilters={filters} initialError={error} facets={facets} />
      </Suspense>
    </>
  )
}
