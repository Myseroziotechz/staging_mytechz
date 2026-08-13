'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HomeSection, { SectionHeader } from './HomeSection'

// Icons rendered as components so the size + color always render predictably.
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SparkleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />
    <path d="M19 16l1 2.4 2.4 1-2.4 1L19 23l-1-2.6-2.4-1.4 2.4-1L19 16z" />
  </svg>
)

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const STEPS = [
  { id: 1, title: 'Search',  blurb: 'Find verified roles across private, government and internships — or let AI rank them against your resume.', cta: { label: 'Browse jobs',     href: '/jobs' },  Icon: SearchIcon,  accent: 'text-blue-600',   underline: 'bg-blue-600' },
  { id: 2, title: 'Prepare', blurb: 'Tap "Prepare for this role" — get a 4-week study plan, mock-interview questions and resume tips per job.', cta: { label: 'Try the roadmap', href: '/jobs' },  Icon: SparkleIcon, accent: 'text-violet-600', underline: 'bg-violet-600' },
  { id: 3, title: 'Apply',   blurb: 'One-tap apply to internal roles or jump to the official portal for government posts. We track everything.', cta: { label: 'Sign in to apply', href: '/login' }, Icon: CheckIcon,   accent: 'text-emerald-600', underline: 'bg-emerald-600' },
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((s, i) => {
            const Icon = s.Icon
            return (
              <div key={s.id}
                className={`text-center md:text-left transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Icon className={`w-6 h-6 ${s.accent}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Step {s.id}</span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{s.title}</h3>
                <span aria-hidden className={`mt-2 block w-10 h-1 rounded-full mx-auto md:mx-0 ${s.underline}`} />
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.blurb}</p>
                <Link href={s.cta.href} className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 ${s.accent}`}>
                  {s.cta.label} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </HomeSection>
  )
}
