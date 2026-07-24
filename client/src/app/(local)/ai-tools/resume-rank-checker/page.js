import Link from 'next/link'
import UploadWidget from './_components/UploadWidget'

const SITE = 'https://mytechz.com'
// Base title only — the root layout's `title.template` appends " | MyTechZ" automatically.
const TITLE = 'Free ATS Resume Checker — Score & Rank Analyzer'
const RENDERED_TITLE = `${TITLE} | MyTechZ`

export const metadata = {
  title: TITLE,
  description:
    'Get your free ATS resume score instantly. Upload your resume, select a job role, and see keyword gaps, section scores, and fixes to improve shortlisting.',
  keywords:
    'free ATS resume checker, resume ATS score, ATS resume test free, resume rank checker, resume score checker, resume keyword checker, ATS compatibility checker India, resume analyser free',
  alternates: { canonical: `${SITE}/ai-tools/resume-rank-checker` },
  openGraph: {
    title: 'Free ATS Resume Checker — Resume Score & Rank Analyser | MyTechZ',
    description: 'Upload your resume and get an instant ATS score. Free keyword gap analysis, section audit, and suggestions. No login required to see demo.',
    url: `${SITE}/ai-tools/resume-rank-checker`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free ATS Resume Checker' }],
  },
  twitter: { card: 'summary_large_image' },
}

function JsonLd() {
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: RENDERED_TITLE,
    description: metadata.description,
    url: `${SITE}/ai-tools/resume-rank-checker`,
    breadcrumb: { '@id': `${SITE}/ai-tools/resume-rank-checker#breadcrumb` },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE}/ai-tools/resume-rank-checker#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Rank Checker', item: `${SITE}/ai-tools/resume-rank-checker` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ ATS Resume Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/resume-rank-checker`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free ATS resume score checker. Upload your resume to get instant keyword gap analysis, section audit, and improvement suggestions.',
    provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
    featureList: [
      'Instant ATS score (0-100)',
      'Keyword gap analysis for 14 job roles',
      '9-section resume audit',
      'Action verb scoring',
      'Quantification analysis',
      'Smart Editor with inline highlights',
    ],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a resume ATS score?',
        acceptedAnswer: { '@type': 'Answer', text: 'An ATS (Applicant Tracking System) score measures how well your resume matches a specific job description. It analyzes keyword presence, formatting, section structure, action verbs, and quantification. A score above 70 significantly improves your chances of passing automated screening and reaching a human recruiter.' },
      },
      {
        '@type': 'Question',
        name: 'How does the MyTechZ ATS checker score my resume?',
        acceptedAnswer: { '@type': 'Answer', text: 'MyTechZ scores your resume across 6 weighted dimensions: Keywords (35%), Sections (25%), Formatting (15%), Action Verbs (10%), Quantification (10%), and Readability (5%). Each dimension gets a score from 0-100, and the weighted average is your overall ATS score.' },
      },
      {
        '@type': 'Question',
        name: 'Is the ATS resume checker free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, the MyTechZ Resume Rank Checker is completely free. Create a free account to upload your resume and get your full ATS score, keyword gaps, section audit, strengths, weaknesses, and access to the Smart Editor — all at no cost.' },
      },
      {
        '@type': 'Question',
        name: 'How do I improve my ATS resume score?',
        acceptedAnswer: { '@type': 'Answer', text: 'To improve your ATS score: (1) Add missing keywords for your target job role, (2) Include all standard sections — Summary, Experience, Education, Skills, (3) Use 3-5 bullet points per job with action verbs, (4) Quantify achievements with numbers and percentages, (5) Avoid tables, images, and complex formatting. MyTechZ\'s Smart Editor highlights exactly where to make changes.' },
      },
      {
        '@type': 'Question',
        name: 'What file formats does the ATS checker accept?',
        acceptedAnswer: { '@type': 'Answer', text: 'The MyTechZ ATS checker accepts PDF, DOCX, DOC, and TXT resume files up to 10 MB.' },
      },
    ],
  }

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to check your resume ATS score for free',
    description: 'Get your free ATS resume score in 3 simple steps using MyTechZ.',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Select target job roles', text: 'Choose one or more job roles you are applying for to get role-specific keyword analysis.' },
      { '@type': 'HowToStep', position: 2, name: 'Upload your resume', text: 'Upload your resume as a PDF, DOCX, DOC, or TXT file. Max file size is 10 MB.' },
      { '@type': 'HowToStep', position: 3, name: 'Get your ATS score', text: 'Instantly receive your ATS score, keyword gaps, section audit, strengths, weaknesses, and specific suggestions. Use the Smart Editor to fix issues inline.' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    </>
  )
}

