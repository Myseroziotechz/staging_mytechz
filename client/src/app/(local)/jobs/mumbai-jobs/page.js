// Page Version: v1.0.0 | Last Updated: 2026-08-06
import { Suspense } from 'react'
import MumbaiJobsListingPage, { MumbaiJobsLoadingGrid } from './MumbaiJobsListingPage'
import { getJobs } from '@/lib/jobs/queries'
import { fetchSavedJobUrls } from '@/lib/jobs/savedJobs'

const SITE = 'https://mytechz.com'
const YEAR = new Date().getFullYear()

export const metadata = {
  title: `Jobs in Mumbai ${YEAR} — Private, Government & Internship Openings | MyTechZ`,
  description: `Explore verified job openings in Mumbai at MyTechZ: private company roles, government vacancies, and paid internships across Mumbai, Navi Mumbai and Thane. Updated daily.`,
  keywords: `Mumbai jobs, jobs in Mumbai, Mumbai private jobs, Mumbai government jobs, Mumbai internships, Navi Mumbai jobs, Thane jobs, IT jobs Mumbai`,
  alternates: { canonical: `${SITE}/jobs/mumbai-jobs` },
  openGraph: {
    title: `Jobs in Mumbai ${YEAR} — Private, Government & Internship Openings`,
    description: `Verified job openings in Mumbai: private, government and paid internships. Updated daily.`,
    url: `${SITE}/jobs/mumbai-jobs`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'Jobs in Mumbai — MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

function csv(v) {
  return v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []
}

function parseFilters(sp) {
  return {
    q: sp?.q || '', category: sp?.cat || '',
    work_mode: sp?.mode || '', job_type: sp?.type || '',
    exp_min: sp?.exp_min || '', exp_max: sp?.exp_max || '',
    sal_min: sp?.sal_min || '', skills: csv(sp?.skills),
    sort: sp?.sort || 'newest', page: Number(sp?.page) || 1,
  }
}

const EMPLOYMENT_TYPE = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR',
  internship: 'INTERN', temporary: 'TEMPORARY',
}

function JsonLd({ jobs }) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${SITE}/jobs` },
      { '@type': 'ListItem', position: 3, name: 'Mumbai', item: `${SITE}/jobs/mumbai-jobs` },
    ],
  }

  const jobPostings = jobs.slice(0, 20).map((job) => {
    const company = job.company || {}
    const validThrough = job.application_deadline
      ? new Date(job.application_deadline).toISOString()
      : new Date(new Date(job.posted_at).getTime() + 30 * 86400000).toISOString()
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description || job.summary || job.title,
      identifier: { '@type': 'PropertyValue', name: 'MyTechz', value: job.short_id || job.id },
      datePosted: job.posted_at,
      validThrough,
      employmentType: EMPLOYMENT_TYPE[job.job_type] || 'FULL_TIME',
      hiringOrganization: { '@type': 'Organization', name: company.name || 'Company', sameAs: company.website || undefined },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.location_city || 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
      ...(job.is_salary_disclosed !== false && (job.salary_min || job.salary_max) ? {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: job.salary_currency || 'INR',
          value: { '@type': 'QuantitativeValue', minValue: job.salary_min || undefined, maxValue: job.salary_max || undefined, unitText: 'YEAR' },
        },
      } : {}),
      url: `${SITE}/jobs/${job.category}/${job.slug}`,
    }
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {jobPostings.map((jp, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jp) }} />
      ))}
    </>
  )
}

export default async function MumbaiJobsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const [{ jobs, error }, savedJobUrls] = await Promise.all([
    getJobs({ ...filters, location: 'Mumbai' }),
    fetchSavedJobUrls(),
  ])

  return (
    <>
      <JsonLd jobs={jobs} />
      <Suspense fallback={<MumbaiJobsLoadingGrid />}>
        <MumbaiJobsListingPage initialJobs={jobs} initialFilters={filters} initialError={error} savedJobUrls={savedJobUrls} />
      </Suspense>
    </>
  )
}
