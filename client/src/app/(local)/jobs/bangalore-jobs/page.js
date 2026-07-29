// Page Version: v1.0.0 | Last Updated: 2026-07-29
import { Suspense } from 'react'
import Link from 'next/link'
import { getJobs } from '@/lib/jobs/queries'
import BangaloreJobsGrid, { BangaloreJobsLoadingGrid } from './BangaloreJobsGrid'
import BangaloreInfoSections from './BangaloreInfoSections'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'
const YEAR = new Date().getFullYear()

// Jobs are stored with location_city = 'Bengaluru' (the city's official name,
// used across the app's own city picker), while "Bangalore" is the term most
// candidates actually search for. Query the real data, but target the page,
// URL and copy at the search term.
const CITY_QUERY = 'Bengaluru'

export const metadata = {
  title: `Bangalore Jobs ${YEAR} — Bengaluru Tech, IT & Startup Openings | MyTechZ`,
  description: `Explore verified job openings in Bangalore (Bengaluru) ${YEAR} — IT, software, startups and MNCs. Updated daily. Apply directly on MyTechZ.`,
  keywords: `Bangalore jobs, jobs in Bangalore, Bengaluru jobs, IT jobs Bangalore, tech jobs Bangalore, software jobs Bangalore, startup jobs Bangalore ${YEAR}`,
  alternates: { canonical: `${SITE}/jobs/bangalore-jobs` },
  openGraph: {
    title: `Bangalore Jobs ${YEAR} — Bengaluru Tech, IT & Startup Openings`,
    description: 'Verified job openings in Bangalore (Bengaluru): IT, software, startups, MNCs. Updated daily.',
    url: `${SITE}/jobs/bangalore-jobs`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: `Bangalore Jobs ${YEAR} — MyTechZ` }],
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

const EMPLOYMENT_TYPE = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR',
  internship: 'INTERN', temporary: 'TEMPORARY',
}

function jobPostingJsonLd(job) {
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
    dateModified: job.updated_at || job.posted_at,
    validThrough,
    employmentType: EMPLOYMENT_TYPE[job.job_type] || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name || 'Company',
      sameAs: company.website || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location_city || 'Bengaluru',
        addressRegion: job.location_state || 'Karnataka',
        addressCountry: 'IN',
      },
    },
    ...(job.is_salary_disclosed !== false && (job.salary_min || job.salary_max) ? {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency || 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min || undefined,
          maxValue: job.salary_max || undefined,
          unitText: job.salary_period === 'month' ? 'MONTH' : job.salary_period === 'hour' ? 'HOUR' : 'YEAR',
        },
      },
    } : {}),
    url: `${SITE}/jobs/${job.category}/${job.slug}`,
  }
}

export default async function BangaloreJobsPage() {
  const { jobs, error } = await getJobs({ location: CITY_QUERY, sort: 'newest', per_page: 12, page: 1 })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${SITE}/jobs` },
      { '@type': 'ListItem', position: 3, name: 'Bangalore Jobs', item: `${SITE}/jobs/bangalore-jobs` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {jobs.map(job => (
        <script key={job.id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)) }} />
      ))}

      <section className="bg-white min-h-screen">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <header className="mb-6 sm:mb-8">
            <Link href="/jobs" className="text-xs text-slate-500 hover:text-blue-700 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              All categories
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Bengaluru · Karnataka
              </span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Jobs in Bangalore
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Verified IT, software, startup and MNC job openings in Bengaluru — India&apos;s tech capital.
            </p>
          </header>

          <Suspense fallback={<BangaloreJobsLoadingGrid />}>
            <BangaloreJobsGrid initialJobs={jobs} initialError={error} location={CITY_QUERY} />
          </Suspense>
        </div>
      </section>

      <BangaloreInfoSections />
    </>
  )
}
