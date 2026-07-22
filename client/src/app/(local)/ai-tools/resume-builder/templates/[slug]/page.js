import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TemplateDetailPreview from '@/components/resume-builder/TemplateDetailPreview'

const SITE = 'https://mytechz.com'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: template } = await supabase
    .from('resume_templates')
    .select('name, description, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!template) return { title: 'Template Not Found' }

  return {
    title: `${template.name} Resume Template — Free ATS-Friendly | MyTechZ`,
    description: template.description,
    alternates: { canonical: `${SITE}/ai-tools/resume-builder/templates/${template.slug}` },
    openGraph: {
      title: `${template.name} Resume Template — Free`,
      description: template.description,
      url: `${SITE}/ai-tools/resume-builder/templates/${template.slug}`,
      type: 'website',
      siteName: 'MyTechZ',
    },
  }
}

export default async function TemplateDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: template } = await supabase
    .from('resume_templates')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!template) notFound()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Builder', item: `${SITE}/ai-tools/resume-builder` },
      { '@type': 'ListItem', position: 4, name: 'Templates', item: `${SITE}/ai-tools/resume-builder/templates` },
      { '@type': 'ListItem', position: 5, name: template.name, item: `${SITE}/ai-tools/resume-builder/templates/${template.slug}` },
    ],
  }

  const requiredFields = template.required_fields || []
  const defaultSections = template.default_sections || []

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
          <Link href="/ai-tools/resume-builder/templates" className="hover:text-blue-700">Templates</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">{template.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 py-8 pb-16">
          {/* Preview — client component with proper rendering */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <TemplateDetailPreview htmlTemplate={template.html_css_template} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{template.name} Template</h1>
            <p className="text-slate-600 mb-6">{template.description}</p>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</h3>
                <span className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                  {template.category}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sections Included</h3>
                <div className="flex flex-wrap gap-2">
                  {defaultSections.map((s) => (
                    <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full capitalize">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {requiredFields.map((f) => (
                    <span key={f} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full capitalize">{f}</span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/ai-tools/resume-builder/create?template=${template.id}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
            >
              Use This Template
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/ai-tools/resume-builder/templates"
              className="w-full inline-flex items-center justify-center gap-2 text-slate-600 font-medium px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 mt-3 transition-all"
            >
              Browse All Templates
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
