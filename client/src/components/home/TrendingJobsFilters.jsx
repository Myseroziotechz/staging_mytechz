'use client'

import { useMemo, useState } from 'react'
import JobCard from '@/components/jobs/JobCard'
import { JOB_EXPERIENCE_LEVELS } from '@/config/jobs'

const EXP_RANGES = {
  fresher: [0, 1],
  junior: [1, 3],
  mid: [3, 6],
  senior: [6, 99],
}

const SALARY_BUCKETS = [
  { value: '0-5', label: '0 – 5 LPA', min: 0, max: 500000 },
  { value: '5-10', label: '5 – 10 LPA', min: 500000, max: 1000000 },
  { value: '10-15', label: '10 – 15 LPA', min: 1000000, max: 1500000 },
  { value: '15-25', label: '15 – 25 LPA', min: 1500000, max: 2500000 },
  { value: '25+', label: '25 LPA+', min: 2500000, max: Infinity },
]

const EMPTY_FILTERS = { location: '', education: '', experience: '', salary: '' }

function ChevronIcon({ open, light }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${light ? 'text-white' : 'text-slate-500'} ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function FilterDropdown({ label, value, options, onChange, open, onToggle }) {
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 text-[15px] font-semibold px-5 py-3 rounded-full border-2 shadow-sm transition ${
          value
            ? 'bg-[#222a4f] border-[#222a4f] text-white shadow-md'
            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:shadow-md'
        }`}
      >
        <span className="whitespace-nowrap">{selectedLabel || label}</span>
        <ChevronIcon open={open} light={!!value} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
          <button
            type="button"
            onClick={() => onChange('')}
            className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            Any {label.toLowerCase()}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === opt.value ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}
            >
              {opt.label}
            </button>
          ))}
          {options.length === 0 && <p className="px-4 py-2 text-sm text-slate-400">No options yet</p>}
        </div>
      )}
    </div>
  )
}

export default function TrendingJobsFilters({ jobs }) {
  const [pending, setPending] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [openDropdown, setOpenDropdown] = useState(null)

  const locationOptions = useMemo(() => {
    const cities = new Set(jobs.map((j) => j.location_city).filter(Boolean))
    return [...cities].sort().map((c) => ({ value: c, label: c }))
  }, [jobs])

  const educationOptions = useMemo(() => {
    const quals = new Set(jobs.flatMap((j) => j.qualifications || []))
    return [...quals].sort().map((q) => ({ value: q, label: q }))
  }, [jobs])

  const experienceOptions = JOB_EXPERIENCE_LEVELS
  const salaryOptions = SALARY_BUCKETS

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (applied.location && job.location_city !== applied.location) return false
      if (applied.education && !(job.qualifications || []).includes(applied.education)) return false
      if (applied.experience) {
        const [rMin, rMax] = EXP_RANGES[applied.experience]
        const jMin = job.experience_min ?? 0
        const jMax = job.experience_max ?? 99
        if (jMax < rMin || jMin > rMax) return false
      }
      if (applied.salary) {
        const bucket = SALARY_BUCKETS.find((b) => b.value === applied.salary)
        const value = job.salary_max ?? job.salary_min
        if (value == null || value < bucket.min || value > bucket.max) return false
      }
      return true
    })
  }, [jobs, applied])

  const hasPendingChanges = JSON.stringify(pending) !== JSON.stringify(applied)
  const hasAppliedFilters = Object.values(applied).some(Boolean)

  const toggleDropdown = (key) => setOpenDropdown((cur) => (cur === key ? null : key))
  const setPendingValue = (key, value) => {
    setPending((p) => ({ ...p, [key]: value }))
    setOpenDropdown(null)
  }
  const handleSearch = () => setApplied(pending)
  const handleClear = () => {
    setPending(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
  }

  return (
    <div onClick={() => openDropdown && setOpenDropdown(null)}>
      <div className="flex flex-wrap items-center gap-3 mb-6" onClick={(e) => e.stopPropagation()}>
        <FilterDropdown
          label="Location" value={pending.location} options={locationOptions}
          open={openDropdown === 'location'} onToggle={() => toggleDropdown('location')}
          onChange={(v) => setPendingValue('location', v)}
        />
        <FilterDropdown
          label="Education" value={pending.education} options={educationOptions}
          open={openDropdown === 'education'} onToggle={() => toggleDropdown('education')}
          onChange={(v) => setPendingValue('education', v)}
        />
        <FilterDropdown
          label="Experience" value={pending.experience} options={experienceOptions}
          open={openDropdown === 'experience'} onToggle={() => toggleDropdown('experience')}
          onChange={(v) => setPendingValue('experience', v)}
        />
        <FilterDropdown
          label="Salary" value={pending.salary} options={salaryOptions}
          open={openDropdown === 'salary'} onToggle={() => toggleDropdown('salary')}
          onChange={(v) => setPendingValue('salary', v)}
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={!hasPendingChanges}
          className="ml-1 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Search
        </button>

        {hasAppliedFilters && (
          <button type="button" onClick={handleClear} className="text-sm font-semibold text-slate-500 hover:text-slate-700 underline-offset-2 hover:underline">
            Clear
          </button>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="job-glass-panel rounded-2xl p-10 text-center">
          <p className="text-sm text-slate-600">No trending jobs match those filters right now.</p>
          <button type="button" onClick={handleClear} className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="job-card-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} variant="compact" />
          ))}
        </div>
      )}
    </div>
  )
}
