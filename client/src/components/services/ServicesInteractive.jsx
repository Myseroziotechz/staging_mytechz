'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ============================================================
// Stats counters — count-up on scroll into view
// ============================================================
const STATS = [
  { value: 50000, suffix: '+', label: 'Verified Jobs' },
  { value: 500, suffix: '+', label: 'Hiring Partners' },
  { value: 12000, suffix: '+', label: 'Candidates Placed' },
  { value: 87, suffix: '%', label: 'Match Accuracy' },
]

function useCountUp(target, visible, duration = 1400) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, visible, duration])
  return n
}

function Counter({ target, suffix }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.5 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const n = useCountUp(target, visible)
  return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>
}

export function StatsCounters() {
  return (
    <div className="job-glass-panel rounded-2xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-md shadow-blue-900/5">
      {STATS.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-3xl sm:text-4xl font-bold hero-gradient-text">
            <Counter target={s.value} suffix={s.suffix} />
          </p>
          <p className="mt-1 text-sm text-slate-500 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Audience tabs — Job Seekers vs Recruiters
// ============================================================
const AUDIENCES = {
  seekers: {
    label: 'Job Seekers',
    eyebrow: 'For candidates',
    title: 'Everything you need, free forever',
    description:
      'Verified listings, AI-powered matching, and free career tools — built to move you from application to offer faster.',
    benefits: [
      'Daily verified private + government jobs',
      'AI job matching ranked by real fit, not keywords',
      'Free AI resume builder and ATS rank checker',
      'Real-time application tracking and reminders',
    ],
    cta: { label: 'Get Started Free', href: '/login' },
    mockTitle: 'Your top matches this week',
    mockItems: [
      { name: 'Senior React Developer', company: 'Acme Cloud', match: 94 },
      { name: 'Backend Engineer (Go)', company: 'Northwind', match: 88 },
      { name: 'Product Designer', company: 'Pixel Pioneers', match: 82 },
    ],
  },
  recruiters: {
    label: 'Recruiters',
    eyebrow: 'For hiring partners',
    title: 'Hire verified candidates, faster',
    description:
      'Post a role in minutes and reach pre-screened tech talent — with AI-ranked applicants so your inbox stays signal-rich.',
    benefits: [
      'Targeted reach across India’s verified tech talent',
      'AI-ranked applicant shortlist for every job',
      'Employer dashboard with hiring analytics',
      'Dedicated support and fast onboarding',
    ],
    cta: { label: 'Post a Job', href: '/recruiter' },
    mockTitle: 'Today’s shortlist',
    mockItems: [
      { name: 'Aarav Mehta', company: 'Senior React Developer', match: 94 },
      { name: 'Priya Iyer', company: 'Product Designer', match: 88 },
      { name: 'Rohan Kapoor', company: 'Backend Engineer', match: 82 },
    ],
  },
}

export function AudienceTabs() {
  const [tab, setTab] = useState('seekers')
  const a = AUDIENCES[tab]

  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1">
          {Object.entries(AUDIENCES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-7 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                tab === key
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div key={`${tab}-text`} className="hero-fade-up">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{a.eyebrow}</span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{a.title}</h3>
          <p className="mt-3 text-base text-slate-600 max-w-lg">{a.description}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
            {a.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href={a.cta.href}
            className="mt-7 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5"
          >
            {a.cta.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </Link>
        </div>

        <div key={`${tab}-mock`} className="hero-fade-up-d1 relative">
          <div className="job-glass-panel rounded-3xl p-6 shadow-2xl shadow-blue-900/15">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{a.mockTitle}</div>
            <ul className="mt-3 space-y-2.5">
              {a.mockItems.map((item) => (
                <li key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 truncate">{item.company}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                    {item.match}% match
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[11px] text-slate-400 text-center">Sample data for illustration.</div>
          </div>
          <div aria-hidden className="absolute -top-3 -right-3 w-20 h-20 bg-amber-300/30 rounded-full blur-2xl" />
          <div aria-hidden className="absolute -bottom-3 -left-3 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// How it works — animated horizontal stepper
// ============================================================
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />
  </svg>
)
const DocIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
)
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const STEPS = [
  { id: 1, title: 'Discover', blurb: 'Create your free profile and browse verified private, government, and internship listings.', Icon: SearchIcon },
  { id: 2, title: 'Get matched', blurb: 'Our AI scans new listings daily and ranks roles by genuine fit with your skills and goals.', Icon: SparkleIcon },
  { id: 3, title: 'Prepare', blurb: 'Sharpen your application with the free Resume Builder and Rank Checker before you apply.', Icon: DocIcon },
  { id: 4, title: 'Apply & track', blurb: 'Apply with confidence, track every application, and tap into mentor support to close the offer.', Icon: CheckIcon },
]

export function HowItWorksStepper() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.25 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="hidden md:block absolute top-9 left-[12%] right-[12%] h-0.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-blue-600 to-indigo-600 origin-left transition-transform duration-[1400ms] ease-out ${visible ? 'scale-x-100' : 'scale-x-0'}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
        {STEPS.map((s, i) => {
          const Icon = s.Icon
          return (
            <article
              key={s.id}
              className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-900/20 ring-4 ring-white">
                <Icon />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white text-[11px] font-bold">{s.id}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Step {s.id}</span>
              </div>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.blurb}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// FAQ accordion
// ============================================================
const FAQS = [
  { q: 'Is MyTechZ free for job seekers?', a: 'Yes — MyTechZ is 100% free for candidates. Browse jobs, build resumes, and apply without any subscription or hidden fees.' },
  { q: 'What types of jobs are available?', a: 'Verified private-sector tech jobs, central and state government vacancies, paid internships for students and freshers, and AI-matched recommendations.' },
  { q: 'How does AI job matching work?', a: 'Our AI reads your resume, skills, and preferences to calculate a fit score for every job — ranked by real compatibility, not keyword overlap.' },
  { q: 'Are the jobs verified?', a: 'Every listing is vetted by our team. We partner directly with companies and government portals to keep listings legitimate and current.' },
  { q: 'Can I build a resume for free?', a: 'Yes. The free AI Resume Builder creates ATS-optimised resumes with AI-powered bullet points and clean PDF export — no watermarks, no paid tier.' },
  { q: 'How do I reach hiring partners as a recruiter?', a: 'Sign up as a recruiter, complete quick verification, and post roles that reach pre-screened, AI-ranked candidates within minutes.' },
]

const SITE = 'https://mytechz.com'

export function ServicesFaqAccordion() {
  const [open, setOpen] = useState(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="max-w-3xl mx-auto space-y-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className="job-glass-panel rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition"
            >
              <span className="text-sm sm:text-base font-semibold text-slate-900">{f.q}</span>
              <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
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
  )
}
