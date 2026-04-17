import Link from 'next/link'

export const metadata = {
  title: 'Services - MyTechZ',
  description:
    'Explore every MyTechZ service — verified job listings, AI resume tools, smart matching, mentorship, and career guidance, all in one place.',
}

const services = [
  {
    title: 'Verified Job Listings',
    description:
      'Thousands of private and government tech jobs, vetted by our team and updated every day — so you never waste time on fake or stale ads.',
    href: '/jobs',
    cta: 'Browse Jobs',
    tint: 'blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25M20.25 14.15a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387M3 12.489c0 .61.241 1.196.75 1.661M3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: 'Government Jobs Portal',
    description:
      'Central and state government openings, exam notifications, and eligibility details — curated and searchable in one clean interface.',
    href: '/jobs/government',
    cta: 'View Govt. Jobs',
    tint: 'emerald',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10m14 11V10M9 21v-6h6v6M4 10l8-6 8 6" />
      </svg>
    ),
  },
  {
    title: 'AI Resume Builder',
    description:
      'Generate a polished, ATS-optimised resume in minutes. Pick a template, let AI refine your bullet points, and export a recruiter-ready PDF.',
    href: '/ai-tools/resume-builder',
    cta: 'Build My Resume',
    tint: 'purple',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: 'Smart Job Search',
    description:
      'AI reads your profile and matches you with roles where you actually have a strong shot — not just keyword hits. Ranked by fit score.',
    href: '/ai-tools/smart-job-search',
    cta: 'Try Smart Search',
    tint: 'indigo',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Resume Rank Checker',
    description:
      'Paste a job description and your resume — get an instant match score, gap analysis, and specific suggestions to improve your chances.',
    href: '/ai-tools/resume-rank-checker',
    cta: 'Check My Rank',
    tint: 'amber',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: 'Expert Webinars & Mentorship',
    description:
      '200+ industry mentors running live sessions on interview prep, system design, data, and career switches. Learn from people who\u2019ve done it.',
    href: '/services',
    cta: 'Coming Soon',
    tint: 'rose',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347M12 13.489a50.702 50.702 0 017.74-3.342M12 13.489a50.57 50.57 0 00-7.74-3.342m15.48 0A59.905 59.905 0 0012 3.493 59.902 59.902 0 001.601 9.333" />
      </svg>
    ),
  },
]

const process = [
  {
    step: '01',
    title: 'Create your profile',
    description:
      'Sign up in seconds with Google or email and tell us about your skills, experience, and what you\u2019re looking for.',
  },
  {
    step: '02',
    title: 'Get matched intelligently',
    description:
      'Our AI scans new listings daily and surfaces the roles where you\u2019re most likely to succeed — ranked by fit.',
  },
  {
    step: '03',
    title: 'Sharpen your application',
    description:
      'Use the Resume Builder and Rank Checker to tailor your application to each role before you hit apply.',
  },
  {
    step: '04',
    title: 'Apply with confidence',
    description:
      'Track every application, get interview reminders, and tap into our mentor network to prepare and close the offer.',
  },
]

const tintMap = {
  blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
  purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100',
  indigo: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100',
  amber: 'bg-amber-50 text-blue-700 group-hover:bg-amber-100',
  rose: 'bg-rose-50 text-rose-700 group-hover:bg-rose-100',
}

export default function ServicesPage() {
  return (
    <section className="relative -mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-slow absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:pt-40">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="hero-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blue-100 text-xs sm:text-sm font-medium text-blue-700 shadow-sm">
            <svg className="w-3.5 h-3.5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
            </svg>
            Everything you need in one platform
          </span>
          <h1 className="hero-fade-up-d1 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Our <span className="hero-gradient-text">Services</span>
          </h1>
          <p className="hero-fade-up-d2 mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
            From the first job search to the signed offer letter — MyTechZ gives you verified
            opportunities, AI-powered tools, and expert mentors at every step.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group relative bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-6 shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hover:border-amber-200 hero-fade-up-d${(i % 4) + 1}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${tintMap[s.tint]}`}>
                {s.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p>
              <Link
                href={s.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                {s.cta}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-600">Four steps from signing up to signing your next offer.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <div
                key={p.step}
                className={`relative bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-6 shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hero-fade-up-d${(i % 4) + 1}`}
              >
                <div className="text-3xl font-bold hero-gradient-text inline-block">{p.step}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring partners CTA */}
        <div className="mt-24 grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-lg shadow-blue-900/5">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">For candidates</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Free to use. Curated listings, AI tools, and mentor access — all built to help you
              move from application to offer faster.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
              {[
                'Daily verified private + government jobs',
                'AI resume builder and rank checker',
                'Real-time application tracking',
                'Expert-led webinars and 1:1 mentorship',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </Link>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-900/20">
            <div className="pointer-events-none absolute -top-16 -right-10 w-60 h-60 bg-amber-400/30 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">For hiring partners</h2>
              <p className="mt-3 text-blue-100 leading-relaxed">
                Post roles, reach pre-screened tech candidates, and cut your time-to-hire with
                AI-powered matching and applicant ranking.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-blue-50">
                {[
                  'Targeted reach across India\u2019s tech talent',
                  'AI-ranked applicants by fit score',
                  'Employer dashboard with analytics',
                  'Dedicated support and onboarding',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-200 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
              >
                Talk to our team
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
