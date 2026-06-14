import { Suspense } from 'react'
import JobsListingPage, { JobsLoadingGrid } from '@/components/jobs/JobsListingPage'
import { getJobs } from '@/lib/jobs/queries'

export const metadata = {
  title: 'Paid Internships in India 2024 — Tech, Design & Marketing for Students & Freshers',
  description: 'Find paid internships in India for students and freshers — across tech, software, design, marketing, finance, and more. Stipends shown per month. Filter by skills, duration, and eligibility.',
  keywords: 'paid internships India, internships for students, freshers internship, tech internship India, software internship, stipend internship, internship 2024 India',
  alternates: { canonical: 'https://mytechz.com/jobs/internship' },
  openGraph: {
    title: 'Paid Internships India 2024 — Tech, Design & Marketing for Students | MyTechZ',
    description: 'Find paid internships in India for students and freshers. Stipends shown. Filter by skills, duration, eligibility.',
    url: 'https://mytechz.com/jobs/internship',
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: 'https://mytechz.com/og-image.png', width: 1200, height: 630, alt: 'Paid Internships India 2024 — MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

const PAGE_CONFIG = {
  id: 'internship',
  title: 'Internships',
  subtitle: 'Paid internships for students and freshers — stipends shown per month.',
  accentColor: 'amber',
  heroBadge: 'For students & freshers',
  placeholder: 'Role, college, or skill',
}

function parseFilters(sp) {
  const skills = sp?.skills ? String(sp.skills).split(',').map(s => s.trim()).filter(Boolean) : []
  return {
    q: sp?.q || '', location: sp?.loc || '',
    work_mode: sp?.mode || '', job_type: 'internship',
    exp_min: '', exp_max: '',
    sal_min: sp?.sal_min || '', skills,
    sort: sp?.sort || 'newest', page: Number(sp?.page) || 1,
  }
}

export default async function InternshipsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const { jobs, error } = await getJobs({ ...filters, job_type: 'internship' })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mytechz.com/' },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: 'https://mytechz.com/jobs' },
      { '@type': 'ListItem', position: 3, name: 'Internships', item: 'https://mytechz.com/jobs/internship' },
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
