import Link from 'next/link'

export const metadata = {
  title: 'Browse Jobs — Private, Government, Internships & AI Featured | MyTechz',
  description: 'Pick a path: private companies, government & PSU, paid internships, or AI-personalized matches. Verified jobs, all in one place.',
  alternates: { canonical: '/jobs' },
}

const TILES = [
  {
    id: 'private',
    href: '/jobs/private',
    title: 'Private Jobs',
    blurb: 'Top companies, startups and MNCs hiring across India.',
    accent: 'from-blue-50 to-indigo-100 border-blue-100 hover:shadow-blue-900/15',
    iconBg: 'bg-blue-600',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 4h14M5 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />),
    badge: 'Verified employers',
  },
  {
    id: 'government',
    href: '/jobs/government',
    title: 'Government Jobs',
    blurb: 'Central, state, PSU and defence — with notification, exam dates and PDFs.',
    accent: 'from-emerald-50 to-teal-100 border-emerald-100 hover:shadow-emerald-900/15',
    iconBg: 'bg-emerald-600',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />),
    badge: 'Official notifications',
  },
  {
    id: 'internship',
    href: '/jobs/internship',
    title: 'Internships',
    blurb: 'Paid internships for students and freshers. Stipends shown per month.',
    accent: 'from-amber-50 to-orange-100 border-amber-100 hover:shadow-amber-900/15',
    iconBg: 'bg-amber-500',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />),
    badge: 'For students & freshers',
  },
  {
    id: 'ai',
    href: '/jobs/ai',
    title: 'AI Featured',
    blurb: 'Ranked against your resume and ambitions, not keywords.',
    accent: 'from-indigo-100 via-blue-100 to-amber-100 border-indigo-200 hover:shadow-indigo-900/20',
    iconBg: 'bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />),
    badge: 'Personalized',
  },
]

export default function JobsLandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Find your <span className="hero-gradient-text">next role</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Pick the track that fits you. We&apos;ve verified every employer and curated every listing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {TILES.map(t => (
            <Link key={t.id} href={t.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.accent} p-7 sm:p-8 border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
              <div className="relative z-10">
                <div className={`w-14 h-14 ${t.iconBg} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    {t.icon}
                  </svg>
                </div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2">{t.badge}</span>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{t.title}</h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600">{t.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                  Browse →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
