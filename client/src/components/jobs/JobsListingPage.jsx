'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import JobCard, { JobCardSkeleton } from './JobCard'
import SortDropdown from './SortDropdown'
import FacetedFiltersPanel from './FacetedFiltersPanel'
import { formatStipend, govMeta, parseInternshipMeta } from '@/lib/jobs/format'
import { loadMoreJobsAction } from '@/lib/jobs/client-actions'

const PER_PAGE = 12

function setOrDelete(params, key, value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) params.delete(key)
  else if (Array.isArray(value)) params.set(key, value.join(','))
  else params.set(key, String(value))
}

// [stateKey, urlKey] — the private-only keys (dept/wmodes/city/ind/edu/co/sal/hl/exp_max)
// are no-ops for Government/Internship since those pages never set them.
const FILTER_KEYS = [
  ['q', 'q'], ['location', 'loc'], ['work_mode', 'mode'], ['job_type', 'type'],
  ['exp_min', 'exp_min'], ['exp_max', 'exp_max'], ['sal_min', 'sal_min'],
  ['skills', 'skills'], ['sort', 'sort'],
  ['departments', 'dept'], ['work_modes', 'wmodes'], ['cities', 'city'],
  ['industries', 'ind'], ['educations', 'edu'], ['companyIds', 'co'],
  ['salaryBuckets', 'sal'], ['highlight', 'hl'],
]

const PRIVATE_CLEAR_KEYS = ['departments', 'work_modes', 'cities', 'industries', 'educations', 'companyIds', 'salaryBuckets', 'highlight']

/**
 * Shared listing page for Private / Government / Internship.
 * AI Featured uses its own component.
 *
 * Required props:
 *   pageConfig: {
 *     id: 'private' | 'government' | 'internship',
 *     title: string,
 *     subtitle: string,
 *     accentColor: 'blue' | 'emerald' | 'amber',
 *     heroBadge: string,
 *     placeholder: string,
 *     extraSortOptions?: array,
 *     showExperienceFilter?: boolean,
 *   }
 *   initialJobs, initialFilters, initialError
 */
