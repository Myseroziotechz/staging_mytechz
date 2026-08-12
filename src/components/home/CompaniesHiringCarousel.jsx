'use client'

import { useRef } from 'react'
import Link from 'next/link'

const ChevronIcon = ({ className, flip }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} style={flip ? { transform: 'rotate(180deg)' } : undefined} aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+`
  return `${n}`
}

function PanelCard({ panel }) {
  const extra = panel.companiesTotal - panel.companies.length

  return (
    <Link
      href={`/jobs/private?q=${encodeURIComponent(panel.industry)}`}
      className="group shrink-0 snap-start w-48 sm:w-52 bg-white border border-slate-100 rounded-xl px-4 py-4 hover:border-blue-200 transition-colors duration-200"
    >
      <div className="flex items-center gap-1">
        <h4 className="text-sm font-bold text-slate-900 truncate">{panel.industry}</h4>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
      <p className="mt-1 text-xs text-blue-700 font-semibold">{formatCount(panel.count)} are actively hiring</p>

      <div className="mt-3 flex items-center gap-1.5">
        {panel.companies.map((company) => (
          <div
            key={company.name}
            title={company.name}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shrink-0 ring-2 ring-white"
            style={{ backgroundColor: company.color }}
          >
            {company.initials}
          </div>
        ))}
        {extra > 0 && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] text-slate-600 bg-slate-100 shrink-0 ring-2 ring-white">
            +{extra}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function CompaniesHiringCarousel({ panels }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div>
      <div className="hidden sm:flex justify-end gap-2 mb-3">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-300 transition-colors duration-200"
        >
          <ChevronIcon className="w-4 h-4" flip />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-300 transition-colors duration-200"
        >
          <ChevronIcon className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2"
      >
        {panels.map((panel) => (
          <PanelCard key={panel.industry} panel={panel} />
        ))}
      </div>
    </div>
  )
}
