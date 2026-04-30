'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import JobCard, { JobCardSkeleton } from './JobCard'
import SortDropdown from './SortDropdown'

const TABS = [
  { id: 'private',    label: 'Private Jobs',     blurb: 'Top companies, startups, MNCs' },
  { id: 'government', label: 'Government Jobs',  blurb: 'Central, state, PSU, defence' },
  { id: 'ai',         label: 'AI Featured',      blurb: 'Personalized matches for you' },
]

function setOrDelete(params, key, value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) params.delete(key)
  else if (Array.isArray(value)) params.set(key, value.join(','))
  else params.set(key, String(value))
}

export default function JobsPageClient({ initialJobs, initialFilters, initialError }) {
  const router        = useRouter()
  const pathname      = usePathname()
  const searchParams  = useSearchParams()
  const [, startTransition] = useTransition()

  const [filters, setFilters]       = useState(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const tab = filters.tab || 'private'

  const updateUrl = (next) => {
    const sp = new URLSearchParams(searchParams.toString())
    setOrDelete(sp, 'tab',      next.tab)
    setOrDelete(sp, 'q',        next.q)
    setOrDelete(sp, 'loc',      next.location)
    setOrDelete(sp, 'mode',     next.work_mode)
    setOrDelete(sp, 'type',     next.job_type)
    setOrDelete(sp, 'exp_min',  next.exp_min)
    setOrDelete(sp, 'exp_max',  next.exp_max)
    setOrDelete(sp, 'sal_min',  next.sal_min)
    setOrDelete(sp, 'skills',   next.skills)
    setOrDelete(sp, 'sort',     next.sort)
    setOrDelete(sp, 'page',     next.page && next.page > 1 ? next.page : null)
    startTransition(() => router.push(`${pathname}?${sp.toString()}`))
  }

  const setFilter = (patch) => {
    const next = { ...filters, ...patch, page: 1 }
    setFilters(next)
    updateUrl(next)
  }

  const activeChips = useMemo(() => {
    const out = []
    if (filters.q)         out.push({ k: 'q',        label: `"${filters.q}"` })
    if (filters.location)  out.push({ k: 'location', label: filters.location })
    if (filters.work_mode) out.push({ k: 'work_mode', label: filters.work_mode })
    if (filters.job_type)  out.push({ k: 'job_type',  label: filters.job_type.replace('_', '-') })
    if (filters.exp_min || filters.exp_max) out.push({ k: 'exp', label: `${filters.exp_min || 0}–${filters.exp_max || '∞'} yrs` })
    if (filters.sal_min)   out.push({ k: 'sal_min',  label: `≥ ₹${(filters.sal_min / 100000).toFixed(0)}L` })
    if (filters.skills?.length) out.push({ k: 'skills', label: filters.skills.join(', ') })
    return out
  }, [filters])

  const removeChip = (k) => {
    if (k === 'exp') setFilter({ exp_min: '', exp_max: '' })
    else if (k === 'skills') setFilter({ skills: [] })
    else setFilter({ [k]: '' })
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      {/* Animated grid (matches hero) */}
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl" />
        <div className="hero-blob-slow absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Heading */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Find your <span className="hero-gradient-text">next role</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Search across private, government, and AI-personalized openings — one place, one experience.
          </p>
        </header>

        {/* Tabs (desktop) + select (mobile) */}
        <div className="mb-5 sm:mb-6">
          {/* Mobile: dropdown */}
          <label className="sm:hidden block">
            <span className="sr-only">Job category</span>
            <select
              value={tab}
              onChange={(e) => setFilter({ tab: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur border border-slate-200 text-slate-900 font-medium shadow-sm"
            >
              {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          {/* Desktop: tab pills */}
          <div className="hidden sm:flex items-center gap-2 p-1 rounded-2xl job-glass-panel w-fit">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setFilter({ tab: t.id })}
                className={[
                  'relative px-4 py-2 rounded-xl text-sm font-semibold transition',
                  tab === t.id
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
                ].join(' ')}
              >
                {t.label}
                {t.id === 'ai' && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 align-middle">AI</span>}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{TABS.find(t => t.id === tab)?.blurb}</p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault() }}
          className="job-glass-panel rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-4 shadow-xl shadow-blue-900/5"
        >
          <div className="flex-1 flex items-center px-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              defaultValue={filters.q || ''}
              onBlur={(e) => e.target.value !== (filters.q || '') && setFilter({ q: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && setFilter({ q: e.currentTarget.value })}
              placeholder={tab === 'ai' ? 'Try: remote react jobs in bangalore under 5 yrs' : 'Job title, company or skill'}
              className="w-full px-3 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          <div className="hidden sm:block w-px bg-slate-200" />
          <div className="flex-1 flex items-center px-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              defaultValue={filters.location || ''}
              onBlur={(e) => e.target.value !== (filters.location || '') && setFilter({ location: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && setFilter({ location: e.currentTarget.value })}
              placeholder="Location"
              className="w-full px-3 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4"/></svg>
            Filters
          </button>
        </form>

        {/* Active chips + sort */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map(c => (
              <button key={c.k} onClick={() => removeChip(c.k)} className="text-xs px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition inline-flex items-center gap-1">
                {c.label} <span className="text-slate-400">×</span>
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={() => setFilters({ tab }) || setFilter({ q: '', location: '', work_mode: '', job_type: '', exp_min: '', exp_max: '', sal_min: '', skills: [] })} className="text-xs text-slate-500 underline-offset-2 hover:underline">Clear all</button>
            )}
          </div>
          <SortDropdown
            value={filters.sort || 'newest'}
            onChange={(v) => setFilter({ sort: v })}
            options={[
              { value: 'newest',   label: 'Newest first',     hint: 'Recently posted on top' },
              { value: 'salary',   label: 'Highest salary',   hint: 'Best paying roles first' },
              { value: 'deadline', label: 'Closing soonest',  hint: 'Apply before they expire' },
              ...(tab === 'ai' ? [{ value: 'match', label: 'Best match', hint: 'Personalized to your resume' }] : []),
            ]}
          />
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filters sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="job-glass-panel rounded-2xl p-5 sticky top-24">
              <FiltersPanel filters={filters} setFilter={setFilter} tab={tab} />
            </div>
          </aside>

          {/* Results */}
          <div>
            {initialError && (
              <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                Jobs are loading from a fresh database. Once the recruiter posts the first role, it&apos;ll appear here.
              </div>
            )}

            {initialJobs.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {initialJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating mobile filters FAB — always reachable while scrolling */}
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-label="Open filters"
          className="lg:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-blue-700 text-white text-sm font-semibold shadow-2xl shadow-blue-900/30 hover:bg-blue-800 transition active:scale-[0.96]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4"/></svg>
          Filters
          {activeChips.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-bold text-amber-950">
              {activeChips.length}
            </span>
          )}
        </button>

        {/* Mobile filters bottom-sheet */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end" role="dialog">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl p-5 animate-[hero-fade-up_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="text-slate-500">Close</button>
              </div>
              <FiltersPanel filters={filters} setFilter={setFilter} tab={tab} />
              <button onClick={() => setFiltersOpen(false)} className="mt-5 w-full py-3 rounded-xl bg-blue-700 text-white font-semibold">Show results</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function FiltersPanel({ filters, setFilter, tab }) {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work mode</label>
        <div className="flex flex-wrap gap-1.5">
          {['remote', 'hybrid', 'onsite'].map(m => (
            <button key={m} onClick={() => setFilter({ work_mode: filters.work_mode === m ? '' : m })}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${filters.work_mode === m ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job type</label>
        <div className="flex flex-wrap gap-1.5">
          {['full_time', 'part_time', 'internship', 'contract'].map(t => (
            <button key={t} onClick={() => setFilter({ job_type: filters.job_type === t ? '' : t })}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${filters.job_type === t ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>
              {t.replace('_', '-')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience (years)</label>
        <div className="flex gap-2">
          <input type="number" min={0} max={40} placeholder="Min" defaultValue={filters.exp_min || ''}
            onBlur={(e) => setFilter({ exp_min: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900" />
          <input type="number" min={0} max={40} placeholder="Max" defaultValue={filters.exp_max || ''}
            onBlur={(e) => setFilter({ exp_max: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Min salary (₹/yr)</label>
        <input type="number" min={0} step={50000} placeholder="e.g. 1000000" defaultValue={filters.sal_min || ''}
          onBlur={(e) => setFilter({ sal_min: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900" />
      </div>

      {tab === 'ai' && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800">
          AI mode uses your saved resume to rank jobs by best fit. Upload a resume in Profile to unlock matching.
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="job-glass-panel rounded-2xl p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">No jobs match yet</h3>
      <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">Try removing a filter or broadening your search. New jobs are posted every day.</p>
    </div>
  )
}

export function JobsLoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
    </div>
  )
}
