// Page Version: v1.0.0 | Last Updated: 2026-07-22
// Redesigned services landing page — new file, does not modify /services/page.js.
import Link from 'next/link'
import { StatsCounters, AudienceTabs, HowItWorksStepper, ServicesFaqAccordion } from '@/components/services/ServicesInteractive'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Our Services — AI Job Matching, Verified Jobs & Career Tools',
  description:
    'MyTechZ services: verified private & government job listings, AI-powered job matching, paid internships, free resume tools, and expert mentorship — everything for your tech career in India.',
  keywords:
    'MyTechZ services, tech job listings India, government job notifications, AI career tools, AI job matching, paid internships India, job portal India services',
  alternates: { canonical: `${SITE}/services/redesign` },
  openGraph: {
    title: 'Our Services — AI Job Matching, Verified Jobs & Career Tools',
    description: 'Verified job listings, AI job matching, paid internships, government jobs, and expert mentorship — all in one platform.',
    url: `${SITE}/services/redesign`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Services' }],
  },
  twitter: { card: 'summary_large_image' },
}

const bentoServices = [
  {
    title: 'Verified Job Listings',
    description: 'Thousands of private and government tech jobs, vetted daily so you never waste time on fake or stale ads.',
    href: '/jobs',
    cta: 'Browse jobs',
    tint: 'blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25M20.25 14.15a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387M3 12.489c0 .61.241 1.196.75 1.661M3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: 'Government Jobs Portal',
    description: 'Central and state openings, exam notifications, and eligibility details — curated and searchable in one place.',
    href: '/jobs/government',
    cta: 'View govt. jobs',
    tint: 'emerald',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10m14 11V10M9 21v-6h6v6M4 10l8-6 8 6" />
      </svg>
    ),
  },
  {
    title: 'Paid Internships',
    description: 'Curated paid internships across startups, mid-size companies, and MNCs — for students and fresh graduates.',
    href: '/jobs/internship',
    cta: 'Browse internships',
    tint: 'amber',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347M12 13.489a50.702 50.702 0 017.74-3.342M12 13.489a50.57 50.57 0 00-7.74-3.342m15.48 0A59.905 59.905 0 0012 3.493 59.902 59.902 0 001.601 9.333" />
      </svg>
    ),
  },
  {
    title: 'Free Resume Builder & ATS Tools',
    description: 'ATS-optimised resumes with AI-powered bullet points, keyword suggestions, and clean PDF export — no watermarks.',
    href: '/ai-tools/resume-builder',
    cta: 'Build your resume',
    tint: 'purple',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: 'Expert Mentorship & Webinars',
    description: '200+ industry mentors running live sessions on interview prep, system design, and career switches.',
    comingSoon: true,
    tint: 'rose',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

const tintMap = {
  blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
  purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100',
  indigo: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100',
  amber: 'bg-amber-50 text-amber-700 group-hover:bg-amber-100',
  rose: 'bg-rose-50 text-rose-700 group-hover:bg-rose-100',
}

const testimonials = [
  { name: 'Aarav Mehta', role: 'Senior React Developer at Acme Cloud', quote: 'MyTechZ showed me roles that actually matched my stack. Got an offer in three weeks.' },
  { name: 'Priya Iyer', role: 'Product Designer', quote: 'The AI-matched roles and free resume builder together were better than three paid coaching sessions.' },
  { name: 'Sneha Reddy', role: 'Govt aspirant, cleared SSC', quote: 'Notification numbers and exam dates are bang-up-to-date. Saved me from missing a deadline.' },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services/redesign` },
    ],
  }

  const serviceList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MyTechZ Services',
    description: 'Free AI career tools and job platform services for Indian tech professionals.',
    itemListElement: bentoServices.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        url: s.href ? `${SITE}${s.href}` : `${SITE}/services/redesign`,
        provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
        areaServed: { '@type': 'Country', name: 'India' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceList) }} />
    </>
  )
}

export default function ServicesRedesignPage() {
  return (
    <section className="bg-white -mt-20">
      <JsonLd />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50">
        <div aria-hidden className="hero-blob absolute -top-24 -left-16 w-72 h-72 bg-blue-300/25 rounded-full blur-3xl" />
        <div aria-hidden className="hero-blob-delay absolute top-10 -right-20 w-80 h-80 bg-indigo-300/25 rounded-full blur-3xl" />
        <div aria-hidden className="hero-blob-slow absolute bottom-0 left-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span aria-hidden="true">›</span>
            <span className="text-slate-700">Services</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <span className="hero-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blue-100 text-xs sm:text-sm font-medium text-blue-700 shadow-sm">
              <svg className="w-3.5 h-3.5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
              Everything you need in one platform — free
            </span>
            <h1 className="hero-fade-up-d1 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Services built around <span className="hero-gradient-text">your next role</span>
            </h1>
            <p className="hero-fade-up-d2 mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
              From the first job search to the signed offer letter — MyTechZ gives you verified
              opportunities, free AI-powered tools, and expert mentors at every step.
            </p>
            <div className="hero-fade-up-d3 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5"
              >
                Explore Jobs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
              <Link
                href="/ai-tools/smart-job-search"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
              >
                Try AI Job Matching
              </Link>
            </div>
          </div>

          <div className="hero-fade-up-d4 mt-16">
            <StatsCounters />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-24">

        {/* Bento services grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">What we offer</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Five services, one platform</h2>
            <p className="mt-3 text-slate-600">Everything a tech job seeker needs — verified, free, and built with AI.</p>
          </div>

          {/* Featured tile — AI matching */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 shadow-2xl shadow-blue-900/20 mb-5">
            <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 w-60 h-60 bg-amber-400/25 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-bold uppercase tracking-wider">
                  Most popular
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-white">AI-Powered Job Matching</h3>
                <p className="mt-3 text-blue-100 leading-relaxed">
                  Our AI reads your resume, skills, and preferences to calculate a fit score for
                  every job. See roles ranked by actual compatibility — not just keyword overlap.
                </p>
                <Link
                  href="/ai-tools/smart-job-search"
                  className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Try Smart Search
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                  </svg>
                </Link>
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: 'Senior React Developer', pct: 94 },
                  { label: 'Backend Engineer (Go)', pct: 88 },
                  { label: 'Product Designer', pct: 82 },
                ].map((m) => (
                  <li key={m.label} className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur">
                    <span className="text-sm font-medium text-white flex-1 truncate">{m.label}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 shrink-0">
                      {m.pct}% match
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Other service tiles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bentoServices.map((s) => (
              <div
                key={s.title}
                className="group relative job-glass-panel rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${tintMap[s.tint]}`}>
                  {s.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p>
                {s.comingSoon ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    Coming soon
                  </span>
                ) : (
                  <Link
                    href={s.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {s.cta}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audience tabs */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Built for both sides</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Whoever you are, we&apos;ve got you</h2>
          </div>
          <AudienceTabs />
        </div>

        {/* How it works */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">How it works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Four steps to your next role</h2>
            <p className="mt-3 text-slate-600">No noise, no spam. Just verified jobs and a personal prep coach.</p>
          </div>
          <HowItWorksStepper />
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">What candidates say</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Real outcomes, real stories</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((r) => (
              <article key={r.name} className="job-glass-panel rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2l2.4 5.8L18 8l-4.2 4 1 6L10 15l-4.8 3 1-6L2 8l5.6-.2L10 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{r.name}</div>
                    <div className="text-xs text-slate-500 truncate">{r.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">FAQ</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Common questions</h2>
            <p className="mt-3 text-slate-600">Tap any question to expand.</p>
          </div>
          <ServicesFaqAccordion />
        </div>

        {/* Final CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-14 text-center shadow-2xl shadow-blue-900/20">
          <div aria-hidden className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">
              Join as a candidate for free, or post your first role and reach verified tech talent today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
              >
                Get Started Free
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur transition-all hover:-translate-y-0.5"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
