import Link from 'next/link'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'
const URL_PATH = '/ai-tools/resume-analyzer'
// Base title only — the root layout's `title.template` appends " | MyTechZ" automatically.
const TITLE = 'Tailor Your Resume to Any Job Description'
const RENDERED_TITLE = `${TITLE} | MyTechZ`

export const metadata = {
  title: TITLE,
  description:
    'Paste a job description and get a tailored, ATS-ready resume with a live match score. Real keyword gaps from your experience — no fabricated skills, free.',
  keywords:
    'resume tailoring tool, tailor resume to job description, ATS match score, job description resume matcher, resume keyword analyzer, cover letter generator, resume rank checker India',
  alternates: { canonical: `${SITE}${URL_PATH}` },
  openGraph: {
    title: 'Tailor Your Resume to Any Job Description | MyTechZ',
    description: 'See your match score jump as you tailor your resume to a real job post. Honest AI — no invented skills, just your real experience, reworded to match.',
    url: `${SITE}${URL_PATH}`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Resume Tailoring Tool' }],
  },
  twitter: { card: 'summary_large_image' },
}

const STEPS = [
  { n: '01', title: 'Upload your current resume', desc: 'PDF, DOCX, or paste the text directly.' },
  { n: '02', title: 'Paste the job post', desc: 'Paste the job description text or the listing URL.' },
  { n: '03', title: 'See the skill gap', desc: 'Exactly what matches, what’s missing, and why.' },
  { n: '04', title: 'Export the tailored draft', desc: 'A ready-to-send resume, rewritten around this job.' },
]

const SHOWCASE = [
  {
    title: 'Intelligent keyword matching',
    desc: 'It reads the job description and your resume side by side, then surfaces the industry terms and skills you already have — just phrased differently than the job post expects.',
    visual: 'keywords',
  },
  {
    title: 'Real-time match score',
    desc: 'One number that tells you where you stand, with the keyword, section, and format breakdown behind it — so you know exactly what moved the score.',
    visual: 'gauge',
  },
  {
    title: 'A cover letter, drafted for this job specifically',
    desc: 'Not a generic template with your name swapped in. It references the actual role, company, and requirements from the posting you pasted.',
    visual: 'coverletter',
  },
]

const FAQ = [
  {
    q: 'Does the AI ever add skills I don’t actually have?',
    a: 'No. It only rewords and reorders content that’s already in your resume — using the job description’s terminology where your experience genuinely matches. If a required skill isn’t anywhere in your resume, it shows up as a gap for you to address, not a fabricated bullet point.',
  },
  {
    q: 'What is a resume match score?',
    a: 'A percentage showing how well your resume aligns with a specific job description — based on keyword overlap, section completeness, and formatting. It’s the same type of signal ATS software uses to rank applicants before a human ever opens your resume.',
  },
  {
    q: 'Is this different from a generic ATS checker?',
    a: 'A generic checker scores your resume once, in isolation. This tool scores it against one specific job post, tells you the exact gap, and produces a rewritten draft closing that gap — tailored to that job, not a general template.',
  },
  {
    q: 'Do I need a job posting URL, or can I paste the text?',
    a: 'Either works. Paste the full job description text directly, or paste the listing URL from LinkedIn, Naukri, Indeed, or a company careers page.',
  },
  {
    q: 'Is the cover letter generator included for free?',
    a: 'Yes — tailoring your resume and generating a matching cover letter are both included at no cost, with unlimited re-runs against different job posts.',
  },
  {
    q: 'What file formats are supported for resume upload?',
    a: 'PDF and Word (DOCX) are both supported. You can also paste your resume text directly if you prefer.',
  },
]

function JsonLd() {
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: RENDERED_TITLE,
    description: metadata.description,
    url: `${SITE}${URL_PATH}`,
    breadcrumb: { '@id': `${SITE}${URL_PATH}#breadcrumb` },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE}${URL_PATH}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Tailoring', item: `${SITE}${URL_PATH}` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Resume Tailoring Tool',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}${URL_PATH}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free tool that tailors a resume to a specific job description — match score, keyword gap analysis, tailored resume draft, and matching cover letter.',
    provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

