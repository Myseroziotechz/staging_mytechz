'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: 'Stipends shown upfront',
    desc: 'Every internship card shows the monthly stipend — no "unpaid, but great exposure" surprises. Filter by minimum stipend to match your needs.',
    tint: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
  {
    title: 'PPO chance flags',
    desc: 'See the pre-placement offer (PPO) likelihood on eligible internships — so you can prioritise roles that can convert into a full-time job.',
    tint: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
  {
    title: 'Duration badges',
    desc: 'Duration in months is flagged on every card, so you can plan internships around your semester, summer break, or notice period.',
    tint: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    title: 'Verified employers only',
    desc: 'Recruiters pass email, domain, and GST verification before they can post — so you never waste an application on a fake listing.',
    tint: 'bg-violet-50 text-violet-700 border-violet-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
  },
  {
    title: 'Remote, hybrid & onsite',
    desc: 'One-tap work-mode filters let you find remote internships you can do from your hostel, or onsite roles in your city.',
    tint: 'bg-sky-50 text-sky-700 border-sky-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
  {
    title: 'Free for students',
    desc: 'Searching, applying, and tracking applications is 100% free. Use the free AI resume tools to sharpen your profile before you apply.',
    tint: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7"/>
      </svg>
    ),
  },
]

const STEPS = [
  {
    title: 'Create your free account',
    desc: 'Sign up as a candidate in under a minute — all you need is an email. Your profile stays private until you apply.',
    link: { href: '/login/user', label: 'Sign up free' },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
      </svg>
    ),
  },
  {
    title: 'Polish your resume',
    desc: 'No experience yet? Lead with skills, projects, and coursework. Our free AI resume builder and analyzer help you get interview-ready.',
    link: { href: '/ai-tools/resume-builder', label: 'Try the resume builder' },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    title: 'Search & shortlist',
    desc: 'Filter by role, skill, location, work mode, and minimum stipend. Sort by newest, highest stipend, or closing soonest — and save the ones you like.',
    link: null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    ),
  },
  {
    title: 'Apply & track',
    desc: 'Apply in a few clicks, then follow every application’s status from your dashboard. Check each role’s preparation page before interviews.',
    link: { href: '/my-applications', label: 'View my applications' },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    ),
  },
]

const FAQS = [
  {
    q: 'Are the internships on MyTechz paid?',
    a: 'Most internships listed here include a monthly stipend, and it is always shown on the card — nothing is hidden behind "apply to find out". Typical stipends in India range from ₹5,000 to ₹50,000+ per month depending on the role, company, and city. Use the "Min stipend" filter to only see internships that pay at least what you need.',
  },
  {
    q: 'Who can apply — is it only for college students?',
    a: 'Internships on MyTechz are open to college students, recent graduates, and freshers. Each posting lists its own eligibility (year of study, degree, or skills required), so read the listing details before applying. There is no platform-level restriction on who can apply.',
  },
  {
    q: 'What does the "PPO chance" badge mean?',
    a: 'PPO stands for pre-placement offer — a full-time job offer given to interns who perform well. When a company shares how likely an internship is to convert into a full-time role, we show it as a percentage badge on the card, so you can prioritise internships that can turn into your first job.',
  },
  {
    q: 'How long do internships usually last?',
    a: 'Most internships run 2 to 6 months. The duration is shown as a badge on every card that provides it, so you can pick something that fits a summer break, a semester, or a longer off-campus stint. Longer internships often come with higher PPO chances.',
  },
  {
    q: 'Can I do an internship remotely?',
    a: 'Yes — use the work-mode filter to switch between remote, hybrid, and onsite internships. Remote internships let you work from anywhere in India, which is ideal if you are still attending classes or live outside the big metro cities.',
  },
  {
    q: 'I have no prior experience. Can I still get selected?',
    a: 'Absolutely — internships are designed for people starting out. Companies look at your skills, projects, and enthusiasm rather than work history. Put your best projects, coursework, and skills on your resume; the free AI resume analyzer can tell you exactly what to improve before you apply.',
  },
  {
    q: 'Does it cost anything to apply?',
    a: 'No. Searching, applying, saving internships, and tracking your applications on MyTechz is completely free for candidates. A legitimate employer will never ask you to pay to intern — if a listing ever asks for money, report it to us immediately.',
  },
  {
    q: 'How do I improve my chances of getting selected?',
    a: 'Three things work best: apply early (use the "Closing soonest" sort so you never miss a deadline), tailor your resume to the skills in the listing, and apply to several matching internships rather than pinning hopes on one. Before interviews, review the preparation page on the job detail for that role.',
  },
]

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function SectionHeader({ id, eyebrow, title, sub }) {
  return (
    <header className="text-center max-w-2xl mx-auto mb-10">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{eyebrow}</span>
      <h2 id={id} className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
      {sub && <p className="mt-3 text-base text-slate-600">{sub}</p>}
    </header>
  )
}

function FeaturesSection() {
  return (
    <section className="relative py-14 sm:py-20" aria-labelledby="internship-features">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="internship-features"
          eyebrow="Why MyTechz"
          title="Internships without the guesswork"
          sub="Everything you need to judge an internship is on the card — before you spend a single application on it."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="job-glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${f.tint}`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowToApplySection() {
  return (
    <section className="relative py-14 sm:py-20 bg-linear-to-b from-amber-50/50 via-white to-white" aria-labelledby="how-to-apply">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="how-to-apply"
          eyebrow="How it works"
          title="How to apply, step by step"
          sub="From zero to your first application in about ten minutes."
        />

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              {i < STEPS.length - 1 && (
                <>
                  {/* Connector to next step: horizontal on desktop, vertical on mobile */}
                  <div className="hidden lg:block absolute top-7 left-16 right-[-8px] h-px bg-linear-to-r from-amber-300 to-amber-200" aria-hidden="true" />
                  <div className="sm:hidden absolute left-7 top-16 bottom-[-14px] w-px bg-amber-200" aria-hidden="true" />
                </>
              )}
              <div className="relative flex sm:block gap-4">
                <div className="relative z-10 shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center sm:mb-4">
                  {s.icon}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-amber-200 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  {s.link && (
                    <Link href={s.link.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800">
                      {s.link.label}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mt-12 job-glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-amber-900/5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ready to land your first internship?</h3>
            <p className="mt-1 text-sm text-slate-600">Create a free account and start applying to verified, paid internships today.</p>
          </div>
          <Link href="/login/user" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition active:scale-[0.98]">
            Get started free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </Link>
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
    <section className="relative py-14 sm:py-20" aria-labelledby="internship-faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="internship-faq"
          eyebrow="Internship FAQ"
          title="Questions students ask us"
          sub="Stipends, eligibility, PPOs, and everything else — answered."
        />

        <div className="max-w-3xl mx-auto space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="job-glass-panel rounded-xl overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-amber-50/40 transition">
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
          <Link href="/contact" className="font-semibold text-amber-700 hover:text-amber-800">Contact us</Link>
          {' '}— we usually reply within a day.
        </p>
      </div>
    </section>
  )
}

/**
 * Informational content rendered below the internship listings:
 * features, how-to-apply steps, and FAQ (with FAQPage JSON-LD).
 */
export default function InternshipInfoSections() {
  return (
    <div className="bg-white border-t border-slate-100">
      <FeaturesSection />
      <HowToApplySection />
      <FaqSection />
    </div>
  )
}
