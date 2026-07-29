'use client'

import { useState } from 'react'
import Link from 'next/link'

const HIGHLIGHTS = [
  {
    title: "India's Silicon Valley",
    desc: 'Bengaluru hosts the largest concentration of tech jobs in India — from Infosys and Wipro to Flipkart and thousands of funded startups.',
    tint: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m9-14h.01M12 11h.01M12 15h.01M8 11h.01M8 15h.01M16 11h.01M16 15h.01" />
      </svg>
    ),
  },
  {
    title: 'Verified employers only',
    desc: 'Recruiters pass email, domain and GST verification before they can post — so every listing here is a real, current opening.',
    tint: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Every tech corridor covered',
    desc: 'Koramangala and Indiranagar startups, Whitefield and Electronic City IT parks, Outer Ring Road MNCs — open any listing to see the exact area.',
    tint: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

const FAQS = [
  {
    q: 'Is "Bangalore" the same as "Bengaluru"?',
    a: 'Yes — Bengaluru is the official name of the city long known as Bangalore, and both are used interchangeably. Listings on MyTechZ use the city\'s official name, Bengaluru, but we show "Bangalore" here since that is what most candidates search for.',
  },
  {
    q: 'What is the average IT salary in Bangalore?',
    a: 'It varies widely by role, experience and company — from roughly ₹4–8 LPA for freshers to well above ₹25 LPA for senior engineering and product roles at top product companies. Each listing on MyTechZ shows its own salary range upfront wherever the employer discloses it.',
  },
  {
    q: 'Which companies are hiring in Bangalore right now?',
    a: 'Bangalore listings span IT services majors, product companies, BFSI, and high-growth startups. Use the category pages — Private Jobs, Government Jobs, and Internships — to filter by company, department and work mode once you open a listing.',
  },
  {
    q: 'Are remote roles at Bangalore-headquartered companies included?',
    a: 'This page focuses on roles based in or around Bengaluru. If a company headquartered here also offers remote positions open to any city, check the Private Jobs or Internships pages and filter by "Remote" work mode.',
  },
  {
    q: 'Is it free to apply to these jobs?',
    a: 'Yes. Searching, applying, saving jobs, and tracking your applications on MyTechZ is completely free for candidates. A legitimate employer will never ask you to pay to apply — report any listing that does.',
  },
]

function SectionHeader({ id, eyebrow, title, sub }) {
  return (
    <header className="text-center max-w-2xl mx-auto mb-10">
      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{eyebrow}</span>
      <h2 id={id} className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
      {sub && <p className="mt-3 text-base text-slate-600">{sub}</p>}
    </header>
  )
}

function HighlightsSection() {
  return (
    <section className="relative py-14 sm:py-20" aria-labelledby="bangalore-highlights">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="bangalore-highlights"
          eyebrow="Why Bangalore"
          title="India's biggest tech job market"
          sub="Here's what makes hiring in Bengaluru different from every other city."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(h => (
            <div key={h.title} className="job-glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${h.tint}`}>
                {h.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{h.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="relative py-14 sm:py-20 bg-gradient-to-b from-blue-50/50 via-white to-white" aria-labelledby="bangalore-faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="bangalore-faq"
          eyebrow="Bangalore jobs FAQ"
          title="Questions candidates ask us"
          sub="Salaries, locations, and everything else about working in Bengaluru — answered."
        />

        <div className="max-w-3xl mx-auto space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="job-glass-panel rounded-xl overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition">
                  <span className="text-sm sm:text-base font-semibold text-slate-900">{f.q}</span>
                  <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-4 sm:px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Still have a question?{' '}
          <Link href="/contact" className="font-semibold text-blue-700 hover:text-blue-800">Contact us</Link>
          {' '}— we usually reply within a day.
        </p>
      </div>
    </section>
  )
}

/**
 * Informational content rendered below the Bangalore job listings:
 * highlights and FAQ (with FAQPage JSON-LD).
 */
export default function BangaloreInfoSections() {
  return (
    <div className="bg-white border-t border-slate-100">
      <HighlightsSection />
      <FaqSection />
    </div>
  )
}
