import Link from 'next/link'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'
const PAGE_PATH = '/ai-tools/resume-rank-checker'

export const metadata = {
  title: 'Free ATS Resume Score Checker 2026 — Check Your ATS Score Instantly | MyTechZ',
  description:
    'Check your resume ATS score for free. Our AI-powered resume rank checker analyses keyword gaps, formatting issues, and section completeness to help you beat applicant tracking systems.',
  keywords: [
    'free ATS score checker',
    'resume rank checker',
    'ATS resume checker',
    'ATS resume checker India',
    'resume ATS score',
    'check resume score',
    'ATS compatibility checker',
    'resume keyword checker',
    'applicant tracking system checker',
    'resume score checker free',
  ],
  alternates: { canonical: `${SITE}${PAGE_PATH}` },
  openGraph: {
    title: 'Free ATS Resume Score Checker | MyTechZ',
    description: 'Instantly check your resume ATS score, find missing keywords, and get actionable tips to pass applicant tracking systems.',
    url: `${SITE}${PAGE_PATH}`,
    siteName: 'MyTechZ',
    type: 'website',
    images: [{ url: `${SITE}/og-resume-rank-checker.png`, width: 1200, height: 630, alt: 'MyTechZ Resume Rank Checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Score Checker | MyTechZ',
    description: 'Check your resume ATS score instantly and get actionable improvement tips.',
  },
  robots: { index: true, follow: true },
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'ATS Score in Seconds',
    description: 'Get your resume ATS compatibility score instantly — no waiting, no email required.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Keyword Gap Analysis',
    description: 'See exactly which keywords your resume is missing compared to the job description.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Visual Score Breakdown',
    description: 'Interactive charts show your scores across keywords, sections, formatting, and content depth.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Smart Suggestions',
    description: 'Get priority-sorted recommendations on what to add and where to add it in your resume.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Upload or Paste',
    description: 'Upload your resume as PDF, DOCX, or TXT — or simply paste the text directly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI-Powered Analysis',
    description: 'Powered by Gemini AI for intelligent keyword suggestions, with a reliable local fallback engine.',
  },
]

const FAQ = [
  {
    q: 'What is an ATS score and why does it matter?',
    a: 'An ATS (Applicant Tracking System) score measures how well your resume matches a job description. Most companies use ATS software to filter resumes before a human sees them. A higher ATS score means your resume is more likely to pass these automated filters and reach a recruiter.',
  },
  {
    q: 'How does the Resume Rank Checker work?',
    a: 'Our tool analyses your resume across four categories: keyword match (40%), section completeness (25%), content depth (20%), and formatting (15%). It compares your resume against the job description or role-based keyword sets and provides a weighted ATS compatibility score with actionable improvement suggestions.',
  },
  {
    q: 'Is the ATS score checker really free?',
    a: 'Yes, the Resume Rank Checker is completely free to use. You just need to create a free MyTechZ account to access the tool. There are no hidden fees, watermarks, or premium paywalls.',
  },
  {
    q: 'What file formats are supported?',
    a: 'You can upload your resume in PDF, DOCX, DOC, or TXT format. Alternatively, you can paste your resume text directly into the tool. We recommend using PDF or DOCX for the most accurate parsing.',
  },
  {
    q: 'How can I improve my ATS score?',
    a: 'Focus on including relevant keywords from the job description, use a clean format without tables or columns, start bullet points with action verbs, quantify your achievements with numbers, and ensure all standard sections (contact, summary, experience, education, skills) are present.',
  },
  {
    q: 'Can I check my resume against a specific job description?',
    a: 'Yes! You can paste the job description alongside your resume for a targeted analysis. The tool will compare your resume keywords directly against the job requirements and show you exactly what is missing.',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Rank Checker', item: `${SITE}${PAGE_PATH}` },
    ],
  }

  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Resume Rank Checker',
    description: 'Free ATS resume score checker — analyse keyword gaps, formatting, and section completeness.',
    url: `${SITE}${PAGE_PATH}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '320' },
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

export default function ResumeRankCheckerPage() {
  return (
    <>
      <JsonLd />

      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-4 pt-4 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400">
          <li><Link href="/" className="hover:text-gray-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/ai-tools" className="hover:text-gray-600">AI Tools</Link></li>
          <li>/</li>
          <li className="text-gray-600 font-medium">Resume Rank Checker</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Free ATS Score Checker
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Check Your Resume ATS Score<br className="hidden sm:block" /> in Seconds
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and get an instant ATS compatibility score. See missing keywords, formatting issues, and get priority-sorted suggestions to improve your chances.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/ai-tools/resume-rank-checker/check"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Check Your Score — Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/ai-tools/resume-builder"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Build a Resume First
          </Link>
        </div>
        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            100% Free
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI-Powered
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instant Results
          </span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Everything You Need to Beat the ATS
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
              <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                {f.icon}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Upload or Paste Your Resume', desc: 'Upload a PDF/DOCX file or paste your resume text directly.' },
            { step: '2', title: 'Add a Job Description (Optional)', desc: 'Paste the target job description for a keyword-specific analysis.' },
            { step: '3', title: 'Get Your ATS Score', desc: 'View your score, category breakdown, missing keywords, and priority-sorted suggestions.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/ai-tools/resume-rank-checker/check"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try It Now — Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ.map((f, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl">
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {f.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/ai-tools/resume-builder" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Free Resume Builder</h3>
            <p className="text-xs text-gray-500 mt-1">Create ATS-optimised resumes with AI — no watermarks.</p>
          </Link>
          <Link href="/ai-tools" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">All AI Tools</h3>
            <p className="text-xs text-gray-500 mt-1">Browse all career tools powered by AI.</p>
          </Link>
          <Link href="/jobs" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Browse Jobs</h3>
            <p className="text-xs text-gray-500 mt-1">Find private, government, and internship opportunities.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
