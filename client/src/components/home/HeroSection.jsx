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

  return (
    <section className="bg-[#FDF6EC] -mt-20 min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-40 pb-0 flex flex-col items-center text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
          Search Your Dream Job
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

      {/* Robot Image pinned to bottom */}
      <div className="w-full flex justify-center items-end">
        <Image
          src="/robot_transparent_3.png"
          alt="AI Robot"
          width={580}
          height={510}
          className="object-contain object-bottom"
          priority
        />
      </div>
    </section>
  )
}