const SCORE_DIMENSIONS = [
  { label: 'Keywords', pct: 35, color: 'bg-blue-600', desc: 'How many role-specific keywords appear in your resume.' },
  { label: 'Sections', pct: 25, color: 'bg-violet-500', desc: 'Presence and quality of 9 standard resume sections.' },
  { label: 'Formatting', pct: 15, color: 'bg-emerald-500', desc: 'Clean layout, bullet structure, and length balance.' },
  { label: 'Action Verbs', pct: 10, color: 'bg-amber-500', desc: 'Use of strong, impactful verbs to start bullet points.' },
  { label: 'Quantification', pct: 10, color: 'bg-rose-500', desc: 'Numbers, percentages, and metrics proving impact.' },
  { label: 'Readability', pct: 5, color: 'bg-cyan-500', desc: 'Sentence clarity and word-level complexity.' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Instant ATS Score',
    desc: '6-dimension weighted scoring gives you a precise 0–100 ATS compatibility score the moment your resume is uploaded.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: 'Keyword Gap Analysis',
    desc: 'See exactly which keywords recruiters expect for your target role — and which ones are missing from your resume.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: '9-Section Audit',
    desc: 'Checks for Contact Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, and Awards.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Smart Editor',
    desc: 'Open the inline editor to see your resume with coloured highlights — red for critical issues, amber for quick wins, green for strengths.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Strengths & Weaknesses',
    desc: 'Categorised insights tell you exactly what to keep, what to fix, and what to add for maximum ATS compatibility.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Track Improvement',
    desc: 'Every analysis is saved to your account. Edit your resume in the Smart Editor, re-check, and see your score climb.',
  },
]

const STEPS = [
  { n: '1', title: 'Select Job Roles', desc: 'Choose one or more roles you are applying for. This tailors keyword analysis to what recruiters actually look for.' },
  { n: '2', title: 'Upload Your Resume', desc: 'Drop a PDF, DOCX, or TXT file. We extract text instantly — max 10 MB.' },
  { n: '3', title: 'Get Your Score', desc: 'Receive your ATS score, gap analysis, section audit, and actionable fixes within seconds.' },
]

