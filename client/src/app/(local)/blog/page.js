// Page Version: v1.0.0 | Last Updated: 2026-07-13
import Link from 'next/link'
import ChangelogEntry from '@/components/blog/ChangelogEntry'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Blog & Changelog — Platform Updates, New Features & Tech Career Tips',
  description:
    'Stay up to date with MyTechZ platform updates, new feature releases, bug fixes, and tech career tips for Indian job seekers.',
  keywords:
    'MyTechZ blog, MyTechZ updates, changelog, tech job updates India, job portal news, career tips India, platform updates',
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: 'Blog & Changelog — MyTechZ Platform Updates',
    description: 'New features, improvements, and tech career tips from MyTechZ.',
    url: `${SITE}/blog`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Blog & Changelog' }],
  },
  twitter: { card: 'summary_large_image' },
}

const POSTS = [
  {
    title: 'Job Cards Redesign & Load More — July 2026 Update',
    date: '2026-07-13',
    version: 'v1.2.0',
    items: [
      { type: 'new', text: 'Redesigned job cards with cleaner layout, salary visibility, and quick-apply badges across all job listing pages.' },
      { type: 'new', text: '"Load More" button replaces infinite scroll — faster initial page load and better control over browsing.' },
      { type: 'new', text: 'Bangalore seed data added — real tech job listings from top Bangalore companies for testing and early access.' },
      { type: 'new', text: 'Blog & Changelog page launched to keep users informed about platform updates.' },
      { type: 'improvement', text: 'Homepage sections rearranged for better conversion flow: StatsBar, HowItWorks, ForRecruiters, and FAQ now visible.' },
      { type: 'improvement', text: 'SEO overhaul: added JSON-LD schemas (FAQPage, ItemList, AggregateRating), fixed duplicate title templates, added missing keywords across all pages.' },
      { type: 'improvement', text: 'Footer updated: Internships link now points to /jobs/internship, Blog link added to Company column.' },
      { type: 'improvement', text: 'Sitemap and robots.txt updated to include /blog for search engine and AI crawler indexing.' },
      { type: 'fix', text: 'Fixed duplicate " | MyTechZ" appearing in browser tab titles on Jobs, AI Tools, Resume Builder, and Smart Job Search pages.' },
      { type: 'fix', text: 'Fixed homepage canonical and OG URLs from relative (/) to absolute (https://mytechz.com/).' },
    ],
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
    ],
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MyTechZ Blog & Changelog',
    url: `${SITE}/blog`,
    description: 'Platform updates, new features, and tech career tips from MyTechZ.',
    publisher: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      dateModified: p.date,
      author: { '@type': 'Organization', name: 'MyTechZ' },
      publisher: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
    </>
  )
}

export default function BlogPage() {
  return (
    <>
      <JsonLd />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Blog</span>
        </nav>

        <div className="max-w-4xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Blog & <span className="text-blue-600">Changelog</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              What&apos;s new on MyTechZ — feature launches, improvements, and fixes. We ship fast and share openly.
            </p>
          </div>

          <div className="space-y-8">
            {POSTS.map((post) => (
              <ChangelogEntry key={post.date + post.version} {...post} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Want to stay updated?</h2>
            <p className="text-blue-100 text-sm mb-5">Get notified about new features, job alerts, and career tips — straight to your inbox.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md">
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
