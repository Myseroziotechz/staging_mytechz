import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Page Not Found (404)',
  description: 'The page you are looking for could not be found. Browse verified tech jobs or explore AI career tools on MyTechZ.',
  robots: { index: false, follow: true },
}

const POPULAR_LINKS = [
  { href: '/jobs/private', label: 'Private Tech Jobs', icon: '💼', desc: '50,000+ verified tech jobs across India' },
  { href: '/jobs/government', label: 'Government Jobs', icon: '🏛️', desc: 'UPSC, SSC, PSU & defence vacancies' },
  { href: '/jobs/internship', label: 'Paid Internships', icon: '🎓', desc: 'For students and freshers' },
  { href: '/ai-tools/smart-job-search', label: 'Smart Job Search', icon: '🤖', desc: 'AI-powered job matching by fit score' },
  { href: '/ai-tools', label: 'AI Career Tools', icon: '✨', desc: 'Free tools to accelerate your career' },
  { href: '/about', label: 'About MyTechZ', icon: 'ℹ️', desc: 'Learn about our platform' },
]

function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 — Page Not Found',
    url: SITE,
    description: 'The requested page could not be found on MyTechZ.',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default function NotFound() {
  return (
    <>
      <JsonLd />
      <div className="min-h-screen bg-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-3">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              The page you&apos;re looking for has moved, been deleted, or never existed. Here are some helpful links instead.
            </p>
          </div>

          {/* Popular links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {POPULAR_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="group bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl" aria-hidden="true">{l.icon}</span>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{l.label}</h3>
                </div>
                <p className="text-sm text-slate-500">{l.desc}</p>
              </Link>
            ))}
          </div>

          {/* Main CTA */}
          <div className="text-center flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go to Homepage
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
