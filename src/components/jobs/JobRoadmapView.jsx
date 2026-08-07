// Skill → real learning resource URL mapping.
const SKILL_RESOURCE_MAP = {
  react: { title: 'React official docs', url: 'https://react.dev/learn' },
  javascript: { title: 'MDN JavaScript guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
  typescript: { title: 'TypeScript handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
  python: { title: 'Python official tutorial', url: 'https://docs.python.org/3/tutorial/' },
  java: { title: 'Java SE documentation', url: 'https://docs.oracle.com/en/java/' },
  sql: { title: 'SQL tutorial — Mode Analytics', url: 'https://mode.com/sql-tutorial/' },
  'node.js': { title: 'Node.js getting started', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
  nodejs: { title: 'Node.js getting started', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
  golang: { title: 'A Tour of Go', url: 'https://go.dev/tour/welcome/1' },
  go: { title: 'A Tour of Go', url: 'https://go.dev/tour/welcome/1' },
  rust: { title: 'The Rust Book', url: 'https://doc.rust-lang.org/book/' },
  docker: { title: 'Docker getting started', url: 'https://docs.docker.com/get-started/' },
  kubernetes: { title: 'Kubernetes interactive tutorial', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' },
  aws: { title: 'AWS skill builder (free)', url: 'https://skillbuilder.aws/' },
  'system design': { title: 'System design primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' },
  'data structures': { title: 'NeetCode 150 practice problems', url: 'https://neetcode.io/practice' },
  algorithms: { title: 'NeetCode 150 practice problems', url: 'https://neetcode.io/practice' },
  'machine learning': { title: 'fast.ai free ML course', url: 'https://course.fast.ai/' },
  'deep learning': { title: 'fast.ai deep learning course', url: 'https://course.fast.ai/' },
  django: { title: 'Django official tutorial', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/' },
  nextjs: { title: 'Next.js learn course', url: 'https://nextjs.org/learn' },
  'next.js': { title: 'Next.js learn course', url: 'https://nextjs.org/learn' },
  flutter: { title: 'Flutter codelabs', url: 'https://docs.flutter.dev/codelabs' },
  android: { title: 'Android developer fundamentals', url: 'https://developer.android.com/courses' },
  ios: { title: 'Apple SwiftUI tutorials', url: 'https://developer.apple.com/tutorials/swiftui' },
  swift: { title: 'Apple SwiftUI tutorials', url: 'https://developer.apple.com/tutorials/swiftui' },
  devops: { title: 'DevOps roadmap', url: 'https://roadmap.sh/devops' },
  cicd: { title: 'GitHub Actions docs', url: 'https://docs.github.com/en/actions/learn-github-actions' },
}

const GENERIC_RESOURCES = [
  { title: 'Roadmap.sh — visual skill roadmaps for your tech path', url: 'https://roadmap.sh/' },
  { title: 'freeCodeCamp — free full-stack & CS courses', url: 'https://www.freecodecamp.org/' },
  { title: 'LeetCode — interview coding practice (free tier)', url: 'https://leetcode.com/problemset/' },
  { title: 'System design primer — GitHub', url: 'https://github.com/donnemartin/system-design-primer' },
]

function buildResources(skills = []) {
  const found = []
  for (const s of skills) {
    const key = s.toLowerCase()
    if (SKILL_RESOURCE_MAP[key]) found.push(SKILL_RESOURCE_MAP[key])
    if (found.length >= 4) break
  }
  // Backfill with generic resources if skill-specific ones are < 3.
  for (const r of GENERIC_RESOURCES) {
    if (found.length >= 4) break
    if (!found.some((f) => f.url === r.url)) found.push(r)
  }
  return found.slice(0, 4)
}

export const FALLBACK_ROADMAP = (job) => ({
  skills_gap: {
    matched: (job?.skills || []).slice(0, 3),
    missing: (job?.skills || []).slice(3, 6),
  },
  weeks: [
    {
      week: 1,
      focus: 'Fundamentals refresher',
      tasks: [
        'Read the full job description carefully — highlight every skill you lack',
        'Revise core concepts for the top 3 required skills',
        'Set up a simple daily learning tracker (Notion or a plain doc)',
      ],
    },
    {
      week: 2,
      focus: 'Hands-on with required skills',
      tasks: [
        'Build one small project per top skill',
        'Push each project to GitHub with a clear README',
        'Watch 2 YouTube crash-courses on the skills you matched above',
      ],
    },
    {
      week: 3,
      focus: 'Mock interviews + system design',
      tasks: [
        'Complete 3 full mock interviews (use Pramp or a friend)',
        'Solve 10 LeetCode problems in the relevant topic areas',
        'Practice explaining your projects out loud — record and replay',
      ],
    },
    {
      week: 4,
      focus: 'Tailor resume + apply',
      tasks: [
        'Rewrite 2-3 resume bullets per role to mirror keywords from this JD',
        'Write a tailored 4-sentence cover note',
        'Apply — then set a follow-up reminder for day 7',
      ],
    },
  ],
  resources: buildResources(job?.skills),
  questions: [
    'Walk me through a project where you used the top skill from this job description.',
    'How would you debug a production issue with limited information?',
    'Describe a tradeoff you made between speed and code quality.',
    'Tell me about a time you had to learn a new technology under a deadline.',
  ],
  resume_tips: [
    'Mirror the exact skill names from the job description — ATS matches keywords literally.',
    'Quantify impact in at least 2 bullets per role (numbers, %, scale, time saved).',
    'Move the most relevant experience to the top of your most recent role.',
    'Keep total resume length to 1 page if under 5 yrs experience, 2 pages max otherwise.',
  ],
  checklist: [
    'Tailored resume saved as PDF with your name in the filename',
    'All portfolio / GitHub links are working on mobile',
    'Top 5 likely questions rehearsed out loud',
    'Application deadline noted in your calendar',
    'Follow-up reminder set for day 7 post-application',
    'LinkedIn profile matches the resume you submitted',
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
