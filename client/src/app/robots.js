const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', '/admin/',
          '/recruiter', '/recruiter/',
          '/api', '/api/',
          '/auth/', '/login',
          '/dashboard', '/profile',
          '/my-applications', '/saved-jobs',
          '/settings',
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
