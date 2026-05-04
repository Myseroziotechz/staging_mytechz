'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HomeSection, { SectionHeader } from './HomeSection'

// Icons rendered as components so the size + color always render predictably.
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />
    <path d="M19 16l1 2.4 2.4 1-2.4 1L19 23l-1-2.6-2.4-1.4 2.4-1L19 16z" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const STEPS = [
  { id: 1, title: 'Search',  blurb: 'Find verified roles across private, government and internships — or let AI rank them against your resume.', cta: { label: 'Browse jobs',     href: '/jobs' },  Icon: SearchIcon,  accent: 'from-blue-500 to-indigo-500' },
  { id: 2, title: 'Prepare', blurb: 'Tap "Prepare for this role" — get a 4-week study plan, mock-interview questions and resume tips per job.', cta: { label: 'Try the roadmap', href: '/jobs' },  Icon: SparkleIcon, accent: 'from-amber-500 to-orange-500' },
  { id: 3, title: 'Apply',   blurb: 'One-tap apply to internal roles or jump to the official portal for government posts. We track everything.', cta: { label: 'Sign in to apply', href: '/login' }, Icon: CheckIcon,   accent: 'from-emerald-500 to-teal-500' },
]

export default function HowItWorks() {
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
    <HomeSection tone="light">
      <div ref={ref}>
        <SectionHeader eyebrow="How it works" title="Three steps to your next role" subtitle="No noise, no spam. Just verified jobs and a personal prep coach." />

        <div className="relative">
          {/* Connector line — desktop only */}
          <div aria-hidden className="hidden md:block absolute top-9 left-[16%] right-[16%] h-0.5 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 origin-left transition-transform duration-[1400ms] ease-out ${visible ? 'scale-x-100' : 'scale-x-0'}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {STEPS.map((s, i) => {
              const Icon = s.Icon
              return (
                <article key={s.id}
                  className={`job-glass-panel rounded-2xl p-6 text-center md:text-left transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <div className={`mx-auto md:mx-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center shadow-lg shadow-blue-900/20 ring-4 ring-white/70`}>
                    <Icon />
                  </div>
                  <div className="mt-4 flex items-center md:items-start gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white text-[11px] font-bold">{s.id}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Step {s.id}</span>
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.blurb}</p>
                  <Link href={s.cta.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">
                    {s.cta.label} →
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </HomeSection>
  )
}
