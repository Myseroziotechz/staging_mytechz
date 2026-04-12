'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const sectionRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleMouseMove = (e) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative -mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50"
    >
      {/* Animated grid */}
      <div className="pointer-events-none absolute inset-0 hero-grid" />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity"
        style={{
          background:
            'radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), rgba(245,158,11,0.12), transparent 40%)',
        }}
      />

      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-slow absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 sm:pt-40 lg:pt-44">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="hero-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blue-100 text-xs sm:text-sm font-medium text-blue-700 shadow-sm">
              <span className="text-amber-500 animate-pulse">★</span>
              #1 Career Development Platform
            </span>

            <h1 className="hero-fade-up-d1 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Launch Your Dream
              <br />
              Career
              <br />
              With <span className="hero-gradient-text">Mytechz</span>
            </h1>

            <p className="hero-fade-up-d2 mt-6 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Discover top job opportunities, sharpen your skills with expert-led
              webinars, and get personalized career guidance — all in one place.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hero-fade-up-d3 group mt-8 bg-white/90 backdrop-blur rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 p-2 flex flex-col sm:flex-row gap-2 w-full max-w-xl mx-auto lg:mx-0 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-amber-400/50"
            >
              <div className="flex-1 flex items-center px-3">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title or skill"
                  className="w-full px-3 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-100" />
              <div className="flex-1 flex items-center px-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full px-3 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="relative overflow-hidden bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-blue-700/20 transition-all hover:shadow-lg hover:shadow-blue-700/30 active:scale-95"
              >
                <span className="relative z-10">Search</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </button>
            </form>

            {/* CTA buttons */}
            <div className="hero-fade-up-d3 mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/jobs"
                className="group/btn relative inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
              >
                Explore Jobs
                <span className="transition-transform group-hover/btn:translate-x-1" aria-hidden>→</span>
              </Link>
              <button
                type="button"
                className="group/demo inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="relative w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs hero-pulse-ring">
                  <span className="relative">▶</span>
                </span>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="hero-fade-up-d4 mt-10 grid grid-cols-3 gap-4 max-w-lg w-full">
              {[
                { value: '50K+', label: 'Jobs Listed' },
                { value: '12K+', label: 'Placed Candidates' },
                { value: '200+', label: 'Expert Mentors' },
              ].map((s) => (
                <div key={s.label} className="group/stat text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 transition-colors group-hover/stat:text-blue-700">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual — floating cards */}
          <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] hidden md:block hero-fade-up-d2">
            {/* Resume Score card */}
            <div className="hero-float-a absolute top-0 right-4 w-64">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-4 rotate-[2deg] transition-transform hover:rotate-0 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-700">Resume Score</div>
                  <div className="text-xs text-emerald-600 font-medium">+8</div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">82</span>
                  <span className="text-sm text-slate-400">/ 100</span>
                </div>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Job card */}
            <div className="hero-float-b absolute top-36 right-0 w-72">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-5 -rotate-[2deg] transition-transform hover:rotate-0 hover:scale-105">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      SE
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Software Engineer</div>
                      <div className="text-xs text-slate-500">Google · Remote</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    New
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['React', 'Node.js', 'AWS'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">₹18–28 LPA</div>
              </div>
            </div>

            {/* Interview Schedule card */}
            <div className="hero-float-c absolute bottom-4 left-0 sm:left-4 w-64">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-4 rotate-[-3deg] transition-transform hover:rotate-0 hover:scale-105">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Interview Scheduled</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">Tomorrow, 10:00 AM</div>
              </div>
            </div>

            {/* Decorative dashed ring */}
            <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full border-2 border-dashed border-blue-200/60 animate-[spin_30s_linear_infinite]" />
          </div>
        </div>
      </div>
    </section>
  )
}
