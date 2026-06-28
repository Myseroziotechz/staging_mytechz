import { formatLocation } from '@/lib/jobs/format'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

const EMPLOYMENT_TYPE = {
  full_time:  'FULL_TIME',
  part_time:  'PART_TIME',
  contract:   'CONTRACTOR',
  internship: 'INTERN',
  temporary:  'TEMPORARY',
}

const CATEGORY_LABEL = {
  private:    'Private Jobs',
  government: 'Government Jobs',
  internship: 'Internships',
  ai:         'AI-Curated Jobs',
}

// Schema.org unitText for salary period.
const SALARY_UNIT = {
  year:  'YEAR',
  month: 'MONTH',
  week:  'WEEK',
  hour:  'HOUR',
}

export default function JobJsonLd({ job }) {
  if (!job) return null

  const url = `${SITE}/jobs/${job.category}/${job.slug}`
  const categoryUrl = `${SITE}/jobs/${job.category}`
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
    // dateModified signals freshness to Google.
    dateModified: job.updated_at || job.posted_at,
    validThrough,
    employmentType: EMPLOYMENT_TYPE[job.job_type] || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: compName,
      sameAs: company.website || undefined,
      logo: company.logo_url || undefined,
    },
    jobLocation: job.work_mode === 'remote'
      ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: job.location_country_code || 'IN' } }
      : {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location_city || undefined,
            addressRegion:   job.location_state_code || job.location_state || undefined,
            addressCountry:  job.location_country_code || 'IN',
          },
        },
    ...(job.work_mode === 'remote' ? { jobLocationType: 'TELECOMMUTE' } : {}),
    // Only set location requirement for India-specific jobs; omit for fully remote global.
    ...(job.work_mode !== 'remote' || job.location_country === 'India'
      ? { applicantLocationRequirements: { '@type': 'Country', name: job.location_country || 'India' } }
      : {}),
    ...(job.is_salary_disclosed !== false && (job.salary_min || job.salary_max) ? {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency || 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min || undefined,
          maxValue: job.salary_max || undefined,
          unitText: SALARY_UNIT[job.salary_period] || 'YEAR',
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
    // Include benefits if available — improves rich result quality.
    ...(job.benefits?.length ? { jobBenefits: job.benefits.join(', ') } : {}),
    url,
  }

  const catLabel = CATEGORY_LABEL[job.category] || 'Jobs'
  const breadcrumbs = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Jobs',    item: `${SITE}/jobs` },
      { '@type': 'ListItem', position: 3, name: catLabel,  item: categoryUrl },
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