export default function ResumeRankCheckerPage() {
  return (
    <>
      <JsonLd />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
            <span aria-hidden="true">›</span>
            <span className="text-slate-700">Resume Rank Checker</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                100% Free — No Credit Card
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Free ATS Resume <span className="text-blue-700">Rank Checker</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Upload your resume and get an instant ATS compatibility score. See which keywords are missing, which sections need work, and exactly what to fix — completely free.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {['Instant score', 'Keyword analysis', '9-section audit', 'Smart Editor', 'Free forever'].map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload widget */}
            <div>
              <UploadWidget />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <section className="py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">How It Works</h2>
          <p className="text-slate-500 text-center text-sm mb-10">Get your ATS score in under 30 seconds</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-700 text-white font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Score Breakdown ───────────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">How Your ATS Score Is Calculated</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Your resume is scored across 6 dimensions, each weighted by how much real ATS systems and recruiters actually care about it.
              </p>
              <div className="space-y-4">
                {SCORE_DIMENSIONS.map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-700">{d.label}</span>
                      <span className="text-xs text-slate-400 font-medium">{d.pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-2 ${d.color} rounded-full`} style={{ width: `${d.pct * 2.86}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Sample ATS Score</p>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1d4ed8" strokeWidth="10"
                      strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-blue-700">75</span>
                    <span className="text-xs text-slate-400 font-medium">ATS Score</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Keywords', val: '68%', color: 'text-blue-600' },
                  { label: 'Sections', val: '89%', color: 'text-violet-600' },
                  { label: 'Formatting', val: '82%', color: 'text-emerald-600' },
                  { label: 'Action Verbs', val: '70%', color: 'text-amber-600' },
                  { label: 'Quantification', val: '55%', color: 'text-rose-600' },
                  { label: 'Readability', val: '90%', color: 'text-cyan-600' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-lg p-2.5 border border-slate-100 flex justify-between">
                    <span className="text-slate-500">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Everything You Get — Free</h2>
          <p className="text-slate-500 text-sm text-center mb-10">No premium tiers. No watermarks. No credit card.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Smart Editor Preview ─────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-hidden">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-slate-400 text-xs">Smart Editor — inline highlights</span>
              </div>
              <div className="space-y-2 text-slate-300 leading-relaxed text-xs">
                <p><span className="bg-green-800/60 text-green-300 rounded px-0.5">John Doe | Software Engineer</span></p>
                <p className="text-slate-400">john@email.com | +91 98765 43210</p>
                <p className="mt-3 font-semibold text-slate-200">EXPERIENCE</p>
                <p><span className="bg-amber-800/60 text-amber-300 rounded px-0.5">Worked on backend systems</span> at TechCorp (2022–2024)</p>
                <p className="text-slate-400 pl-2">• <span className="bg-red-800/60 text-red-300 rounded px-0.5">Improved system performance</span></p>
                <p className="text-slate-400 pl-2">• <span className="bg-green-800/60 text-green-300 rounded px-0.5">Reduced API latency by 40% using Redis caching</span></p>
                <p className="text-slate-400 pl-2">• <span className="bg-amber-800/60 text-amber-300 rounded px-0.5">Managed database queries</span></p>
                <p className="mt-3 font-semibold text-slate-200">SKILLS</p>
                <p className="text-slate-400"><span className="bg-red-800/60 text-red-300 rounded px-0.5">Python, SQL</span> | React, Node.js | AWS</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-500" /><span className="text-red-400">Critical fix</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500" /><span className="text-amber-400">Quick win</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500" /><span className="text-green-400">Strength</span></div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Smart Editor — Fix Issues Inline</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                After scoring, open the Smart Editor to see your resume with colour-coded highlights. Click any highlight to see exactly what's wrong and get a suggested rewrite — no copy-pasting between tools.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  { color: 'bg-red-100 text-red-700 border-red-200', label: 'Red — Critical issues', desc: 'Missing keywords, weak verbs, absent sections that hurt your score most.' },
                  { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Amber — Quick wins', desc: 'Easy improvements: quantify a result, strengthen a verb, add a missing section.' },
                  { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Blue — Suggestions', desc: 'Optional enhancements that could push your score from good to excellent.' },
                  { color: 'bg-green-100 text-green-700 border-green-200', label: 'Green — Strengths', desc: 'Well-written sections and keywords — keep these exactly as they are.' },
                ].map(item => (
                  <li key={item.label} className="flex gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${item.color}`}>{item.label}</span>
                    <span className="text-slate-500">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── ATS Score Guide ───────────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">What Does Your ATS Score Mean?</h2>
          <p className="text-slate-500 text-sm text-center mb-8">Use this guide to understand where you stand and what to do next.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { range: '0–40', label: 'Needs Rewrite', color: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700', desc: 'Major sections missing. Significant keyword gaps. Use the Smart Editor to rebuild.' },
              { range: '41–60', label: 'Below Average', color: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-700', desc: 'Some sections present but weak. Add missing keywords and quantify achievements.' },
              { range: '61–80', label: 'Good', color: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-700', desc: 'Solid resume. Target quick wins — strengthen action verbs and add missing keywords.' },
              { range: '81–100', label: 'Excellent', color: 'border-green-200 bg-green-50', badge: 'bg-green-100 text-green-700', desc: 'ATS-ready. You are likely to pass automated screening. Focus on interview prep.' },
            ].map(tier => (
              <div key={tier.range} className={`rounded-2xl border p-5 ${tier.color}`}>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 ${tier.badge}`}>{tier.label}</div>
                <div className="text-2xl font-black text-slate-900 mb-1">{tier.range}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is a resume ATS score?', a: 'An ATS (Applicant Tracking System) score measures how well your resume matches a specific job description. It analyzes keyword presence, formatting, section structure, action verbs, and quantification. A score above 70 significantly improves your chances of passing automated screening and reaching a human recruiter.' },
              { q: 'How does the ATS checker score my resume?', a: 'MyTechZ scores your resume across 6 weighted dimensions: Keywords (35%), Sections (25%), Formatting (15%), Action Verbs (10%), Quantification (10%), and Readability (5%). Each gets a 0–100 score, and the weighted average is your overall ATS score.' },
              { q: 'Is it free? Are there any limits?', a: 'Yes, the ATS Resume Checker is 100% free. Create a free MyTechZ account to analyse as many resumes as you need, track improvement over time, and use the Smart Editor — all at no cost.' },
              { q: 'How do I improve my ATS resume score?', a: 'Add missing keywords for your target role, include all standard sections (Summary, Experience, Education, Skills), start bullets with action verbs, quantify achievements with numbers, and avoid tables/images. The Smart Editor highlights exactly where to make changes.' },
              { q: 'What file formats are supported?', a: 'PDF, DOCX, DOC, and TXT files up to 10 MB. We recommend PDF for the most accurate text extraction.' },
              { q: 'Is my resume data private?', a: 'Yes. Your resume is stored securely in your account and never shared externally. Analysis runs on MyTechZ\'s servers. You can delete any analysis at any time from your dashboard.' },
            ].map((item, i) => (
              <details key={i} className="group bg-white/70 rounded-xl border border-slate-200 px-6 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 pr-4 text-sm">{item.q}</span>
                  <svg className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Internal links ────────────────────────────────────────────── */}
        <section className="py-12 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">More Free AI Tools</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/ai-tools/resume-builder" className="group bg-blue-50 rounded-2xl border border-blue-100 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Free Resume Builder</h3>
              <p className="text-sm text-slate-500">Build an ATS-optimised resume from scratch. 6 free templates. Download as PDF or DOCX.</p>
            </Link>
            <Link href="/ai-tools/resume-builder/templates" className="group bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Free Resume Templates</h3>
              <p className="text-sm text-slate-500">6 ATS-friendly templates — Classic, Modern, Tech, Creative, Professional, and Minimal.</p>
            </Link>
            <Link href="/jobs" className="group bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-slate-500">After optimising your resume, find the right job — private sector, government, and internships.</p>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
