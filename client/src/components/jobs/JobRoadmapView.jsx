export const FALLBACK_ROADMAP = (job) => ({
  skills_gap: {
    matched: (job?.skills || []).slice(0, 3),
    missing: (job?.skills || []).slice(3, 6),
  },
  weeks: [
    { week: 1, focus: 'Fundamentals refresher', tasks: ['Revise core concepts for the role', 'Skim the job description carefully', 'Set up a learning tracker'] },
    { week: 2, focus: 'Hands-on with the top 3 required skills', tasks: ['Build a small project per skill', 'Push to GitHub'] },
    { week: 3, focus: 'Mock interviews + system design (if senior)', tasks: ['Do 3 mock interviews', 'Practice 10 problems'] },
    { week: 4, focus: 'Tailor resume + apply', tasks: ['Rewrite resume bullet-by-bullet to match JD', 'Apply with a custom cover note'] },
  ],
  resources: [
    { title: 'Official documentation for required skills', url: '#' },
    { title: 'A curated YouTube playlist', url: '#' },
    { title: 'Two open-source repos to read', url: '#' },
  ],
  questions: [
    'Walk me through a project where you used the top skill from this JD.',
    'How would you debug a production issue with limited information?',
    'Describe a tradeoff you made between speed and quality.',
  ],
  resume_tips: [
    'Mirror the exact skill names from the JD in your skills section.',
    'Quantify impact in 2 bullets per role (numbers, %, scale).',
    'Move the most relevant experience to the top of your most recent role.',
  ],
  checklist: [
    'Tailored resume saved as PDF',
    'Portfolio link works on mobile',
    'Top 5 likely questions rehearsed out loud',
    'Application deadline noted',
    'Follow-up reminder set for day 7',
  ],
})

export default function JobRoadmapView({ roadmap }) {
  if (!roadmap) return null

  return (
    <div className="space-y-6">
      <Section title="Skill gap" subtitle="Where you stand vs the role">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="text-xs font-semibold text-emerald-700 mb-2">You match</div>
            <div className="flex flex-wrap gap-1.5">
              {roadmap.skills_gap?.matched?.length
                ? roadmap.skills_gap.matched.map(s => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-200">{s}</span>)
                : <span className="text-xs text-slate-400">—</span>}
            </div>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
            <div className="text-xs font-semibold text-rose-700 mb-2">To learn</div>
            <div className="flex flex-wrap gap-1.5">
              {roadmap.skills_gap?.missing?.length
                ? roadmap.skills_gap.missing.map(s => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200">{s}</span>)
                : <span className="text-xs text-slate-400">—</span>}
            </div>
          </div>
        </div>
      </Section>

      <Section title="4-week study plan" subtitle="A week-by-week path to interview-ready">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roadmap.weeks?.map((w) => (
            <li key={w.week} className="job-glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-700 text-white text-xs font-bold">{w.week}</span>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Week {w.week}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">{w.focus}</div>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-0.5">
                {w.tasks?.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Resources" subtitle="Hand-picked starting points">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roadmap.resources?.map((r, i) => (
            <li key={i}>
              <a href={r.url} target="_blank" rel="noreferrer"
                 className="block job-glass-panel rounded-lg p-3 text-sm text-blue-700 hover:bg-blue-50 transition">
                {r.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Likely interview questions" subtitle="Practice these before the call">
        <ul className="space-y-2">
          {roadmap.questions?.map((q, i) => (
            <li key={i} className="job-glass-panel rounded-lg p-3 text-sm text-slate-700 flex gap-2">
              <span className="font-bold text-slate-400">Q{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Resume tailoring tips" subtitle="Customize before you apply">
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          {roadmap.resume_tips?.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </Section>

      <Section title="Final checklist" subtitle="Tick off before you click apply">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roadmap.checklist?.map((c, i) => (
            <li key={i} className="job-glass-panel rounded-lg p-3 text-sm text-slate-700 flex items-start gap-2">
              <span className="mt-0.5 inline-block w-4 h-4 rounded border border-slate-300 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section>
      <header className="mb-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}
