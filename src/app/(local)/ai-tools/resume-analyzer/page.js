// Page Version: v1.0.0 | Last Updated: 2026-07-12
import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Resume Analyzer — ATS Score Checker & Job Match Tool',
  description:
    'Check your resume ATS score for free. Paste a job description and get an instant match score, keyword gap analysis, and suggestions to improve your resume — 100% free.',
  keywords:
    'free resume analyzer, ATS score checker, resume score checker, ATS resume checker India, resume keyword analyzer, job match score, resume rank checker, resume compatibility checker India',
  alternates: { canonical: `${SITE}/ai-tools/resume-analyzer` },
  openGraph: {
    title: 'Free Resume Analyzer — ATS Score Checker',
    description: 'Get your resume ATS match score instantly. See which keywords you are missing and how to improve your chances — free.',
    url: `${SITE}/ai-tools/resume-analyzer`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free Resume Analyzer' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: false, follow: true },
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload or paste your resume',
    description: 'Upload your existing resume PDF or paste the text directly into the analyzer.',
    color: 'bg-blue-600',
  },
  {
    step: '02',
    title: 'Add the job description',
    description: 'Paste the job description from any listing — Indeed, LinkedIn, Naukri, or directly from the company site.',
    color: 'bg-indigo-600',
  },
  {
    step: '03',
    title: 'Get your ATS match score',
    description: 'Instantly see your compatibility percentage, missing keywords, and a prioritised list of improvements.',
    color: 'bg-violet-600',
  },
  {
    step: '04',
    title: 'Fix & re-check for free',
    description: 'Make changes in our free resume builder, re-run the analyzer, and watch your score improve — as many times as you need.',
    color: 'bg-blue-600',
  },
]

const WHAT_YOU_GET = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'ATS Match Score',
    description: 'A percentage score showing how well your resume matches the job description — the same metric ATS software uses to filter candidates.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: 'Missing Keyword Report',
    description: 'A detailed list of important keywords from the job description that are absent from your resume — with context on where to add them.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'AI Improvement Suggestions',
    description: 'Specific, prioritised suggestions — not generic tips. The AI tells you exactly what to rewrite, what to add, and what to remove.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Section-by-Section Feedback',
    description: 'Scores for each resume section — summary, skills, experience, education. Pinpoints exactly which section is hurting your match score.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
    title: 'Unlimited Re-checks — Free',
    description: 'Improve your resume and re-analyze as many times as you need against the same or different job descriptions — completely free.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10m14 11V10M9 21v-6h6v6M4 10l8-6 8 6" />
      </svg>
    ),
    title: 'Indian Job Market Calibrated',
    description: 'Our keyword library and scoring is calibrated specifically to Indian job postings on Naukri, LinkedIn, Indeed, and direct company portals.',
  },
]

const FAQ = [
  {
    q: 'What is a resume ATS score and why does it matter?',
    a: 'An ATS (Applicant Tracking System) score tells you how compatible your resume is with a specific job description. Most companies in India now use ATS software to filter applications before a human reads them. If your score is low, your resume gets rejected automatically — even if you are qualified.',
  },
  {
    q: 'Is the resume analyzer completely free?',
    a: 'Yes. The MyTechZ Resume Analyzer is free for all users. Upload your resume, paste a job description, and get your full score and recommendations at no cost.',
  },
  {
    q: 'How accurate is the ATS match score?',
    a: 'Our scoring engine is based on keyword matching, semantic analysis, and section completeness — the same criteria used by popular ATS platforms like Greenhouse, Lever, and Taleo. While no external tool can replicate every ATS perfectly, a high score here significantly improves your real-world ATS pass rate.',
  },
  {
    q: 'Can I analyze my resume for government job applications?',
    a: 'Yes. Paste the eligibility criteria or job notification text as the "job description" and the analyzer will check your resume against those requirements and flag missing qualifications.',
  },
  {
    q: 'What file formats are supported for resume upload?',
    a: 'PDF and Word (DOCX) formats are both supported. You can also paste your resume text directly if you prefer.',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Analyzer', item: `${SITE}/ai-tools/resume-analyzer` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Resume Analyzer',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/resume-analyzer`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free ATS resume score checker. Get your match score against any job description along with keyword gap analysis and improvement suggestions.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

export default function ResumeAnalyzerPage() {
  return (
    <>
      <JsonLd />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-8 pb-4 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Resume Analyzer</span>
        </nav>

        {/* Hero */}
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700 mb-5">
              <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
              Live Now — Free ATS Score Checker
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Free Resume Analyzer<br />
              <span className="text-violet-600">ATS Score &amp; Keyword Gap</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Paste any job description and get an instant ATS compatibility score for your resume. See exactly which keywords you are missing, which sections are weak, and what to fix — all free.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/ai-tools/resume-rank-checker/check"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5"
              >
                Analyze My Resume — Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/ai-tools/resume-builder"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Build Resume First
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              {['100% Free — No credit card', 'PDF & DOCX supported', 'Keyword gap analysis', 'Indian job market calibrated'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Available Now Banner */}
        <section className="py-10 border-t border-slate-100">
          <div className="bg-linear-to-br from-violet-50 via-indigo-50 to-white rounded-3xl border border-violet-100 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Analyzer is live — check your score now</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">
              Upload your resume, paste a job description, and get your ATS match score, missing keywords, and improvement suggestions in seconds — completely free.
            </p>
            <Link
              href="/ai-tools/resume-rank-checker/check"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              Analyze My Resume Now
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How the Resume Analyzer works</h2>
          <p className="text-slate-500 mb-10 max-w-xl">Four steps from upload to a fully scored, improved resume.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl border border-slate-200 p-6">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${step.color} text-white text-sm font-bold mb-4`}>
                  {step.step}
                </span>
                <h3 className="font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">What you get in the free analysis</h2>
          <p className="text-slate-500 mb-10 max-w-xl">Every report includes all of the following — no paid tier needed.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_YOU_GET.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-200 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — AEO */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">Resume Analyzer — Common Questions</h2>
          <div className="space-y-5 max-w-5xl mx-auto">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 pb-16 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Also explore</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/ai-tools/resume-builder" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-violet-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-violet-700 mb-1">Free Resume Builder</h3>
              <p className="text-sm text-slate-500">Build an ATS-ready resume from scratch — free, no watermarks.</p>
            </Link>
            <Link href="/ai-tools/smart-job-search" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-violet-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-violet-700 mb-1">Smart Job Search</h3>
              <p className="text-sm text-slate-500">AI matches you with jobs ranked by your actual fit score.</p>
            </Link>
            <Link href="/jobs/private" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-violet-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-violet-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-slate-500">50,000+ verified private and government tech jobs in India.</p>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