export default function JobsListingPage({ pageConfig, initialJobs, initialFilters, initialError, facets }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [filters, setFilters]         = useState(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Load-more state — resets whenever initialJobs changes (i.e. filter navigation)
  const [allJobs, setAllJobs]     = useState(initialJobs)
  const [loadPage, setLoadPage]   = useState(2)
  const [hasMore, setHasMore]     = useState(initialJobs.length >= PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setAllJobs(initialJobs)
    setLoadPage(2)
    setHasMore(initialJobs.length >= PER_PAGE)
  }, [initialJobs])

  // Deep-link support for "#filter-*" anchors (used by the homepage's floating
  // filter chips): the panel renders twice (desktop sidebar + mobile bottom
  // sheet), each with its own id prefix (see `idPrefix` below) since ids must
  // be unique. On mobile the sheet is unmounted by default, so a plain hash
  // anchor can't scroll to it — open the sheet first, then scroll once the
  // "m-"-prefixed target exists.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash.startsWith('filter-')) return
    const isMobile = window.innerWidth < 1024
    if (isMobile) setFiltersOpen(true)
    const targetId = isMobile ? `m-${hash}` : hash
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (isMobile && el) {
        el.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2', 'rounded-xl')
        setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2', 'rounded-xl'), 2000)
      }
    }, isMobile ? 150 : 0)
    return () => clearTimeout(timer)
  }, [])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const { jobs, hasMore: more } = await loadMoreJobsAction({
      ...filters,
      category: pageConfig.id,
      exclude_internships: pageConfig.id === 'private',
      page: loadPage,
      per_page: PER_PAGE,
    })
    setAllJobs(prev => [...prev, ...jobs])
    setLoadPage(p => p + 1)
    setHasMore(more)
    setLoadingMore(false)
  }

  const updateUrl = (next) => {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [stateKey, urlKey] of FILTER_KEYS) setOrDelete(sp, urlKey, next[stateKey])
    setOrDelete(sp, 'page', next.page && next.page > 1 ? next.page : null)
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

    if (filters.departments?.length)  out.push({ k: 'departments',  label: filters.departments.join(', ') })
    if (filters.work_modes?.length)   out.push({ k: 'work_modes',   label: filters.work_modes.join(', ') })
    if (filters.cities?.length)       out.push({ k: 'cities',       label: filters.cities.join(', ') })
    if (filters.industries?.length)   out.push({ k: 'industries',   label: filters.industries.join(', ') })
    if (filters.educations?.length)   out.push({ k: 'educations',   label: filters.educations.join(', ') })
    if (filters.highlight?.length)    out.push({ k: 'highlight',    label: filters.highlight.join(', ') })
    if (filters.companyIds?.length) {
      const names = filters.companyIds.map(id => facets?.company?.find(c => c.value === id)?.label || id)
      out.push({ k: 'companyIds', label: names.join(', ') })
    }
    if (filters.salaryBuckets?.length) {
      const labels = filters.salaryBuckets.map(k => facets?.salary?.find(s => s.value === k)?.label || k)
      out.push({ k: 'salaryBuckets', label: labels.join(', ') })
    }
    if (pageConfig.id === 'private' && filters.exp_max) out.push({ k: 'exp_max', label: `up to ${filters.exp_max} yrs` })

    return out
  }, [filters, facets, pageConfig.id])

  const removeChip = (k) => {
    if (k === 'exp') setFilter({ exp_min: '', exp_max: '' })
    else if (k === 'exp_max') setFilter({ exp_max: '' })
    else if (PRIVATE_CLEAR_KEYS.includes(k)) setFilter({ [k]: [] })
    else if (k === 'skills') setFilter({ skills: [] })
    else setFilter({ [k]: '' })
  }

  const clearAll = () => setFilter({
    q: '', location: '', work_mode: '', job_type: '', exp_min: '', exp_max: '', sal_min: '', skills: [],
    ...Object.fromEntries(PRIVATE_CLEAR_KEYS.map(k => [k, []])),
  })

  const sortOptions = [
    { value: 'newest',   label: 'Newest first',     hint: 'Recently posted on top' },
    ...(pageConfig.id !== 'internship'
        ? [{ value: 'salary',   label: 'Highest salary',  hint: 'Best paying roles first' }]
        : [{ value: 'salary',   label: 'Highest stipend', hint: 'Best paying internships' }]),
    { value: 'deadline', label: 'Closing soonest',  hint: 'Apply before they expire' },
  ]

  return (
    <section className="bg-white min-h-screen">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Heading */}
        <header className="mb-6 sm:mb-8">
          <Link href="/jobs" className="text-xs text-slate-500 hover:text-blue-700 inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            All categories
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
              pageConfig.accentColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              pageConfig.accentColor === 'amber'   ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                     'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>{pageConfig.heroBadge}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {pageConfig.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">{pageConfig.subtitle}</p>
        </header>

        {/* Active chips + sort */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map(c => (
              <button key={c.k} onClick={() => removeChip(c.k)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition inline-flex items-center gap-1">
                {c.label} <span className="text-slate-400">×</span>
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs text-slate-500 underline-offset-2 hover:underline">Clear all</button>
            )}
          </div>
          <SortDropdown
            value={filters.sort || 'newest'}
            onChange={(v) => setFilter({ sort: v })}
            options={sortOptions}
          />
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filters sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="job-glass-panel rounded-2xl p-5 sticky top-24">
              {pageConfig.id === 'private' || pageConfig.id === 'internship'
                ? <FacetedFiltersPanel filters={filters} setFilter={setFilter} facets={facets} variant={pageConfig.id} />
                : <FiltersPanel filters={filters} setFilter={setFilter} pageConfig={pageConfig} />}
            </div>
          </aside>

          {/* Results */}
          <div>
            {initialError && (
              <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                Loading from a fresh database — once postings are live, they&apos;ll appear here.
              </div>
            )}

            {allJobs.length === 0 ? (
              <EmptyState pageConfig={pageConfig} />
            ) : (
              <>
                <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {allJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      accent={pageConfig.accentColor}
                      primaryAmount={pageConfig.id === 'internship' ? formatStipend(job) : null}
                      cardExtras={renderExtras(pageConfig.id, job)}
                    />
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          Loading…
                        </>
                      ) : (
                        <>
                          See more jobs
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400">{allJobs.length} jobs loaded</p>
                  </div>
                )}

                {!hasMore && allJobs.length > PER_PAGE && (
                  <p className="mt-8 text-center text-xs text-slate-400">
                    All {allJobs.length} jobs loaded
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floating mobile filters FAB */}
        <button type="button" onClick={() => setFiltersOpen(true)} aria-label="Open filters"
          className="lg:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-blue-700 text-white text-sm font-semibold shadow-2xl shadow-blue-900/30 hover:bg-blue-800 transition active:scale-[0.96]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4"/></svg>
          Filters
          {activeChips.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-[10px] font-bold text-amber-950">{activeChips.length}</span>
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
              {pageConfig.id === 'private' || pageConfig.id === 'internship'
                ? <FacetedFiltersPanel filters={filters} setFilter={setFilter} facets={facets} variant={pageConfig.id} idPrefix="m-" />
                : <FiltersPanel filters={filters} setFilter={setFilter} pageConfig={pageConfig} />}
              <button onClick={() => setFiltersOpen(false)} className="mt-5 w-full py-3 rounded-xl bg-blue-700 text-white font-semibold">Show results</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function renderExtras(pageId, job) {
  if (pageId === 'internship') {
    const { durationMonths, ppoChance } = parseInternshipMeta(job)
    const hasBadge = durationMonths || (ppoChance != null && ppoChance > 0)
    if (!hasBadge) return null
    return (
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {durationMonths && (
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {durationMonths} months
          </span>
        )}
        {ppoChance != null && ppoChance > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {ppoChance}% PPO chance
          </span>
        )}
      </div>
    )
  }
  if (pageId === 'government') {
    const m = govMeta(job)
    const hasVacancies = m.vacancies != null && m.vacancies > 0
    if (!hasVacancies && !m.exam_date) return null
    return (
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {hasVacancies && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {m.vacancies} vacancies
          </span>
        )}
        {m.exam_date && (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            Exam: {new Date(m.exam_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
    )
  }
  return null
}

// Plain (non-faceted) panel — only reached by Government now that Private
// and Internship both use FacetedFiltersPanel.
function FiltersPanel({ filters, setFilter }) {
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
          {['full_time', 'part_time', 'contract'].map(t => (
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
        <input type="number" min={0} step={50000}
          placeholder="e.g. 1000000"
          defaultValue={filters.sal_min || ''}
          onBlur={(e) => setFilter({ sal_min: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900" />
      </div>
    </div>
  )
}

function EmptyState({ pageConfig }) {
  return (
    <div className="job-glass-panel rounded-2xl p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">No {pageConfig.id} jobs match yet</h3>
      <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">Try removing a filter or browsing other categories.</p>
      <Link href="/jobs" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">Explore other categories →</Link>
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
