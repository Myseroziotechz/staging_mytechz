import { getAllActiveJobsForSitemap } from '@/lib/jobs/queries'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

export default async function sitemap() {
  const now = new Date().toISOString()

  const staticPages = [
    { url: `${SITE}/`,                               lastModified: now, priority: 1.0,  changeFrequency: 'daily'   },
    // Job pages — high priority, frequently updated
    { url: `${SITE}/jobs`,                           lastModified: now, priority: 0.95, changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs/private`,                   lastModified: now, priority: 0.95, changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs/government`,                lastModified: now, priority: 0.95, changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs/internship`,                lastModified: now, priority: 0.9,  changeFrequency: 'hourly'  },
    { url: `${SITE}/jobs/ai`,                        lastModified: now, priority: 0.85, changeFrequency: 'hourly'  },
    // AI tools
    { url: `${SITE}/ai-tools`,                       lastModified: now, priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${SITE}/ai-tools/resume-builder`,        lastModified: now, priority: 0.85, changeFrequency: 'weekly'  },
    { url: `${SITE}/ai-tools/resume-analyzer`,       lastModified: now, priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${SITE}/ai-tools/smart-job-search`,      lastModified: now, priority: 0.75, changeFrequency: 'weekly'  },
    // Blog
    { url: `${SITE}/blog`,                            lastModified: now, priority: 0.7,  changeFrequency: 'weekly'  },
    // Informational pages
    { url: `${SITE}/services`,                       lastModified: now, priority: 0.65, changeFrequency: 'monthly' },
    { url: `${SITE}/about`,                          lastModified: now, priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${SITE}/contact`,                        lastModified: now, priority: 0.55, changeFrequency: 'monthly' },
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
