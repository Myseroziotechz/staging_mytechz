'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { JOB_EXPERIENCE_LEVELS } from '@/config/jobs'

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [expOpen, setExpOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (experience) params.set('experience', experience)
    if (location) params.set('location', location)
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const selectedExp = JOB_EXPERIENCE_LEVELS.find((l) => l.value === experience)

  const leftTools = [
    {
      title: 'Build Your Resume',
      href: '/ai-tools/resume-builder',
      float: 'hero-float-a',
      icon: (
        <svg className="w-4.5 h-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      title: 'Check ATS Score',
      href: '/ai-tools/resume-analyzer',
      float: 'hero-float-b',
      icon: (
        <svg className="w-4.5 h-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ]

  const rightTools = [
    {
      title: 'Find Matching Jobs',
      href: '/ai-tools/smart-job-search',
      float: 'hero-float-c',
      icon: (
        <svg className="w-4.5 h-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      title: 'Ace Your Interview',
      href: '/ai-tools/interview-prep',
      float: 'hero-float-a',
      icon: (
        <svg className="w-4.5 h-4.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-1.5a3.75 3.75 0 013.75-3.75h0a3.75 3.75 0 013.75 3.75V21M12 12a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM19.5 8.25v1.5m0 0l1.5-1.5m-1.5 1.5l-1.5-1.5" />
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-[#FDF6EC] -mt-20 min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-0 flex flex-col items-center text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
          Find Your Dream Career with <span className="text-blue-600">AI</span>
        </h1>

        {/* Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-600">
          <span className="text-amber-400">★</span>
          <span>India's #1 Career Development Platform</span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-stretch"
        >
          {/* Skills / Role */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Skills/Role"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>

          <div className="hidden sm:block w-px bg-slate-200 self-stretch" />

          {/* Experience Dropdown */}
          <div className="relative flex items-center px-4 py-3 min-w-[160px]">
            <button
              type="button"
              onClick={() => setExpOpen((o) => !o)}
              className="flex items-center gap-1 text-sm text-slate-500 w-full"
            >
              <span className="flex-1 text-left whitespace-nowrap">
                {selectedExp ? selectedExp.label : 'Select Experience'}
              </span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${expOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                <button
                  type="button"
                  onClick={() => { setExperience(''); setExpOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
                >
                  Any Experience
                </button>
                {JOB_EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => { setExperience(lvl.value); setExpOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px bg-slate-200 self-stretch" />

          {/* Location */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-r-xl transition-colors sm:rounded-l-none rounded-xl sm:rounded-xl"
          >
            Search
          </button>
        </form>

        {/* Explore CTA */}
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Explore all job openings
          <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
          </svg>
        </Link>

      </div>

      {/* Robot Image pinned to bottom, flanked by small clickable tool boxes with connector lines */}
      <div className="w-full flex justify-center items-end gap-6">

        {/* Left tool boxes */}
        <div className="hidden lg:flex flex-col gap-6 mb-24">
          {leftTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className={`${tool.float} group relative flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 w-48 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-200`}
            >
              <span className="shrink-0 w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                {tool.icon}
              </span>
              <span className="text-sm font-semibold text-slate-800 leading-snug">{tool.title}</span>
            </Link>
          ))}
        </div>

        <Image
          src="/robot_transparent_3.png"
          alt="AI Robot"
          width={490}
          height={430}
          className="relative z-10 object-contain object-bottom"
          priority
        />

        {/* Right tool boxes */}
        <div className="hidden lg:flex flex-col gap-6 mb-24">
          {rightTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className={`${tool.float} group relative flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 w-48 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-200`}
            >
              <span className="shrink-0 w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                {tool.icon}
              </span>
              <span className="text-sm font-semibold text-slate-800 leading-snug">{tool.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
