// Page Version: v1.1.0 | Last Updated: 2026-07-12
import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free AI Career Tools 2026 — Resume Builder, ATS Checker & Smart Job Search',
  description:
    'Free AI-powered career tools by MyTechZ: free resume builder, ATS resume analyzer, and smart job search — all free for Indian job seekers.',
  keywords:
    'AI career tools, free resume builder, resume analyzer, ATS score checker, smart job search, AI job matching India, free CV builder, career tools free India',
  alternates: { canonical: `${SITE}/ai-tools` },
  openGraph: {
    title: 'Free AI Career Tools — Smart Job Search',
    description: 'Free AI-powered career tools: AI job matching and smart job search.',
    url: `${SITE}/ai-tools`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free AI Career Tools' }],
  },
  twitter: { card: 'summary_large_image' },
}

const tools = [
  {
    title: 'Free Resume Builder',
    href: '/ai-tools/resume-builder',
    description: 'Build a professional, ATS-friendly resume in minutes. AI writes your bullet points, picks keywords, and exports a clean PDF — 100% free, no watermarks.',
    badge: 'Coming Soon',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    gradient: 'from-blue-50 to-indigo-100',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Resume Analyzer',
    href: '/ai-tools/resume-analyzer',
    description: 'Get an instant ATS match score for your resume against any job description. See missing keywords, weak sections, and exactly what to fix — free.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: 'from-violet-50 to-purple-100',
    border: 'border-violet-100',
    iconBg: 'bg-violet-600',
  },
  {
    title: 'Smart Job Search',
    href: '/ai-tools/smart-job-search',
    description: 'Let AI match you with the best job opportunities based on your skills, experience, and career goals — ranked by fit score, not just keywords.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    gradient: 'from-purple-50 to-violet-100',
    border: 'border-purple-100',
    iconBg: 'bg-purple-600',
  },
  {
    title: 'Cover Letter Builder',
    href: '/ai-tools/cover-letter-builder',
    description: 'Write a tailored, professional cover letter in minutes. AI drafts an opening and body from your profile and the job description — free, no watermarks.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    gradient: 'from-amber-50 to-orange-100',
    border: 'border-amber-100',
    iconBg: 'bg-amber-600',
  },
  {
    title: 'Salary Calculator',
    href: '/ai-tools/salary-calculator',
    description: 'Calculate your in-hand salary from CTC instantly. Compare old vs new tax regime and see your full salary breakup — free, no login required.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-green-50 to-emerald-100',
    border: 'border-green-100',
    iconBg: 'bg-green-600',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Career Tools', item: `${SITE}/ai-tools` },
    ],
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MyTechZ Free AI Career Tools',
    description: 'Free AI-powered career tools for Indian job seekers: resume builder, resume analyzer, cover letter builder, smart job search, and salary calculator.',
    url: `${SITE}/ai-tools`,
    numberOfItems: 5,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Free Resume Builder', url: `${SITE}/ai-tools/resume-builder`, description: 'Build ATS-friendly resumes with AI — 100% free, no watermarks.' },
      { '@type': 'ListItem', position: 2, name: 'Resume Analyzer', url: `${SITE}/ai-tools/resume-analyzer`, description: 'Get instant ATS match score and keyword recommendations for your resume.' },
      { '@type': 'ListItem', position: 3, name: 'Smart Job Search', url: `${SITE}/ai-tools/smart-job-search`, description: 'AI matches you with jobs ranked by fit score, not just keywords.' },
      { '@type': 'ListItem', position: 4, name: 'Cover Letter Builder', url: `${SITE}/ai-tools/cover-letter-builder`, description: 'Write a tailored, professional cover letter in minutes — free, no watermarks.' },
      { '@type': 'ListItem', position: 5, name: 'Salary Calculator', url: `${SITE}/ai-tools/salary-calculator`, description: 'Calculate your in-hand salary from CTC and compare old vs new tax regime — free.' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are MyTechZ AI career tools really free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — all AI tools on MyTechZ are 100% free. No subscriptions, no hidden fees, no credit card required. Build resumes, check ATS scores, and get AI job matches at no cost.' },
      },
      {
        '@type': 'Question',
        name: 'What AI tools does MyTechZ offer?',
        acceptedAnswer: { '@type': 'Answer', text: 'MyTechZ offers three free AI career tools: (1) Free Resume Builder with AI bullet points and ATS-optimised templates, (2) Resume Analyzer that scores your resume against job descriptions, and (3) Smart Job Search that matches you with jobs by fit score.' },
      },
      {
        '@type': 'Question',
        name: 'Who are MyTechZ AI tools built for?',
        acceptedAnswer: { '@type': 'Answer', text: 'MyTechZ AI tools are built specifically for Indian tech job seekers — optimised for Indian job market standards, ATS systems used by Indian companies, and common career patterns in India.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

export default function AIToolsPage() {
  return (
    <>
      <JsonLd />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">AI Career Tools</span>
        </nav>

        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">Free for everyone</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free AI-Powered <span className="text-blue-600">Career Tools</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supercharge your job search with our free suite of AI tools — built specifically for Indian tech job seekers.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${tool.gradient} p-8 ${tool.border} border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {tool.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-200 text-slate-600">
                  {tool.badge}
                </span>
              )}
              <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                {tool.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Why Use MyTechZ AI Career Tools?</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>100% free:</strong> No subscriptions, no hidden fees, no credit card required.</span></li>
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>Built for India:</strong> Optimised for Indian job market standards and common job search patterns.</span></li>
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>AI-powered:</strong> Matches jobs by fit score, not just keywords.</span></li>
          </ul>
        </div>
      </section>
    </>
  )
}
