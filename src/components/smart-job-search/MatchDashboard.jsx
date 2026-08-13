'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { jobUrl } from '@/lib/jobs/format'
import CandidateProfilePreview from './CandidateProfilePreview'
import SmartJobSearchFilters from './SmartJobSearchFilters'
import MatchedJobCard from './MatchedJobCard'

const DEFAULT_FILTERS = { minMatch: 0, workMode: '', jobType: '', sortBy: 'best' }

function sortJobs(jobs, sortBy) {
  const copy = [...jobs]
  if (sortBy === 'recent') {
    return copy.sort((a, b) => new Date(b.posted_at || 0) - new Date(a.posted_at || 0))
  }
  if (sortBy === 'salary') {
    return copy.sort((a, b) => (b.salary_max ?? -Infinity) - (a.salary_max ?? -Infinity))
  }
  if (sortBy === 'expAsc') {
    return copy.sort((a, b) => (a.experience_min ?? Infinity) - (b.experience_min ?? Infinity))
  }
  // 'best' — already sorted by match percent from the server; keep it stable.
  return copy.sort((a, b) => b._match.percent - a._match.percent)
}

export default function MatchDashboard({ candidateProfile, jobs, total, error, savedJobUrls = [] }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const savedSet = useMemo(() => new Set(savedJobUrls), [savedJobUrls])

  const visible = useMemo(() => {
    let list = jobs.filter((j) => j._match.percent >= filters.minMatch)
    if (filters.workMode) list = list.filter((j) => j.work_mode === filters.workMode)
    if (filters.jobType) list = list.filter((j) => j.job_type === filters.jobType)
    return sortJobs(list, filters.sortBy)
  }, [jobs, filters])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Jobs matched for you</h1>
        <p className="text-slate-500">Based on your resume, profile, and preferences — {total} jobs ranked by real fit.</p>
      </div>

      <div className="mb-6">
        <CandidateProfilePreview candidateProfile={candidateProfile} />
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Loading from a fresh database. New matches will appear here as soon as recruiters post.
        </div>
      )}

      <SmartJobSearchFilters value={filters} onChange={setFilters} />

      {visible.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No strong matches yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Try lowering the match threshold, or add more skills to{' '}
            <Link href="/profile" className="text-violet-700 hover:underline">your profile</Link>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map((job) => (
            <MatchedJobCard key={job.id} job={job} initialSaved={savedSet.has(jobUrl(job))} />
          ))}
        </div>
      )}
    </div>
  )
}
