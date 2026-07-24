import Link from 'next/link'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'
const URL_PATH = '/ai-tools/resume-builder'
// Base title only — the root layout's `title.template` appends " | MyTechZ" automatically.
const TITLE = 'Free Resume Builder — ATS-Friendly Templates'
const RENDERED_TITLE = `${TITLE} | MyTechZ`

export const metadata = {
  title: TITLE,
  description:
    'Build an ATS-friendly resume free with MyTechZ. AI-written bullet points, 6 recruiter-tested templates, free PDF/DOCX export — no watermarks, no credit card.',
  keywords:
    'free resume builder, free CV builder, best free resume builder India, AI resume builder, ATS resume builder, resume maker free, CV maker free, online resume builder India, resume builder no watermark',
  alternates: { canonical: `${SITE}${URL_PATH}` },
  openGraph: {
    title: 'Free Resume Builder — ATS-Friendly Templates | MyTechZ',
    description: 'Create a recruiter-ready resume in minutes. AI bullet points, ATS-safe templates, free PDF export — no watermarks, no paid plans.',
    url: `${SITE}${URL_PATH}`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free Resume Builder' }],
  },
  twitter: { card: 'summary_large_image' },
}

const TEMPLATES = [
  { name: 'Classic', accent: 'bg-slate-700' },
  { name: 'Modern', accent: 'bg-blue-600' },
  { name: 'Professional', accent: 'bg-indigo-600' },
  { name: 'Creative', accent: 'bg-fuchsia-600' },
  { name: 'Minimal', accent: 'bg-slate-400' },
  { name: 'Tech', accent: 'bg-emerald-600' },
]

const STEPS = [
  { n: '01', title: 'Pick a template', desc: 'Choose from 6 ATS-tested layouts — Classic to Tech.' },
  { n: '02', title: 'Fill in your details', desc: 'Or describe your work in plain language, we structure it.' },
  { n: '03', title: 'Let AI sharpen it', desc: 'Weak bullet points get rewritten with metrics and strong verbs.' },
  { n: '04', title: 'Export, free', desc: 'Download as PDF or DOCX — full resolution, no watermark.' },
]

const SHOWCASE = [
  {
    title: 'AI rewrites weak bullet points',
    desc: 'Describe what you did in plain language. The AI restructures it into a quantified, recruiter-approved bullet — action verb, metric, and impact, in that order.',
    visual: 'bullets',
  },
  {
    title: 'Every template is built to pass ATS',
    desc: 'No text boxes, tables, or graphics that scanning software chokes on. Six layouts, all using clean single-column structure that parses correctly every time.',
    visual: 'templates',
  },
  {
    title: 'Tailor it to the exact job in seconds',
    desc: 'Paste a job description and get the keywords it expects — added to your resume with one click, so you match what the ATS is actually scanning for.',
    visual: 'keywords',
  },
]

const SECONDARY_FEATURES = [
  { title: 'Live preview', desc: 'Every change renders instantly — no “generate” button to wait on.' },
  { title: 'PDF & DOCX export', desc: 'Both formats included free, full resolution, no watermark.' },
  { title: 'Multiple versions', desc: 'Save a version per role — engineer, PM, analyst — from one profile.' },
  { title: 'Government-format ready', desc: 'Layouts that follow UPSC, SSC, banking and PSU conventions.' },
]

