import Link from 'next/link'

export const metadata = {
  title: 'About - MyTechZ',
  description:
    'MyTechZ is India\u2019s AI-powered career platform connecting tech talent with private and government opportunities, expert mentors, and intelligent tools.',
}

const stats = [
  { value: '50K+', label: 'Jobs Listed' },
  { value: '12K+', label: 'Placed Candidates' },
  { value: '500+', label: 'Hiring Partners' },
  { value: '200+', label: 'Expert Mentors' },
]

const values = [
  {
    title: 'Talent First',
    description:
      'Every feature we build starts with one question — does this make the candidate\u2019s journey easier, faster, or more successful?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m12 7a8 8 0 10-16 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'AI with Integrity',
    description:
      'Our AI tools help you stand out — never misrepresent. We optimise the signal, not the noise, and keep humans in the loop.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: 'Access for All',
    description:
      'From tier-1 cities to small towns, from IIT grads to self-taught coders — career opportunities should reach everyone.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-3 2.5-15 0-18m0 18c-2.5-3-2.5-15 0-18M3 12h18" />
      </svg>
    ),
  },
  {
    title: 'Verified Opportunities',
    description:
      'Every listing is vetted. We partner directly with recruiters and government portals so you never waste time on fake ads.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const timeline = [
  {
    year: '2023',
    title: 'The Idea',
    description:
      'Founded by a team of engineers frustrated by fragmented job portals, fake listings, and poor candidate experience.',
  },
  {
    year: '2024',
    title: 'AI Tools Launch',
    description:
      'Shipped the Resume Builder, Rank Checker, and Smart Job Search — all powered by in-house AI models.',
  },
  {
    year: '2025',
    title: 'Nationwide Reach',
    description:
      'Expanded to government jobs and partnered with 500+ companies across India to curate verified tech opportunities.',
  },
  {
    year: '2026',
    title: 'Mentor Network',
    description:
      'Launched expert-led webinars and 1:1 mentorship to help candidates upskill and crack interviews with confidence.',
  },
]

export default function AboutPage() {
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
            Built in India, for every career
          </span>
          <h1 className="hero-fade-up-d1 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            About <span className="hero-gradient-text">Mytechz</span>
          </h1>
          <p className="hero-fade-up-d2 mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
            MyTechZ is an AI-powered career platform that connects tech talent with the
            right opportunities — across private companies and government organisations —
            and equips them with the tools, mentors, and insights to succeed.
          </p>
        </div>

        {/* Stats */}
        <div className="hero-fade-up-d3 mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-5 text-center shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hover:border-amber-200"
            >
              <div className="text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {s.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission / Vision */}
        <div className="mt-20 grid lg:grid-cols-2 gap-6">
          <div className="hero-fade-up-d2 relative bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-8 shadow-lg shadow-blue-900/5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Remove every friction between talent and opportunity. We curate verified
              listings, build AI tools that actually help, and give every candidate — regardless
              of background — a fair shot at a great career in tech.
            </p>
          </div>
          <div className="hero-fade-up-d3 relative bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-8 shadow-lg shadow-blue-900/5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-blue-700 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              To become India&apos;s most trusted career companion — where a student in Coimbatore
              and a senior engineer in Bengaluru both find opportunities, mentors, and tools
              that move their careers forward.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="hero-fade-up text-3xl sm:text-4xl font-bold text-slate-900">What we believe in</h2>
            <p className="hero-fade-up-d1 mt-3 text-slate-600">
              Four principles that shape every product decision we make.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`group bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-6 shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hover:border-amber-200 hero-fade-up-d${(i % 4) + 1}`}
              >
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-blue-700 transition-colors">
                    {v.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our journey</h2>
            <p className="mt-3 text-slate-600">From a small idea to a nationwide platform.</p>
          </div>

          <ol className="mt-10 relative border-l-2 border-dashed border-blue-200 ml-3 space-y-8">
            {timeline.map((t) => (
              <li key={t.year} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow" />
                <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-5 shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {t.year}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-10 sm:p-14 text-center shadow-2xl shadow-blue-900/20">
            <div className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 bg-amber-400/30 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to take the next step?
              </h2>
              <p className="mt-3 text-blue-100 max-w-xl mx-auto">
                Explore thousands of verified tech jobs or talk to our team about how MyTechZ can help
                your career or your hiring pipeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/jobs"
                  className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Explore Jobs
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur transition-all hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
