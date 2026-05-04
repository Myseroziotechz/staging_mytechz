'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import JobCard, { JobCardSkeleton } from './JobCard'

const PRESETS = [
  { label: 'Roles I match 80%+',          fields: { match_min: 80 } },
  { label: 'Just internships',            fields: { job_type: 'internship' } },
  { label: 'Remote · my skills',          fields: { work_mode: 'remote' } },
  { label: 'Government — exam in 30 days', fields: { category: 'government', deadline_days: 30 } },
]

function setOrDelete(params, key, value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) params.delete(key)
  else params.set(key, String(value))
}

/**
 * AI Featured page — visually distinct from JobsListingPage.
 * No faceted sidebar; instead a chat-style prompt + preset chips drive filtering.
 * Match scores are surfaced as the primary signal on every card.
 */
export default function AiFeaturedJobsPage({ initialJobs, initialFilters, initialError, isAuthed = false, hasResume = false }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [filters, setFilters] = useState(initialFilters)
  const [prompt, setPrompt]   = useState(initialFilters.prompt || '')

  const updateUrl = (next) => {
    const sp = new URLSearchParams(searchParams.toString())
    setOrDelete(sp, 'prompt',        next.prompt)
    setOrDelete(sp, 'category',      next.category)
    setOrDelete(sp, 'type',          next.job_type)
    setOrDelete(sp, 'mode',          next.work_mode)
    setOrDelete(sp, 'match_min',     next.match_min)
    setOrDelete(sp, 'deadline_days', next.deadline_days)
    startTransition(() => router.push(`${pathname}?${sp.toString()}`))
  }

  const setFilter = (patch) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    updateUrl(next)
  }

  const applyPreset = (preset) => {
    const next = { ...filters, ...preset.fields, prompt: '' }
    setFilters(next)
    setPrompt('')
    updateUrl(next)
  }

  const onPromptSubmit = (e) => {
    e.preventDefault()
    setFilter({ prompt })
  }

  const insightLine = useMemo(() => {
    if (!isAuthed)  return 'Sign in and add a resume to unlock personalized matches.'
    if (!hasResume) return 'Upload a resume in your profile to get match scores on every card.'
    return `Showing personalized matches for you${filters.prompt ? ` — "${filters.prompt}"` : ''}.`
  }, [isAuthed, hasResume, filters.prompt])

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Distinct background — darker, more "AI" feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950" />
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(245,158,11,0.25), transparent 40%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.3), transparent 50%)',
      }} />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/jobs" className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          All categories
        </Link>

        <header className="mt-3 mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/></svg>
            AI Featured
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white leading-tight">
            Jobs that fit <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">you</span>.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            Skip the noise. We rank jobs against your resume, skills and ambitions — not against keywords.
          </p>
        </header>

        {/* Chat-style prompt */}
        <form onSubmit={onPromptSubmit} className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 flex flex-col sm:flex-row gap-2 mb-3 shadow-2xl shadow-black/40">
          <div className="flex-1 flex items-start gap-2 px-3 py-2">
            <svg className="w-5 h-5 text-amber-300 mt-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/></svg>
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onPromptSubmit(e) } }}
              placeholder="Tell me what you're looking for — e.g. remote react jobs in bangalore under 5 yrs, with stock"
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none resize-none py-1"
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-sm font-bold hover:brightness-110 transition active:scale-[0.98]">
            Match me
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14"/></svg>
          </button>
        </form>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 transition">
              {p.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-6">{insightLine}</p>

        {/* Resume CTA when no resume / not authed */}
        {(!isAuthed || !hasResume) && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-400/15 to-rose-400/15 border border-amber-300/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-400/20 text-amber-200 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">Personalize your matches in 30 seconds</div>
              <div className="text-xs text-slate-300 mt-0.5">{isAuthed ? 'Add a resume in your profile and we\'ll start ranking jobs against it.' : 'Sign in and upload a resume to unlock match scores, skill-gap insights and a "Why you match" summary.'}</div>
            </div>
            <Link href={isAuthed ? '/profile' : '/login?returnTo=/jobs/ai'}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition active:scale-[0.98]">
              {isAuthed ? 'Add resume' : 'Sign in to start'} →
            </Link>
          </div>
        )}

        {initialError && (
          <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-300/30 text-amber-100 text-sm">
            Loading from a fresh database. New matches will appear here as soon as recruiters post.
          </div>
        )}

        {initialJobs.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-200 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No matches yet</h3>
            <p className="mt-1 text-sm text-slate-300 max-w-sm mx-auto">Try a different prompt or browse the category pages.</p>
            <div className="mt-4 flex justify-center gap-2">
              <Link href="/jobs/private" className="text-sm font-semibold text-blue-300 hover:text-white">Private →</Link>
              <Link href="/jobs/government" className="text-sm font-semibold text-emerald-300 hover:text-white">Government →</Link>
              <Link href="/jobs/internship" className="text-sm font-semibold text-amber-300 hover:text-white">Internships →</Link>
            </div>
          </div>
        ) : (
          <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {initialJobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                accent="amber"
                matchScore={job._match_score ?? Math.max(60, 95 - i * 4)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export function AiLoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
    </div>
  )
}
