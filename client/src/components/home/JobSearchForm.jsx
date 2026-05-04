'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const QUICK_LINKS = [
  {
    title: 'Remote Jobs',
    href: '/jobs/private?mode=remote',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zm0 0h18M12 3a14.5 14.5 0 010 18m0-18a14.5 14.5 0 000 18" />),
  },
  {
    title: 'Tech Startups',
    href: '/jobs/private?q=startup',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 12l-2 9 9-3 9 3-2-9M5 12l7-9 7 9M5 12h14" />),
  },
  {
    title: 'Top MNCs',
    href: '/jobs/private?q=MNC',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />),
  },
  {
    title: 'Internships',
    href: '/jobs/internship',
    icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12 12 0 01.665 6.479A11.95 11.95 0 0012 20.055a11.95 11.95 0 00-6.824-2.998 12 12 0 01.665-6.479L12 14z" />),
  },
]

export default function JobSearchForm() {
  const router = useRouter()
  const [keyword,  setKeyword]  = useState('')
  const [category, setCategory] = useState('private')

  const onSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    const qs = params.toString()
    router.push(`/jobs/${category}${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="max-w-4xl mx-auto job-glass-panel rounded-3xl shadow-2xl shadow-blue-900/10 p-6 md:p-8 transition-all duration-300 hover:shadow-blue-900/20">
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, company or skill"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="md:w-1/3 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 4h14M5 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
            </svg>
          </div>
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-12 pr-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all text-slate-800 font-medium appearance-none cursor-pointer"
          >
            <option value="private">Private</option>
            <option value="government">Government</option>
            <option value="internship">Internships</option>
            <option value="ai">AI Featured</option>
          </select>
        </div>

        <button type="submit"
          className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-700/20 transition-all active:scale-95 flex items-center justify-center gap-2">
          Search Jobs
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {/* Quick searches */}
      <div className="mt-7 pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick searches</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Link key={link.title} href={link.href}
                className="group inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
