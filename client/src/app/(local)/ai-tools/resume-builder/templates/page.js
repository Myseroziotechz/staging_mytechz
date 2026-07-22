import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TemplateCard from '@/components/resume-builder/TemplateCard'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Resume Templates 2026 — 5+ ATS-Optimised Designs, No Watermarks | MyTechZ',
  description:
    'Choose from 5+ free, ATS-optimised resume templates. Professional designs for tech, government, and creative roles. No watermarks, no hidden fees.',
  keywords:
    'free resume templates, ATS resume templates, professional resume templates India, best resume format, CV templates free download',
  alternates: { canonical: `${SITE}/ai-tools/resume-builder/templates` },
  openGraph: {
    title: 'Free Resume Templates — ATS-Optimised Designs',
    description: 'Choose from professional resume templates. Free, ATS-optimised, and designed for Indian job seekers.',
    url: `${SITE}/ai-tools/resume-builder/templates`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Resume Templates' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase
    .from('resume_templates')
    .select('id, name, slug, description, category, preview_image_url, html_css_template')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Builder', item: `${SITE}/ai-tools/resume-builder` },
      { '@type': 'ListItem', position: 4, name: 'Templates', item: `${SITE}/ai-tools/resume-builder/templates` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-8 pb-4 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools/resume-builder" className="hover:text-blue-700">Resume Builder</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Templates</span>
        </nav>

        {/* Header */}
        <section className="py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Free Resume Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Pick a professional, ATS-optimised template and start building your resume in minutes. All templates are free — no watermarks, no hidden fees.
          </p>
        </section>

        {/* Templates Grid */}
        <section className="pb-16">
          {templates?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">Templates are being set up. Check back shortly.</p>
              <Link href="/ai-tools/resume-builder" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Resume Builder
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
