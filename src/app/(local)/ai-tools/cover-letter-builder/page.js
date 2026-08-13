import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Cover Letter Builder 2026 — Professional, AI-Assisted (No Sign-Up to Browse)',
  description:
    'Write a tailored, professional cover letter in minutes with MyTechZ. Choose from free templates, prefill from your profile, and export a polished PDF — no watermarks.',
  keywords:
    'free cover letter builder, cover letter maker, cover letter templates India, AI cover letter, cover letter generator',
  alternates: { canonical: `${SITE}/ai-tools/cover-letter-builder` },
  openGraph: {
    title: 'Free Cover Letter Builder — Professional, AI-Assisted',
    description: 'Write a tailored cover letter in minutes. Free templates, AI drafting, PDF export — no watermarks.',
    url: `${SITE}/ai-tools/cover-letter-builder`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free Cover Letter Builder' }],
  },
  twitter: { card: 'summary_large_image' },
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI-Assisted Drafting',
    description: 'Paste a job description and let AI draft a tailored opening, body, and closing — then edit every word yourself.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Professional Templates',
    description: 'Pick from designs that match your resume\'s style, live-previewed at true A4 size before you commit.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Prefilled From Your Profile',
    description: 'Your name, contact details, and headline are pulled from your MyTechZ profile automatically — edit freely without changing your profile.',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Cover Letter Builder', item: `${SITE}/ai-tools/cover-letter-builder` },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
}

export default function CoverLetterBuilderLandingPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-white">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Write a Cover Letter That Gets Read
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Pick a professional template, let AI help with a first draft, and export a polished PDF — free, and prefilled from your MyTechZ profile.
          </p>
          <Link
            href="/ai-tools/cover-letter-builder/templates"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
          >
            Browse Templates
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
