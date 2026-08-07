'use client'

import { useEffect, useRef, useState } from 'react'
import HomeSection, { SectionHeader } from './HomeSection'

const PILLARS = [
  {
    title: 'Verified employers only',
    blurb: 'Every recruiter is vetted before a single posting goes live. No bait roles, no ghost listings.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4m5.6 4.5a9 9 0 11-15.2 0 9 9 0 0115.2 0z"/>,
  },
  {
    title: 'AI-powered matching',
    blurb: 'Your resume meets every JD. We surface the roles that fit you, ranked by genuine signal — not keyword tricks.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/>,
  },
  {
    title: 'No noise — only fit',
    blurb: 'We would rather show you 10 great matches than 1,000 irrelevant ones. Quality over volume, every time.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 13l4 4L19 7"/>,
  },
]

const STATS = [
  { value: 12000, suffix: '+', label: 'Verified roles' },
  { value: 500,   suffix: '+', label: 'Vetted employers' },
  { value: 87,    suffix: '%', label: 'Match accuracy' },
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

export default function Philosophy() {
  return (
    <HomeSection tone="light">
      <SectionHeader
        eyebrow="Our philosophy"
        title={<>A job should find <em className="not-italic text-blue-700">you</em>.</>}
        subtitle="Not the other way around. We built MyTechz to put genuine fit ahead of volume."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {PILLARS.map((p) => (
          <article key={p.title} className="job-glass-panel rounded-2xl p-6 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{p.icon}</svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.blurb}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center max-w-3xl mx-auto rounded-2xl job-glass-panel py-8 px-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900">
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </HomeSection>
  )
}