const FAQ = [
  {
    q: 'Is the MyTechZ resume builder really free?',
    a: 'Yes — 100% free. No credit card required, no paid tier, no watermarks on downloads. Build and export as many resumes as you want for free.',
  },
  {
    q: 'What makes a resume ATS-friendly?',
    a: 'ATS (Applicant Tracking Systems) scan resumes before a human sees them. ATS-friendly resumes use clean layouts, standard section headings, and relevant keywords. Our templates are built specifically to pass ATS filters used by companies across India.',
  },
  {
    q: 'Can I use this resume builder for government jobs (UPSC, SSC, PSU)?',
    a: 'Yes. Our templates include government-job-optimised formats that follow the conventions expected by UPSC, SSC, banking, and PSU application portals.',
  },
  {
    q: 'How is this different from other free resume builders?',
    a: 'Most "free" builders add watermarks, limit exports, or lock templates behind paywalls. MyTechZ is built for Indian job seekers — fully free, with AI assistance, and templates tested against Indian recruiters and ATS systems.',
  },
  {
    q: 'Can I download my resume as PDF and Word (DOCX)?',
    a: 'Yes. Both PDF and DOCX export are included for free. PDF is recommended for most online applications; DOCX is handy when a company asks you to fill in a specific form.',
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
      { '@type': 'ListItem', position: 3, name: 'Free Resume Builder', item: `${SITE}${URL_PATH}` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Free Resume Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}${URL_PATH}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free AI-powered resume builder with ATS-optimised templates. Export as PDF or DOCX with no watermarks.',
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

/** Stylised resume document — a real layout mock, not a generic icon-in-a-box. */
function ResumeMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-blue-100/60 via-transparent to-transparent rounded-[2rem] -z-10" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="flex">
          <div className="w-[30%] bg-slate-900 p-5 space-y-5">
            <div className="w-12 h-12 rounded-full bg-white/15" />
            <div className="space-y-1.5">
              <div className="h-2 w-16 bg-white/70 rounded-full" />
              <div className="h-1.5 w-11 bg-white/30 rounded-full" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-1.5 w-full bg-white/20 rounded-full" />
              <div className="h-1.5 w-4/5 bg-white/20 rounded-full" />
              <div className="h-1.5 w-full bg-white/20 rounded-full" />
            </div>
            <div className="pt-2 flex flex-wrap gap-1">
              {['React', 'Node', 'SQL'].map((s) => (
                <span key={s} className="text-[8px] font-medium text-white/80 bg-white/10 rounded px-1.5 py-0.5">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 p-5 space-y-4">
            <div className="space-y-1.5">
              <div className="h-2.5 w-2/5 bg-slate-800 rounded-full" />
              <div className="h-1.5 w-3/5 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full" />
              <div className="h-1.5 w-11/12 bg-slate-100 rounded-full" />
            </div>
            <div className="pt-2 space-y-2">
              <div className="h-1.5 w-1/4 bg-slate-700 rounded-full" />
              <div className="relative rounded-lg border border-emerald-200 bg-emerald-50/80 p-2.5 space-y-1">
                <div className="h-1.5 w-full bg-emerald-200/70 rounded-full" />
                <div className="h-1.5 w-10/12 bg-emerald-200/70 rounded-full" />
                <span className="absolute -top-2.5 right-2 inline-flex items-center gap-1 bg-emerald-600 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" /></svg>
                  AI rewritten
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full" />
              <div className="h-1.5 w-4/5 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumeBuilderPage() {
  return (
    <>
      <JsonLd />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <nav aria-label="Breadcrumb" className="pt-8 pb-4 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Free Resume Builder</span>
        </nav>

        {/* Hero */}
        <section className="py-10 sm:py-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold tracking-wide uppercase text-amber-700 mb-5">
              Launching soon
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              A resume builder that thinks in ATS keywords, not fonts.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Six recruiter-tested templates, AI that rewrites your bullet points, and a free PDF/DOCX export — no watermark, no credit card, ever.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
              >
                Join the waitlist
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Browse jobs instead
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-sm">
              <div>
                <dt className="text-2xl font-bold text-slate-900">6</dt>
                <dd className="text-xs text-slate-500 mt-0.5">ATS-safe templates</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-slate-900">₹0</dt>
                <dd className="text-xs text-slate-500 mt-0.5">Forever, no upsell</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-slate-900">2</dt>
                <dd className="text-xs text-slate-500 mt-0.5">Export formats</dd>
              </div>
            </dl>
          </div>

          <ResumeMock />
        </section>

        {/* How it works — connected process, not a card grid */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10">From blank page to ready-to-send</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative">
            <div className="hidden lg:block absolute top-4 left-[12.5%] right-[12.5%] h-px bg-slate-200" aria-hidden="true" />
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-blue-600 text-blue-600 text-xs font-bold mb-4">
                  {step.n}
                </span>
                <h3 className="font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Showcase — alternating text + visual, not repeated icon cards */}
        <section className="py-14 border-t border-slate-100 space-y-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built to get past the filter, not just look nice</h2>

          {SHOWCASE.map((item, i) => (
            <div key={item.title} className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              {item.visual === 'bullets' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-3 text-sm text-slate-400 italic">
                    &ldquo;worked on backend stuff for the payments team&rdquo;
                  </div>
                  <div className="flex justify-center text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" /></svg>
                  </div>
                  <div className="bg-white rounded-lg border border-emerald-200 p-3 text-sm text-slate-800">
                    Rebuilt the payments settlement service, cutting failed-transaction retries by <span className="font-semibold text-emerald-700">42%</span> across 3 payment providers.
                  </div>
                </div>
              )}

              {item.visual === 'templates' && (
                <div className="grid grid-cols-3 gap-3">
                  {TEMPLATES.map((t) => (
                    <div key={t.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="h-16 p-2 space-y-1">
                        <div className={`h-1.5 w-1/2 rounded-full ${t.accent}`} />
                        <div className="h-1 w-full bg-slate-100 rounded-full" />
                        <div className="h-1 w-4/5 bg-slate-100 rounded-full" />
                        <div className="h-1 w-full bg-slate-100 rounded-full" />
                      </div>
                      <div className="px-2 py-1.5 border-t border-slate-100 text-[10px] font-medium text-slate-500">{t.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {item.visual === 'keywords' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Detected from job description</p>
                  <div className="flex flex-wrap gap-2">
                    {['REST APIs', 'PostgreSQL', 'CI/CD', 'System Design', 'AWS'].map((k, idx) => (
                      <span
                        key={k}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${idx < 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}
                      >
                        {idx < 3 ? '✓ ' : '+ '}{k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Secondary features — compact list, deliberately different rhythm */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Also included, free</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {SECONDARY_FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — native accordion, no JS required */}
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

        {/* Waitlist CTA */}
        <section className="py-14 border-t border-slate-100">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Be first to build with it</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-6">
              We&rsquo;re finishing the editor and templates. Join the waitlist and get access the day it opens — still free.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Join the waitlist
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 pb-16 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Also explore</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/ai-tools/resume-analyzer" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Resume Analyzer</h3>
              <p className="text-sm text-slate-500">Get your ATS match score against any job description — free.</p>
            </Link>
            <Link href="/ai-tools/smart-job-search" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Smart Job Search</h3>
              <p className="text-sm text-slate-500">AI matches you with jobs ranked by your actual fit score.</p>
            </Link>
            <Link href="/jobs/private" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-slate-500">50,000+ verified private and government tech jobs in India.</p>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
