import Link from 'next/link'

export default function ComingSoon({ title, description, icon }) {
  return (
    <section className="relative -mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 min-h-screen flex items-center">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center w-full">
        <div className="hero-fade-up inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/90 backdrop-blur border border-slate-100 shadow-lg text-blue-700 mx-auto">
          {icon}
        </div>

        <span className="hero-fade-up-d1 mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blue-100 text-xs sm:text-sm font-medium text-blue-700 shadow-sm">
          <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
          </svg>
          Coming Soon
        </span>

        <h1 className="hero-fade-up-d2 mt-6 text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
          {title} is on the way
        </h1>

        <p className="hero-fade-up-d3 mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          {description} We&apos;re putting the finishing touches on this experience —
          check back soon.
        </p>

        <div className="hero-fade-up-d4 mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m-7 7h16" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
