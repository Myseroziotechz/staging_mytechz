import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ResumeTemplatePreview from '@/components/resume-builder/ResumeTemplatePreview'
import { SAMPLE_COVER_LETTER_DATA } from '@/lib/cover-letter/sample-data'
import UseTemplateButton from '@/components/cover-letter-builder/UseTemplateButton'

const SITE = 'https://mytechz.com'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: template } = await supabase
    .from('cover_letter_templates')
    .select('name, description, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!template) return { title: 'Template Not Found' }

  return {
    title: `${template.name} Cover Letter Template — Free | MyTechZ`,
    description: template.description,
    alternates: { canonical: `${SITE}/ai-tools/cover-letter-builder/templates/${template.slug}` },
    openGraph: {
      title: `${template.name} Cover Letter Template — Free`,
      description: template.description,
      url: `${SITE}/ai-tools/cover-letter-builder/templates/${template.slug}`,
      type: 'website',
      siteName: 'MyTechZ',
    },
  }
}

export default async function CoverLetterTemplateDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: template } = await supabase
    .from('cover_letter_templates')
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
      { '@type': 'ListItem', position: 3, name: 'Cover Letter Builder', item: `${SITE}/ai-tools/cover-letter-builder` },
      { '@type': 'ListItem', position: 4, name: 'Templates', item: `${SITE}/ai-tools/cover-letter-builder/templates` },
      { '@type': 'ListItem', position: 5, name: template.name, item: `${SITE}/ai-tools/cover-letter-builder/templates/${template.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-8 pb-4 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools/cover-letter-builder" className="hover:text-blue-700">Cover Letter Builder</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools/cover-letter-builder/templates" className="hover:text-blue-700">Templates</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">{template.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 py-8 pb-16">
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden aspect-210/297 max-h-[85vh] mx-auto">
              <ResumeTemplatePreview htmlTemplate={template.html_css_template} data={SAMPLE_COVER_LETTER_DATA} />
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{template.name} Template</h1>
            <p className="text-slate-600 mb-6">{template.description}</p>

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</h3>
              <span className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                {template.category}
              </span>
            </div>

            <UseTemplateButton templateId={template.id} templateName={template.name} />

            <Link
              href="/ai-tools/cover-letter-builder/templates"
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
