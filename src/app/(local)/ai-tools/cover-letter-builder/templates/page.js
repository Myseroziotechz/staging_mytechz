import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CoverLetterTemplateCard from '@/components/cover-letter-builder/CoverLetterTemplateCard'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Cover Letter Templates 2026 — Professional Designs | MyTechZ',
  description:
    'Choose from free, professional cover letter templates. Pair them with your resume and export a polished PDF in minutes.',
  keywords:
    'free cover letter templates, cover letter builder, professional cover letter, cover letter maker India',
  alternates: { canonical: `${SITE}/ai-tools/cover-letter-builder/templates` },
  openGraph: {
    title: 'Free Cover Letter Templates — Professional Designs',
    description: 'Choose a professional cover letter template and export a polished PDF in minutes.',
    url: `${SITE}/ai-tools/cover-letter-builder/templates`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Cover Letter Templates' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function CoverLetterTemplatesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: templates }, draftsResult] = await Promise.all([
    supabase
      .from('cover_letter_templates')
      .select('id, name, slug, description, category, preview_image_url, html_css_template')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    user
      ? supabase
          .from('user_cover_letters')
          .select('id, title, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(4)
      : Promise.resolve({ data: null }),
  ])

  const recentDrafts = draftsResult?.data || []

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Cover Letter Builder', item: `${SITE}/ai-tools/cover-letter-builder` },
      { '@type': 'ListItem', position: 4, name: 'Templates', item: `${SITE}/ai-tools/cover-letter-builder/templates` },
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
          <span className="text-slate-700">Templates</span>
        </nav>

        <section className="py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Free Cover Letter Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Pick a professional template and write a tailored cover letter in minutes. Free — no watermarks, no hidden fees.
          </p>
        </section>

        {recentDrafts.length > 0 && (
          <section className="pb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Continue a draft</h2>
              <Link href="/ai-tools/cover-letter-builder/my-letters" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recentDrafts.map((draft) => (
                <Link
                  key={draft.id}
                  href={`/ai-tools/cover-letter-builder/editor/${draft.id}`}
                  className="shrink-0 bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-3 min-w-[220px] transition-colors"
                >
                  <p className="text-sm font-semibold text-slate-900 truncate">{draft.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Edited {new Date(draft.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="pb-16">
          {templates?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <CoverLetterTemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">Templates are being set up. Check back shortly.</p>
              <Link href="/ai-tools/cover-letter-builder" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Cover Letter Builder
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
