// Page Version: v1.1.0 | Last Updated: 2026-07-14
import Link from 'next/link'
import { blogPosts } from '@/data/blog-posts'
import ChangelogEntry from '@/components/blog/ChangelogEntry'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Blog — Resume Tips, Career Guides & Platform Updates',
  description:
    'Expert resume tips, career guides for Indian IT freshers, government job preparation, ATS screening tips, and MyTechZ platform updates. Free resources to land your dream job.',
  keywords:
    'MyTechZ blog, resume tips India, career guide freshers, ATS resume tips, government job resume, IT job tips India, TCS resume, Infosys resume, tech career blog',
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: 'Blog — Resume Tips, Career Guides & Updates | MyTechZ',
    description: 'Expert resume tips, career guides, and platform updates for Indian job seekers.',
    url: `${SITE}/blog`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Blog' }],
  },
  twitter: { card: 'summary_large_image' },
}

const CHANGELOG_POSTS = [
  {
    title: 'ATS Resume Rank Checker v2 & Admin Analytics — July 2026',
    date: '2026-07-23',
    version: 'v1.3.0',
    items: [
      { type: 'new', text: 'ATS Rank Checker: Hard skills vs soft skills classification — see which type of keywords you\'re missing.' },
      { type: 'new', text: 'ATS Rank Checker: Keyword frequency analysis chart — compare how often top keywords appear in your resume vs the job description.' },
      { type: 'new', text: 'ATS Rank Checker: ATS Parsing Preview — see exactly what text ATS systems extract from your resume with matched keywords highlighted in green and missing ones underlined in red.' },
      { type: 'new', text: 'ATS Rank Checker: Formatting checklist — pass/fail checks for email, phone, dates, sections, action verbs, and resume length.' },
      { type: 'new', text: 'ATS Rank Checker: Scan history — view your last 5 ATS scores with a trend sparkline and score comparisons.' },
      { type: 'new', text: 'Admin Analytics Dashboard — jobs trend, applications trend, category distribution, application status breakdown, and top performing jobs table.' },
      { type: 'improvement', text: 'ATS Rank Checker: Smarter keyword matching — missing keywords now point to the correct resume section (skills, experience, or summary) instead of always defaulting to skills.' },
      { type: 'improvement', text: 'ATS Rank Checker: JD keywords ranked by frequency — most-mentioned keywords in the job description are prioritized first.' },
      { type: 'improvement', text: 'ATS Rank Checker: Score gauge now shows interpretation text explaining what your score means for ATS pass rates.' },
      { type: 'improvement', text: 'ATS Rank Checker: Category bar chart shows weight percentages and detailed tooltips explaining each scoring category.' },
      { type: 'improvement', text: 'ATS Rank Checker: Progressive disclosure — detailed analysis sections (frequency, preview, warnings) are collapsible for a cleaner results view.' },
      { type: 'improvement', text: 'Consistent data structure between AI-powered (Gemini) and rule-based analysis — no more UI inconsistencies when switching modes.' },
      { type: 'fix', text: 'Fixed missing keywords always showing "→ skills" section — now intelligently detects whether a keyword belongs in skills, experience, or summary.' },
    ],
  },
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
    name: 'MyTechZ Blog',
    url: `${SITE}/blog`,
    description: 'Expert resume tips, career guides, and platform updates for Indian job seekers.',
    publisher: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
    blogPost: blogPosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      url: `${SITE}/blog/${p.slug}`,
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
              Blog & <span className="text-blue-600">Career Guides</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Resume tips, career guides for Indian job seekers, ATS screening advice, and platform updates.
            </p>
          </div>

          {/* Blog Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Articles</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-slate-400" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Changelog */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Changelog</h2>
            <div className="space-y-8">
              {CHANGELOG_POSTS.map((post) => (
                <ChangelogEntry key={post.date + post.version} {...post} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Build Your Resume Now — It&apos;s Free</h2>
            <p className="text-blue-100 text-sm mb-5">ATS-optimized templates designed for Indian freshers and professionals. No sign-up needed.</p>
            <Link href="/ai-tools/resume-builder" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md">
              Start Building Your Resume
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
