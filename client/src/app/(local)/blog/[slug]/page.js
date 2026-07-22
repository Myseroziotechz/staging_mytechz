import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug, getAllSlugs } from '@/data/blog-posts'

const SITE = 'https://mytechz.com'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${SITE}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE}/blog/${post.slug}`,
      type: 'article',
      siteName: 'MyTechZ',
      publishedTime: post.date,
      authors: ['MyTechZ'],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

function JsonLd({ post }) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
    ],
  }

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'MyTechZ',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/Mytechz_logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    image: post.image,
  }

  const faqSchema = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  )
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3">{block.text}</h2>
    case 'paragraph':
      return <p className="text-slate-700 leading-relaxed mb-4">{block.text}</p>
    case 'list':
      return (
        <ul className="space-y-2 mb-4 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-slate-700">
              <span className="text-blue-500 shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3 mb-4 italic text-slate-700 rounded-r-lg">
          {block.text}
        </blockquote>
      )
    case 'tip':
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-4">
          <p className="text-slate-700 text-sm mb-3">{block.text}</p>
          <Link
            href={block.link}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            {block.linkText}
          </Link>
        </div>
      )
    default:
      return null
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Get related posts (exclude current)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <JsonLd post={post} />
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/blog" className="hover:text-blue-700">Blog</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700 line-clamp-1">{post.title}</span>
        </nav>

        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-slate-500">{post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>By MyTechZ Team</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose-slate">
            {post.content.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}
          </div>

          {/* FAQ Section */}
          {post.faq?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {post.faq.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-slate-900 font-medium hover:bg-slate-50 transition-colors">
                      <span className="pr-4">{item.question}</span>
                      <svg
                        className="w-5 h-5 shrink-0 text-slate-400 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Build Your Perfect Resume Now
            </h2>
            <p className="text-blue-100 text-sm mb-5">
              Free, ATS-optimized templates designed for Indian job seekers. No sign-up required.
            </p>
            <Link
              href="/ai-tools/resume-builder"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md"
            >
              Start Building — It&apos;s Free
            </Link>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group block bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-blue-600">{r.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{r.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
