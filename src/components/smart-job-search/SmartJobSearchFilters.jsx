'use client'

const MATCH_PRESETS = [
  { label: 'All matches', value: 0 },
  { label: '40%+', value: 40 },
  { label: '60%+', value: 60 },
  { label: '80%+', value: 80 },
]

const WORK_MODES = [
  { label: 'Any mode', value: '' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Onsite', value: 'onsite' },
]

const JOB_TYPES = [
  { label: 'Any type', value: '' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Part-time', value: 'part_time' },
  { label: 'Internship', value: 'internship' },
  { label: 'Contract', value: 'contract' },
]

const SORTS = [
  { label: 'Best Match', value: 'best' },
  { label: 'Most Recent', value: 'recent' },
  { label: 'Highest Salary', value: 'salary' },
  { label: 'Lowest Experience Required', value: 'expAsc' },
]

/**
 * Purely client-side controls — filters/sorts the already-ranked in-memory
 * jobs array (no refetch), so the AI ranking work already done server-side
 * is never thrown away, only re-sliced/re-ordered.
 */
export default function SmartJobSearchFilters({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <div className="flex flex-wrap gap-1.5">
        {MATCH_PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => set({ minMatch: p.value })}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
              value.minMatch === p.value
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <select
        value={value.workMode}
        onChange={(e) => set({ workMode: e.target.value })}
        className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600"
      >
        {WORK_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>

      <select
        value={value.jobType}
        onChange={(e) => set({ jobType: e.target.value })}
        className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600"
      >
        {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <select
        value={value.sortBy}
        onChange={(e) => set({ sortBy: e.target.value })}
        className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600"
      >
        {SORTS.map((s) => <option key={s.value} value={s.value}>Sort: {s.label}</option>)}
      </select>
    </div>
  )
}
