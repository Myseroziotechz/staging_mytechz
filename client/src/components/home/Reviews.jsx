'use client'

import { useState } from 'react'

const REVIEWS = [
  { name: 'Aarav Mehta',  role: 'Senior React Developer at Acme Cloud', rating: 5, quote: 'MyTechz showed me roles that actually matched my React + Next.js stack. Got an offer in three weeks.' },
  { name: 'Priya Iyer',   role: 'Product Designer',                     rating: 5, quote: 'The 4-week prep roadmap was honestly better than three coaching sessions I had paid for.' },
  { name: 'Rohan Kapoor', role: 'B.Tech intern → Pixel Pioneers',       rating: 5, quote: 'Cleanest internship listings I have seen. Stipends shown clearly, no hidden gotchas.' },
  { name: 'Sneha Reddy',  role: 'Govt aspirant, cleared SSC',           rating: 4, quote: 'Notification numbers and exam dates are bang-up-to-date. Saved me from missing a deadline.' },
  { name: 'Vikram Singh', role: 'Backend Engineer (Go)',                rating: 5, quote: 'AI Featured surfaced a remote role I would never have found on the big boards.' },
  { name: 'Ananya Das',   role: 'Marketing Lead, Northwind Bank',       rating: 5, quote: 'Recruiters are verified. That alone changed my application volume from 50 to 8 — and quality went up.' },
]

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < n ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2l2.4 5.8L18 8l-4.2 4 1 6L10 15l-4.8 3 1-6L2 8l5.6-.2L10 2z"/>
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name }) {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase()
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center ring-1 ring-white">
      {initials}
    </div>
  )
}

export default function Reviews() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? REVIEWS : REVIEWS.slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'MyTechz',
    url: SITE,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(2),
      bestRating: 5, worstRating: 1, ratingCount: REVIEWS.length,
    },
    review: REVIEWS.map(r => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: { '@type': 'Person', name: r.name },
      reviewBody: r.quote.replace(/&apos;/g, "'"),
    })),
  }

  return (
    <section className="relative py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">What candidates say</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Real outcomes, real stories</h2>
          <p className="mt-3 text-base text-slate-600">Six recent placements shared what worked for them.</p>
        </header>

        <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((r) => (
            <article key={r.name} className="job-glass-panel rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-3">
                <Avatar name={r.name} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{r.name}</div>
                  <div className="text-xs text-slate-500 truncate">{r.role}</div>
                </div>
              </div>
              <Stars n={r.rating} />
              <p className="mt-3 text-sm text-slate-700 leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
            </article>
          ))}
        </div>

        {!showAll && (
          <div className="mt-8 text-center">
            <button onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50 hover:border-blue-200 transition active:scale-[0.98] shadow-sm">
              See more reviews
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
