import { getAllActiveJobsForSitemap } from '@/lib/jobs/queries'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

export default async function sitemap() {
  const now = new Date().toISOString()

  const staticPages = [
    { url: `${SITE}/`,                  lastModified: now, priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${SITE}/jobs`,              lastModified: now, priority: 0.95, changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs?tab=private`,  lastModified: now, priority: 0.9,  changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs?tab=government`, lastModified: now, priority: 0.9,  changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs?tab=ai`,       lastModified: now, priority: 0.85, changeFrequency: 'hourly'  },
    { url: `${SITE}/about`,             lastModified: now, priority: 0.5,  changeFrequency: 'monthly' },
    { url: `${SITE}/contact`,           lastModified: now, priority: 0.5,  changeFrequency: 'monthly' },
    { url: `${SITE}/services`,          lastModified: now, priority: 0.6,  changeFrequency: 'monthly' },
  ]

  const jobs = await getAllActiveJobsForSitemap()
  const jobUrls = jobs.map((j) => ({
    url: `${SITE}/jobs/${j.category}/${j.slug}`,
    lastModified: j.updated_at || now,
    priority: 0.8,
    changeFrequency: 'daily',
  }))

  return [...staticPages, ...jobUrls]
}
