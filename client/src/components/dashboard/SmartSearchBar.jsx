'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Static suggestion map — matched by keywords in the query
const SUGGESTIONS = [
  // Jobs
  { label: 'Browse All Jobs',        href: '/jobs',                       category: 'Jobs',      keywords: ['job', 'browse', 'all'] },
  { label: 'Private Jobs',           href: '/jobs/private',               category: 'Jobs',      keywords: ['private', 'company', 'mnc', 'startup'] },
  { label: 'Government Jobs',        href: '/jobs/government',            category: 'Jobs',      keywords: ['government', 'govt', 'psu', 'sarkari', 'public'] },
  { label: 'Internships',            href: '/jobs/internship',            category: 'Jobs',      keywords: ['intern', 'internship', 'fresher', 'student'] },
  { label: 'AI-Matched Jobs',        href: '/jobs/ai',                    category: 'Jobs',      keywords: ['ai', 'matched', 'recommend', 'smart'] },
  { label: 'My Applications',        href: '/my-applications',            category: 'Jobs',      keywords: ['application', 'applied', 'status', 'track'] },
  { label: 'Saved Jobs',             href: '/saved-jobs',                 category: 'Jobs',      keywords: ['saved', 'bookmark', 'wishlist'] },
  // Tools
  { label: 'Resume Builder',         href: '/ai-tools/resume-builder',    category: 'Job Tools', keywords: ['resume', 'cv', 'builder', 'build'] },
  { label: 'Resume Rank Checker',    href: '/ai-tools/resume-rank-checker', category: 'Job Tools', keywords: ['rank', 'ats', 'score', 'checker', 'analyze'] },
  { label: 'Smart Job Search',       href: '/ai-tools/smart-job-search',  category: 'Job Tools', keywords: ['smart', 'search', 'match', 'ai job'] },
  // Account
  { label: 'My Profile',             href: '/profile',                    category: 'Account',   keywords: ['profile', 'me', 'account', 'details'] },
  { label: 'Settings',               href: '/settings',                   category: 'Account',   keywords: ['setting', 'preference', 'password'] },
  { label: 'Contact Us',             href: '/contact',                    category: 'Pages',     keywords: ['contact', 'help', 'support', 'reach'] },
]

function getMatches(query) {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  return SUGGESTIONS.filter((s) =>
    s.keywords.some((k) => k.includes(q) || q.includes(k)) ||
    s.label.toLowerCase().includes(q)
  ).slice(0, 6)
}

export default function SmartSearchBar({ placeholder = 'Search for jobs, tools, pages...' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const router = useRouter()

  const matches = getMatches(query)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navigate = (href) => {
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
    router.push(href)
  }

  const handleKeyDown = (e) => {
    if (!open || matches.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      navigate(matches[activeIdx].href)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIdx(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Suggestions dropdown */}
      {open && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-30">
          {matches.map((item, idx) => (
            <button
              key={item.href}
              type="button"
              onMouseDown={() => navigate(item.href)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                idx === activeIdx ? 'bg-blue-50' : 'hover:bg-gray-50'
              } ${idx !== matches.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-900">{item.label}</span>
              </span>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
