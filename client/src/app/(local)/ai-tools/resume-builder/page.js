// Page Version: v1.1.0 | Last Updated: 2026-07-12
import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Resume Builder 2026 — Create ATS-Friendly Resumes Instantly (No Sign-Up)',
  description:
    'Build a professional resume for free with MyTechZ AI Resume Builder. Choose from ATS-optimised templates, get AI-powered bullet points, and export as PDF — 100% free, no watermarks.',
  keywords:
    'free resume builder, free CV builder, best free resume builder India, AI resume builder, ATS resume builder, resume maker free, CV maker free, online resume builder India, resume builder no watermark',
  alternates: { canonical: `${SITE}/ai-tools/resume-builder` },
  openGraph: {
    title: 'Free Resume Builder 2026 — ATS-Friendly, AI-Powered (No Sign-Up)',
    description: 'Create a recruiter-ready resume in minutes. Free templates, AI bullet points, PDF export — no watermarks, no paid plans.',
    url: `${SITE}/ai-tools/resume-builder`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free Resume Builder' }],
  },
  twitter: { card: 'summary_large_image' },
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.5" />
      </svg>
    ),
    title: 'AI-Powered Bullet Points',
    description: 'Describe your work experience in plain language — AI rewrites it into strong, quantified, recruiter-approved bullet points instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'ATS-Optimised Templates',
    description: 'Every template is designed to pass Applicant Tracking Systems used by top companies in India. No fancy graphics that get rejected.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: 'PDF Export — Free, No Watermarks',
    description: 'Export your finished resume as a clean, professional PDF or DOCX. No hidden charges, no "premium to remove watermark" tricks.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    ),
    title: 'Live Preview & Easy Editing',
    description: 'See your resume update in real time as you type. Drag sections, change fonts, swap colours — complete control over the final look.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'AI Keyword Suggestions',
    description: 'Paste a job description and get instant keyword recommendations to tailor your resume for that specific role and beat ATS filters.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
    title: 'Multiple Versions',
    description: 'Create and save different resume versions for different roles — software engineer, product manager, data analyst — all in one place.',
  },
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
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Free Resume Builder', item: `${SITE}/ai-tools/resume-builder` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Free Resume Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/resume-builder`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

export default function ResumeBuilderPage() {
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
          <span className="text-slate-700">Free Resume Builder</span>
        </nav>

        {/* Hero */}
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
              Now Live — Free for All Indian Job Seekers
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Best Free Resume Builder<br />
              <span className="text-blue-600">&amp; CV Builder for Free</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Build an ATS-optimised, recruiter-ready resume in minutes — completely free. AI writes your bullet points, picks the right keywords, and formats everything beautifully. No watermarks. No credit card.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/ai-tools/resume-builder/templates"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
              >
                Build Your Resume — Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Browse Jobs First
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              {['100% Free — No hidden fees', 'No watermarks on PDF', 'ATS-Optimised templates', 'Tested by Indian recruiters'].map((t) => (
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

        {/* Preview mockup */}
        <section className="py-10 border-t border-slate-100">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-3xl border border-blue-100 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Builder is Live</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">
              Choose from 5 ATS-optimised templates, fill in your details (or let AI do it for you), and export your resume in seconds — PDF, DOCX, PNG, and more.
            </p>
            <Link
              href="/ai-tools/resume-builder/templates"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              Browse Templates & Get Started
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Everything in the free resume builder
          </h2>
          <p className="text-slate-500 mb-10 max-w-xl">
            All features are free. Always. No upsells once you are inside the editor.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — AEO */}
        <section className="py-14 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Free Resume Builder — Common Questions
          </h2>
          <div className="space-y-5 max-w-3xl">
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
            <Link href="/ai-tools/resume-analyzer" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Resume Analyzer</h3>
              <p className="text-sm text-slate-500">Get your ATS match score against any job description — free.</p>
            </Link>
            <Link href="/ai-tools/smart-job-search" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Smart Job Search</h3>
              <p className="text-sm text-slate-500">AI matches you with jobs ranked by your actual fit score.</p>
            </Link>
            <Link href="/jobs/private" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-slate-500">50,000+ verified private and government tech jobs in India.</p>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
