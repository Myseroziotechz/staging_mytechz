import { formatLocation } from '@/lib/jobs/format'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

const EMPLOYMENT_TYPE = {
  full_time:  'FULL_TIME',
  part_time:  'PART_TIME',
  contract:   'CONTRACTOR',
  internship: 'INTERN',
  temporary:  'TEMPORARY',
}

export default function JobJsonLd({ job }) {
  if (!job) return null

  const url = `${SITE}/jobs/${job.category}/${job.slug}`
  const validThrough = job.application_deadline
    ? new Date(job.application_deadline).toISOString()
    : new Date(new Date(job.posted_at).getTime() + 30 * 86400000).toISOString()

  const company = job.company || {}
  const compName = company.name || 'Company'

  const jobPosting = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: { '@type': 'PropertyValue', name: 'MyTechz', value: job.short_id || job.id },
    datePosted: job.posted_at,
    validThrough,
    employmentType: EMPLOYMENT_TYPE[job.job_type] || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: compName,
      sameAs: company.website || undefined,
      logo: company.logo_url || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location_city || undefined,
        addressRegion:   job.location_state_code || job.location_state || undefined,
        addressCountry:  job.location_country_code || 'IN',
      },
    },
    ...(job.work_mode === 'remote' ? { jobLocationType: 'TELECOMMUTE' } : {}),
    applicantLocationRequirements: { '@type': 'Country', name: job.location_country || 'India' },
    ...(job.is_salary_disclosed !== false && (job.salary_min || job.salary_max) ? {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency || 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min || undefined,
          maxValue: job.salary_max || undefined,
          unitText: (job.salary_period || 'year').toUpperCase(),
        },
      },
    } : {}),
    directApply: job.apply_mode === 'internal',
    ...(job.experience_min ? {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: Math.round(Number(job.experience_min) * 12),
      },
    } : {}),
    ...(job.qualifications?.length ? { qualifications: job.qualifications.join(', ') } : {}),
    ...(job.skills?.length ? { skills: job.skills.join(', ') } : {}),
    url,
  }

  const breadcrumbs = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${SITE}/jobs` },
      { '@type': 'ListItem', position: 3, name: job.category === 'government' ? 'Government Jobs' : 'Private Jobs', item: `${SITE}/jobs?tab=${job.category}` },
      { '@type': 'ListItem', position: 4, name: job.title, item: url },
    ],
  }

  const faqList = Array.isArray(job.faq) ? job.faq : []
  const faqSchema = faqList.length > 0 ? {
    '@context': 'https://schema.org/',
    '@type': 'FAQPage',
    mainEntity: faqList.map(({ q, a }) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  )
}

export { formatLocation }
