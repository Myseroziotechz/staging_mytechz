const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

const PRIVATE_PATHS = [
  '/admin',
  '/recruiter',
  '/api',
  '/auth/',
  '/login',
  '/dashboard',
  '/profile',
  '/my-applications',
  '/saved-jobs',
  '/settings',
  '/ai-tools/resume-rank-checker/check',
]

const AI_ALLOW_PATHS = [
  '/about',
  '/services',
  '/services/redesign',
  '/contact',
  '/jobs',
  '/jobs/private',
  '/jobs/government',
  '/jobs/internship',
  '/jobs/ai',
  '/ai-tools',
  '/ai-tools/resume-builder',
  '/ai-tools/resume-analyzer',
  '/ai-tools/resume-rank-checker',
  '/ai-tools/smart-job-search',
  '/blog',
  '/blog/*',
]

export default function robots() {
  return {
    rules: [
      // Standard crawlers
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // AI crawlers — allow public content for GEO (Generative Engine Optimization)
      {
        userAgent: 'GPTBot',
        allow: AI_ALLOW_PATHS,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ClaudeBot',
        allow: AI_ALLOW_PATHS,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'PerplexityBot',
        allow: AI_ALLOW_PATHS,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // All other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
