'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FEATURES = [
  {
    id: 'smart-search',
    title: 'Smart Job Search',
    subtitle: 'AI-Powered Matching',
    description:
      'Stop scrolling through hundreds of listings. Our AI analyses your skills, experience, and preferences to surface only the roles that truly fit you.',
    highlight: '3x faster than manual search',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    highlightBg: 'bg-blue-600/10 text-blue-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h6M11 8v6" />
      </svg>
    ),
  },
  {
    id: 'recruiter',
    title: 'Hire Top Talent',
    subtitle: 'Recruiter Dashboard',
    description:
      'Post jobs in under 60 seconds, manage your hiring pipeline, track applicants, and find the perfect candidate — all from one powerful dashboard.',
    highlight: '10K+ companies hiring',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    highlightBg: 'bg-indigo-600/10 text-indigo-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    id: 'resume-builder',
    title: 'AI Resume Builder',
    subtitle: 'Professional Templates',
    description:
      'Stand out from the crowd with a polished, ATS-friendly resume. Our AI suggests impactful bullet points, optimises keywords, and formats everything beautifully.',
    highlight: 'ATS-optimised templates',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
    highlightBg: 'bg-violet-600/10 text-violet-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'application-tracking',
    title: 'Track Applications',
    subtitle: 'Real-Time Status Updates',
    description:
      'From applied to interview to offer — follow every step of your journey. Get notified instantly when recruiters view your profile or update your application status.',
    highlight: 'Never miss an update',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    highlightBg: 'bg-blue-600/10 text-blue-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    id: 'resume-rank',
    title: 'Resume Rank Checker',
    subtitle: 'Score & Improve',
    description:
      'Upload your resume and get an instant compatibility score against any job description. See exactly what to fix, what to add, and how to climb higher in recruiter rankings.',
    highlight: 'Data-driven insights',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    highlightBg: 'bg-indigo-600/10 text-indigo-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

const INTERVAL_MS = 3500

export default function LoginShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % FEATURES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, next])

  const current = FEATURES[active]

  return (
    <div
      className="relative flex flex-col justify-between h-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
      <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full bg-white/5 hero-blob" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 hero-blob-delay" />
      <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-white/[0.03] hero-blob-slow" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Glass back button */}
      <Link
        href="/"
        aria-label="Back to home"
        className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full px-6 py-5">
        {/* Headline */}
        <div className="mt-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-medium text-blue-100 tracking-wide uppercase">
              Trusted by 10,000+ professionals
            </span>
          </div>
          <h1 className="text-lg xl:text-xl font-bold text-white leading-snug">
            A better path to
            <br />
            <span className="text-blue-200">more opportunity</span>
          </h1>
        </div>

        {/* Rotating feature card */}
        <div className="my-auto py-3">
          <div
            key={current.id}
            className="showcase-card-enter bg-white rounded-2xl p-5 shadow-xl border border-white/30"
          >
            {/* Icon + title row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`shrink-0 w-11 h-11 rounded-xl ${current.bg} ${current.text} ${current.border} border flex items-center justify-center shadow-sm`}
              >
                {current.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                  {current.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {current.subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-gray-600 leading-[1.6] mb-3">
              {current.description}
            </p>

            {/* Highlight badge */}
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${current.highlightBg}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {current.highlight}
              </span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {FEATURES.map((f, i) => (
              <button
                key={f.id}
                type="button"
                aria-label={`Show ${f.title}`}
                onClick={() => setActive(i)}
                className="relative h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{ width: i === active ? 20 : 6 }}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                    i === active ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-base font-bold text-white tabular-nums">50K+</p>
            <p className="text-[8px] text-blue-300 font-medium uppercase tracking-wider">Active Jobs</p>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-base font-bold text-white tabular-nums">10K+</p>
            <p className="text-[8px] text-blue-300 font-medium uppercase tracking-wider">Companies</p>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-base font-bold text-white tabular-nums">98%</p>
            <p className="text-[8px] text-blue-300 font-medium uppercase tracking-wider">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  )
}
