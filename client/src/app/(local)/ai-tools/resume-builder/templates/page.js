import Link from 'next/link'
import TemplateGallery from '@/components/resume/TemplateGallery'
import { TEMPLATES } from '@/lib/resume/templates'

const SITE = 'https://mytechz.com'

const TITLE = 'Free Resume Templates — 6 ATS-Friendly Designs'
const RENDERED_TITLE = `${TITLE} | MyTechZ`

export const metadata = {
  title: TITLE,
  description:
    '6 free, ATS-friendly resume templates for Indian job seekers — Classic, Modern, Minimal, Creative, Tech, Professional. Download as PDF or DOCX, no cost.',
  keywords:
    'free resume templates, ATS friendly resume templates, free CV templates India, resume templates download, professional resume templates free, modern resume template free, resume templates 2024 India',
  alternates: { canonical: `${SITE}/ai-tools/resume-builder/templates` },
  openGraph: {
    title: 'Free Resume Templates — 6 ATS-Friendly Designs | MyTechZ',
    description: '6 free, ATS-optimised resume templates. Professional, Modern, Minimal, Creative, Tech, and Classic. Download PDF or DOCX instantly.',
    url: `${SITE}/ai-tools/resume-builder/templates`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'Free Resume Templates — MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
}

function JsonLd() {
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: RENDERED_TITLE,
    description: metadata.description,
    url: `${SITE}/ai-tools/resume-builder/templates`,
    breadcrumb: { '@id': `${SITE}/ai-tools/resume-builder/templates#breadcrumb` },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE}/ai-tools/resume-builder/templates#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Free Resume Builder', item: `${SITE}/ai-tools/resume-builder` },
      { '@type': 'ListItem', position: 4, name: 'Free Resume Templates', item: `${SITE}/ai-tools/resume-builder/templates` },
    ],
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Resume Templates by MyTechZ',
    description: 'ATS-friendly free resume templates for Indian professionals. Download as PDF or DOCX.',
    numberOfItems: TEMPLATES.length,
    itemListElement: TEMPLATES.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/ai-tools/resume-builder/templates/${t.slug}`,
      name: `Free ${t.name} Resume Template`,
      description: t.description,
    })),
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are MyTechZ resume templates free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, all MyTechZ resume templates are completely free. You can create, customize, and download your resume as PDF or DOCX at no cost. No credit card, no watermarks, no hidden fees.' },
      },
      {
        '@type': 'Question',
        name: 'Are these resume templates ATS-friendly?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, all templates are designed to be ATS (Applicant Tracking System) compatible. Text is selectable, sections use standard headings, and formatting is clean — ensuring your resume passes automated screening tools used by Indian companies.' },
      },
      {
        '@type': 'Question',
        name: 'Can I download my resume as PDF or Word document for free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. MyTechZ lets you export your resume in both PDF and DOCX (Microsoft Word) formats for free. Simply build your resume, choose your template, and click download — completely free.' },
      },
      {
        '@type': 'Question',
        name: 'Which resume template is best for freshers?',
        acceptedAnswer: { '@type': 'Answer', text: 'For freshers, the Classic or Modern template works best. They are clean, one-page formats that highlight education, projects, internships, and skills effectively. Our AI will help you write compelling content even without extensive work experience.' },
      },
      {
        '@type': 'Question',
        name: 'Which resume template is best for software engineers?',
        acceptedAnswer: { '@type': 'Answer', text: 'The Tech template is purpose-built for software engineers and developers — it emphasizes technical skills, GitHub projects, certifications, and tech stack prominently while remaining ATS-friendly.' },
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account to use the free resume builder?',
        acceptedAnswer: { '@type': 'Answer', text: 'You can browse all templates freely without an account. To build, save, and download your resume, you need a free MyTechZ account — it takes under 30 seconds to sign up with Google or email.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

export default function TemplatesPage() {
  return (
    <>
      <JsonLd />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
        {/* Animated blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
          <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl hero-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl hero-blob" style={{ animationDelay: '-10s' }} />
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
            <span aria-hidden="true">›</span>
            <Link href="/ai-tools/resume-builder" className="hover:text-blue-700">Free Resume Builder</Link>
            <span aria-hidden="true">›</span>
            <span className="text-slate-700">Templates</span>
          </nav>

          {/* Header */}
          <header className="text-center max-w-2xl mx-auto mb-12 hero-fade-up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">100% Free</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Free Resume Templates — Choose Your Perfect <span className="text-blue-600">Design</span>
            </h1>
            <p className="mt-3 text-base text-slate-600">
              All 6 templates are free, ATS-friendly, and professionally designed. Pick one and start building your resume in minutes — download as PDF or DOCX at no cost.
            </p>
          </header>

          {/* Gallery */}
          <div className="hero-fade-up" style={{ animationDelay: '0.2s' }}>
            <TemplateGallery />
          </div>

          {/* FAQ Section */}
          <section className="mt-20 max-w-3xl mx-auto hero-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions About Free Resume Templates</h2>
            <div className="space-y-4">
              {[
                { q: 'Are MyTechZ resume templates free?', a: 'Yes, all MyTechZ resume templates are completely free. You can create, customize, and download your resume as PDF or DOCX at no cost. No credit card, no watermarks, no hidden fees.' },
                { q: 'Are these resume templates ATS-friendly?', a: 'Yes, all templates are designed to pass through Applicant Tracking Systems. The text is structured, selectable, and properly formatted for automated parsing — used by most Indian companies.' },
                { q: 'Can I download my resume as PDF or Word for free?', a: 'Absolutely! Once your resume is ready, you can export it in both PDF and DOCX formats with a single click — completely free.' },
                { q: 'Which template is best for freshers in India?', a: 'The Classic or Modern template works best for freshers — clean one-page format highlighting education, projects, and skills. Our AI helps write compelling content even without extensive experience.' },
                { q: 'Which template is best for software engineers?', a: 'The Tech template is purpose-built for developers — it prominently displays technical skills, GitHub projects, and certifications while remaining ATS-compatible.' },
                { q: 'Do I need an account to use the builder?', a: 'You can browse templates freely. To build and download, you need a free MyTechZ account — sign up takes seconds with Google or email.' },
              ].map((item, i) => (
                <details key={i} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 px-6 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                    <svg className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-slate-600 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </section>
      </div>
    </>
  )
}
