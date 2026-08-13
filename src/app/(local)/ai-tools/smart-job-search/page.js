// Page Version: v2.0.0 | Last Updated: 2026-08-11
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { rankJobsForCandidate } from '@/lib/ai/match/rank-jobs'
import { fetchSavedJobUrls } from '@/lib/jobs/savedJobs'
import OnboardingScreen from '@/components/smart-job-search/OnboardingScreen'
import MatchDashboard from '@/components/smart-job-search/MatchDashboard'

const SITE = 'https://mytechz.com'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Smart Job Search — AI-Powered Job Matching for Indian Professionals',
  description:
    'MyTechZ Smart Job Search uses AI to match you with jobs where you have the strongest fit — based on your resume, skills, and career preferences. Not just keyword hits. Live now, free.',
  keywords:
    'AI job matching India, smart job search, AI-powered job recommendations, personalized job search India, resume-based job matching, fit score job search',
  alternates: { canonical: `${SITE}/ai-tools/smart-job-search` },
  openGraph: {
    title: 'Smart Job Search — AI-Powered Job Matching',
    description: 'AI reads your profile and matches you with roles ranked by fit score. Not just keywords — actual compatibility.',
    url: `${SITE}/ai-tools/smart-job-search`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Smart Job Search' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: false, follow: true },
}

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Smart Job Search', item: `${SITE}/ai-tools/smart-job-search` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Smart Job Search',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/smart-job-search`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'AI-powered job matching that ranks jobs by your actual fit — based on resume, skills, and career preferences. Live now.',
    provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does MyTechZ Smart Job Search work?',
        acceptedAnswer: { '@type': 'Answer', text: 'Smart Job Search uses AI to read your resume, extract your skills and experience, then calculate a fit score for every job on the platform. Jobs are ranked by actual compatibility — not just keyword overlap.' },
      },
      {
        '@type': 'Question',
        name: 'Is Smart Job Search free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — Smart Job Search is completely free for all candidates. No premium tier, no hidden fees, no credit card required.' },
      },
      {
        '@type': 'Question',
        name: 'How do I get matched?',
        acceptedAnswer: { '@type': 'Answer', text: 'Add your skills and location on your MyTechZ profile, or upload your resume and we\'ll extract them for you. Every active job is scored against your profile and ranked by fit — the closer the match, the higher it appears.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

function AnonymousLanding() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Smart <span className="text-purple-600">Job Search</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          AI-powered job matching that reads your profile and recommends roles where you have the strongest chance of success — ranked by actual fit, not just keyword overlap.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center mb-12">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign in to get matched</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Our AI job matching engine reads your profile and ranks every active job by fit — find the best jobs tailored just for you, completely free.
        </p>
        <Link
          href="/login?returnTo=/ai-tools/smart-job-search"
          className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-all"
        >
          Sign In to Get Matched
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
      </div>

      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">How Smart Job Search works</h2>
        <div className="space-y-4">
          {[
            { title: 'Profile-based matching', desc: 'Add your skills and location, or upload your resume and we\'ll extract them for you. We build a candidate profile and score you against every active job automatically.' },
            { title: 'Fit score ranking', desc: 'Every job is scored against your profile. Jobs where you have the strongest match appear first — filtered by actual compatibility, not just title keywords.' },
            { title: 'Skill gap insights', desc: 'For every match, see exactly which required skills you have and which ones you\'re missing.' },
            { title: '100% free', desc: 'Smart Job Search is completely free for all candidates — no premium tier, no hidden fees.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/70 rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl">
        <Link href="/jobs/internship" className="group bg-blue-50 rounded-xl border border-blue-100 p-5 hover:border-blue-300 transition-all">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Paid Internships</h3>
          <p className="text-sm text-slate-600">Explore paid internship opportunities across top tech companies in India.</p>
        </Link>
        <Link href="/jobs/private" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Browse Tech Jobs Now</h3>
          <p className="text-sm text-slate-600">50,000+ verified private and government jobs in India.</p>
        </Link>
      </div>
    </div>
  )
}

export default async function SmartJobSearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let body
  if (!user) {
    body = <AnonymousLanding />
  } else {
    const { candidateProfile, jobs, gated, total, error } = await rankJobsForCandidate(supabase, user.id, { perPage: 24 })
    if (gated) {
      body = <OnboardingScreen />
    } else {
      const savedJobUrls = await fetchSavedJobUrls()
      body = <MatchDashboard candidateProfile={candidateProfile} jobs={jobs} total={total} error={error} savedJobUrls={savedJobUrls} />
    }
  }

  return (
    <>
      <JsonLd />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Smart Job Search</span>
        </nav>

        {body}
      </section>
    </>
  )
}