/** Interactive-hero mockup: paste box + live 45% → 92% match-score transition. Static preview, clearly labeled as an example. */
function MatchScoreWidget() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-emerald-100/60 via-transparent to-transparent rounded-[2rem] -z-10" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Job description</span>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">Example</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed">
            &ldquo;...looking for a Backend Engineer with experience in <span className="text-slate-700 font-medium">Kubernetes</span>, <span className="text-slate-700 font-medium">CI/CD pipelines</span>, and building <span className="text-slate-700 font-medium">REST APIs</span> at scale...&rdquo;
          </div>
        </div>
        <div className="p-5 sm:p-6 flex items-center justify-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-300 line-through decoration-slate-300">45%</div>
            <div className="text-[10px] font-medium text-slate-400 mt-1">Before</div>
          </div>
          <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600">92%</div>
            <div className="text-[10px] font-medium text-emerald-600 mt-1">After tailoring</div>
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="flex flex-wrap gap-1.5">
            {['Kubernetes', 'CI/CD', 'REST APIs'].map((k) => (
              <span key={k} className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumeAnalyzerPage() {
  return (
    <>
      <JsonLd />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <nav aria-label="Breadcrumb" className="pt-8 pb-4 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Resume Tailoring</span>
        </nav>

        {/* Hero */}
        <section className="py-10 sm:py-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold tracking-wide uppercase text-amber-700 mb-5">
              Launching soon
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Paste the job description. Get a tailored, ATS-ready resume in seconds.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Match your actual experience to the exact keywords and skills recruiters are searching for — without lying or hallucinating skills you don&rsquo;t have.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
              >
                Tailor My Resume Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/ai-tools/resume-builder"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Build a resume first
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-sm">
              <div>
                <dt className="text-2xl font-bold text-slate-900">0</dt>
                <dd className="text-xs text-slate-500 mt-0.5">Invented skills</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-slate-900">∞</dt>
                <dd className="text-xs text-slate-500 mt-0.5">Free re-checks</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-slate-900">₹0</dt>
                <dd className="text-xs text-slate-500 mt-0.5">Always</dd>
              </div>
            </dl>
          </div>

          <MatchScoreWidget />
        </section>

        {/* How it works — connected process */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10">From job post to tailored draft, in four steps</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative">
            <div className="hidden lg:block absolute top-4 left-[12.5%] right-[12.5%] h-px bg-slate-200" aria-hidden="true" />
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-emerald-600 text-emerald-600 text-xs font-bold mb-4">
                  {step.n}
                </span>
                <h3 className="font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Feature deep-dive — alternating text + visual */}
        <section className="py-14 border-t border-slate-100 space-y-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built to match precisely, not stuff keywords</h2>

          {SHOWCASE.map((item, i) => (
            <div key={item.title} className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              {item.visual === 'keywords' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Detected in your experience, worded differently</p>
                  <div className="space-y-2.5">
                    {[
                      { from: '"container orchestration"', to: 'Kubernetes' },
                      { from: '"automated build pipeline"', to: 'CI/CD' },
                    ].map((row) => (
                      <div key={row.to} className="flex items-center gap-2 text-xs bg-white rounded-lg border border-slate-200 p-2.5">
                        <span className="text-slate-400 italic">{row.from}</span>
                        <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        <span className="font-semibold text-emerald-700">{row.to}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.visual === 'gauge' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#059669" strokeWidth="8" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * 0.08} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">92%</div>
                  </div>
                  <div className="text-sm text-slate-500">
                    Keyword match <span className="font-semibold text-slate-700">+</span> section completeness <span className="font-semibold text-slate-700">+</span> format, weighted into one number.
                  </div>
                </div>
              )}

              {item.visual === 'coverletter' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2.5">
                  <div className="h-1.5 w-2/5 bg-slate-800 rounded-full" />
                  <div className="h-1.5 w-1/3 bg-slate-200 rounded-full mb-2" />
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 space-y-1.5">
                    <div className="h-1.5 w-full bg-emerald-200/70 rounded-full" />
                    <div className="h-1.5 w-11/12 bg-emerald-200/70 rounded-full" />
                    <div className="h-1.5 w-4/5 bg-emerald-200/70 rounded-full" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                  <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                  <div className="h-1.5 w-3/5 bg-slate-100 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Trust & authenticity — Honest AI */}
        <section className="py-14 border-t border-slate-100">
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Honest AI, by design</h2>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl mb-8">
              The tool only rewords, reorders, and emphasizes what&rsquo;s already true about you. If a skill isn&rsquo;t in your resume anywhere, it shows up as a gap to close yourself — never as an invented bullet point.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 mb-3">Never does</p>
                <ul className="space-y-2.5">
                  {[
                    'Invent a certification you don’t have',
                    'Claim skills not mentioned anywhere in your resume',
                    'Fabricate job titles or work experience',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-3">Always does</p>
                <ul className="space-y-2.5">
                  {[
                    'Reword real experience using the job’s exact terminology',
                    'Surface skills you have but phrased differently',
                    'Reorder content to lead with what’s most relevant',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What tailoring changes — concrete example, not fabricated stats */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">What tailoring actually changes</h2>
          <p className="text-slate-500 mb-10 max-w-xl">One real bullet point, rewritten against one real job description. No invented achievements — same facts, matched to what the recruiter is scanning for.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-3">Generic resume</p>
              <p className="text-sm text-slate-600 leading-relaxed">&ldquo;Worked on backend services and helped deploy new features to production.&rdquo;</p>
            </div>
            <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-3">Tailored to this job post</p>
              <p className="text-sm text-slate-800 leading-relaxed">&ldquo;Built and deployed REST APIs on <span className="font-semibold">Kubernetes</span>, shipping features through an automated <span className="font-semibold">CI/CD pipeline</span>.&rdquo;</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Same underlying experience — reworded to match the terms this specific job description used.</p>
        </section>

        {/* FAQ */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Common questions</h2>
          <div className="max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-slate-900">
                  <h3 className="text-base">{q}</h3>
                  <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-14 border-t border-slate-100">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tailored in seconds, not hours</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-6">
              Paste a job description, get a matched resume and cover letter. Free, unlimited, honest about what it changes.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Tailor My Resume Now
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 pb-16 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Also explore</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/ai-tools/resume-builder" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-emerald-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 mb-1">Free Resume Builder</h3>
              <p className="text-sm text-slate-500">Build an ATS-ready resume from scratch — free, no watermarks.</p>
            </Link>
            <Link href="/ai-tools/smart-job-search" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-emerald-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 mb-1">Smart Job Search</h3>
              <p className="text-sm text-slate-500">AI matches you with jobs ranked by your actual fit score.</p>
            </Link>
            <Link href="/jobs/private" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-emerald-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-slate-500">50,000+ verified private and government tech jobs in India.</p>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
