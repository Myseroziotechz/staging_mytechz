'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import JobCard, { JobCardSkeleton } from '@/components/jobs/JobCard'
import { loadMoreJobsAction } from '@/lib/jobs/client-actions'

const PER_PAGE = 12

export default function BangaloreJobsGrid({ initialJobs, initialError, location }) {
  const [allJobs, setAllJobs]         = useState(initialJobs)
  const [loadPage, setLoadPage]       = useState(2)
  const [hasMore, setHasMore]         = useState(initialJobs.length >= PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setAllJobs(initialJobs)
    setLoadPage(2)
    setHasMore(initialJobs.length >= PER_PAGE)
  }, [initialJobs])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const { jobs, hasMore: more } = await loadMoreJobsAction({
      location, sort: 'newest', page: loadPage, per_page: PER_PAGE,
    })
    setAllJobs(prev => [...prev, ...jobs])
    setLoadPage(p => p + 1)
    setHasMore(more)
    setLoadingMore(false)
  }

  return (
    <div>
      {initialError && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Loading from a fresh database — once postings are live, they&apos;ll appear here.
        </div>
      )}

      {allJobs.length === 0 ? (
        <div className="job-glass-panel rounded-2xl p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No Bangalore jobs match yet</h3>
          <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">Check back soon, or browse jobs in other categories.</p>
          <Link href="/jobs" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">Explore other categories →</Link>
        </div>
      ) : (
        <>
          <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {allJobs.map(job => (
              <JobCard key={job.id} job={job} accent="blue" />
            ))}
          </div>

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
            <p className="mt-8 text-center text-xs text-slate-400">All {allJobs.length} jobs loaded</p>
          )}
        </>
      )}
    </div>
  )
}

export function BangaloreJobsLoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
    </div>
  )
}
