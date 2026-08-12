import Link from 'next/link'

export default function ForRecruiters() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">For recruiters</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Hire <span className="hero-gradient-text">verified candidates</span>, not resume floods.
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-lg">
              Post a role in 3 minutes. We&apos;ll show it only to candidates who fit — your inbox stays signal-rich.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {[
                'AI-ranked applicant shortlist for every job',
                'One-click verification badge for your company',
                'Built-in JD quality check (bias, salary clarity, must-haves)',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.5 2 3.2-.4 1 3 2.7 1.6-1.5 2.8.6 3.1-3 .8-1.7 2.7-2.8-1.5-3 .8-1.7-2.7-3-.8.6-3.1L1.3 8.2 4 6.6l1-3 3.2.4L10 2zm-1 11l5-5-1.4-1.4L9 10.2l-1.6-1.6L6 10l3 3z"/></svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/recruiter" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition active:scale-[0.98]">
                Post a job →
              </Link>
              <Link href="/recruiter" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-slate-800 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">
                Recruiter dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="job-glass-panel rounded-3xl p-6 shadow-2xl shadow-blue-900/15">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Today&apos;s shortlist</div>
              <ul className="mt-3 space-y-2.5">
                {[
                  { name: 'Aarav M.',  match: 94 },
                  { name: 'Priya I.',  match: 88 },
                  { name: 'Rohan K.',  match: 82 },
                ].map((c) => (
                  <li key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">{c.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">Senior React Developer · Bengaluru</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{c.match}% match</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] text-slate-400 text-center">Sample shortlist — your real applicants appear here.</div>
            </div>
            <div aria-hidden className="absolute -top-3 -right-3 w-20 h-20 bg-amber-300/30 rounded-full blur-2xl" />
            <div aria-hidden className="absolute -bottom-3 -left-3 w-24 h-24 bg-emerald-300/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
