'use client'

import { useState } from 'react'

const FAQS = [
  { q: 'Is MyTechz free for candidates?',
    a: 'Yes — searching, applying, and using the AI roadmap is free for candidates. Premium career coaching is optional and clearly marked.' },
  { q: 'How do you verify employers?',
    a: 'Every recruiter goes through email + domain + GST verification before they can post. Verified companies show a blue check on their cards.' },
  { q: 'What is "AI Featured"?',
    a: 'It ranks open jobs against your resume, skills and ambitions — not keywords. Sign in and upload a resume to see match scores on every card.' },
  { q: 'Are government job notifications official?',
    a: 'We mirror the official PDF / portal link on every government posting and show notification numbers, exam dates, age limits and fee structure.' },
  { q: 'Can I get a stipend-only internship?',
    a: 'Yes — visit /jobs/internship. Stipends are shown per month, with duration and PPO (pre-placement offer) flags where applicable.' },
  { q: 'Will recruiters see my profile if I just browse?',
    a: 'No. Your profile becomes visible to a recruiter only after you apply or explicitly opt in via "Open to opportunities" in settings.' },
]

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

export default function FaqAccordion() {
  const [open, setOpen] = useState(0)

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="relative py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">FAQ</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Common questions</h2>
          <p className="mt-3 text-base text-slate-600">Tap any question to expand.</p>
        </header>

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
      </div>
    </section>
  )
}
