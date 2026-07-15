'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const CLEAR_KEYS = ['departments', 'work_modes', 'cities', 'industries', 'educations', 'companyIds', 'salaryBuckets', 'highlight']

function ChevronIcon({ open }) {
  return (
    <svg className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function Section({ id, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div id={id} className="border-b border-slate-200 py-5 first:pt-0 last:border-b-0 scroll-mt-28 target:ring-2 target:ring-blue-400 target:ring-offset-2 target:rounded-xl">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between text-left">
        <span className="text-[17px] font-bold text-slate-900">{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  )
}

function CheckboxRow({ checked, label, count, onToggle }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-[18px] h-[18px] shrink-0 rounded-[3px] border-slate-400 accent-black cursor-pointer"
      />
      <span className={`text-[15px] truncate ${checked ? 'font-semibold text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
        {label}
      </span>
      {count != null && <span className="text-sm text-slate-400 ml-auto shrink-0">({count})</span>}
    </label>
  )
}

function CheckboxList({ options, selected, onToggle, limit = 4, onViewMore }) {
  const visible = options.slice(0, limit)
  return (
    <div>
      {visible.map(opt => (
        <CheckboxRow key={opt.value} checked={selected.includes(opt.value)} label={opt.label} count={opt.count} onToggle={() => onToggle(opt.value)} />
      ))}
      {options.length > limit && (
        <button type="button" onClick={onViewMore} className="mt-1.5 text-[15px] font-semibold text-blue-700">
          View More
        </button>
      )}
      {options.length === 0 && <p className="text-sm text-slate-400">No options yet</p>}
    </div>
  )
}

function ExperienceSlider({ value, onChange }) {
  const numeric = value === '' || value == null ? 40 : Number(value)
  return (
    <div className="px-0.5">
      <input
        type="range" min={0} max={40} value={numeric}
        onChange={(e) => onChange(Number(e.target.value) >= 40 ? '' : e.target.value)}
        className="w-full accent-black cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>0 Yrs</span>
        <span className="font-semibold text-slate-900">{numeric >= 40 ? 'Any' : `${numeric} Yrs`}</span>
      </div>
    </div>
  )
}

const MODAL_ROWS_PER_COLUMN = 10
const MODAL_COLUMN_WIDTH = 256 // px, matches w-64
const MODAL_COLUMN_GAP = 32 // px, matches gap-x-8
const MODAL_COLUMN_PITCH = MODAL_COLUMN_WIDTH + MODAL_COLUMN_GAP

function FilterModal({ title, options, selected, onToggle, onClose }) {
  const [search, setSearch] = useState('')
  const scrollRef = useRef(null)
  const [spacerWidth, setSpacerWidth] = useState(0)

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const columns = []
  for (let i = 0; i < filtered.length; i += MODAL_ROWS_PER_COLUMN) {
    columns.push(filtered.slice(i, i + MODAL_ROWS_PER_COLUMN))
  }

  // Without this, the browser's mandatory scroll-snap can only reach the true
  // end of the track, which rarely lands on a column boundary — clipping the
  // second-to-last column in half. Padding the track so the last real column
  // can snap to a start position keeps every rest position a full column.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setSpacerWidth(Math.max(0, el.clientWidth - MODAL_COLUMN_PITCH))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title}`}
              className="w-full pl-9 pr-3 py-2.5 rounded-full border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5 snap-x snap-mandatory">
          <div className="flex h-full" style={{ gap: MODAL_COLUMN_GAP }}>
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col shrink-0 snap-start" style={{ width: MODAL_COLUMN_WIDTH }}>
                {col.map(opt => (
                  <CheckboxRow key={opt.value} checked={selected.includes(opt.value)} label={opt.label} count={opt.count} onToggle={() => onToggle(opt.value)} />
                ))}
              </div>
            ))}
            {columns.length > 0 && spacerWidth > 0 && (
              <div className="shrink-0" style={{ width: spacerWidth }} aria-hidden="true" />
            )}
            {columns.length === 0 && <p className="text-sm text-slate-400">No matches</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition">
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

const EMPTY_FACETS = { department: [], workMode: [], location: [], industry: [], education: [], company: [], salary: [], highlight: [] }

// Shared "All Filters" sidebar for Private and Internship listings — identical
// sizes/fonts/colors/layout for both. Experience is skipped for internships:
// students/freshers don't have a prior-experience requirement to filter on,
// which is also why the internship page never sets exp_min/exp_max.
export default function FacetedFiltersPanel({ filters, setFilter, facets = EMPTY_FACETS, variant = 'private', idPrefix = '' }) {
  const [modal, setModal] = useState(null)
  const isInternship = variant === 'internship'
  const sid = (name) => `${idPrefix}filter-${name}`
  const salaryLabel = isInternship ? 'Stipend' : 'Salary'
  const clearKeys = isInternship ? CLEAR_KEYS.filter(k => k !== 'exp_max') : CLEAR_KEYS

  const toggleArr = (key, value) => {
    const cur = filters[key] || []
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    setFilter({ [key]: next })
  }

  const appliedCount = clearKeys.reduce((n, k) => n + (filters[k]?.length || 0), 0) + (!isInternship && filters.exp_max ? 1 : 0)

  const clearAllFacets = () => {
    const reset = Object.fromEntries(clearKeys.map(k => [k, []]))
    setFilter(isInternship ? reset : { ...reset, exp_max: '' })
  }

  const modalConfig = {
    department: { title: 'Department', options: facets.department, key: 'departments' },
    location:   { title: 'Location',   options: facets.location,   key: 'cities' },
    salary:     { title: salaryLabel,  options: facets.salary,     key: 'salaryBuckets' },
    industry:   { title: 'Industry',   options: facets.industry,   key: 'industries' },
    education:  { title: 'Education',  options: facets.education,  key: 'educations' },
    company:    { title: 'Top companies', options: facets.company, key: 'companyIds' },
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-4 mb-1 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">All Filters</h2>
        {appliedCount > 0 && (
          <button type="button" onClick={clearAllFacets} className="text-sm font-semibold text-blue-700 hover:underline">
            Applied ({appliedCount})
          </button>
        )}
      </div>

      <Section title="Department">
        <CheckboxList options={facets.department} selected={filters.departments || []} onToggle={(v) => toggleArr('departments', v)} onViewMore={() => setModal('department')} />
      </Section>

      <Section title="Work mode">
        <CheckboxList options={facets.workMode} selected={filters.work_modes || []} onToggle={(v) => toggleArr('work_modes', v)} limit={10} />
      </Section>

      {!isInternship && (
        <Section id={sid('experience')} title="Experience">
          <ExperienceSlider value={filters.exp_max} onChange={(v) => setFilter({ exp_max: v })} />
        </Section>
      )}

      <Section id={sid('location')} title="Location">
        <CheckboxList options={facets.location} selected={filters.cities || []} onToggle={(v) => toggleArr('cities', v)} onViewMore={() => setModal('location')} />
      </Section>

      <Section id={sid('salary')} title={salaryLabel}>
        <CheckboxList options={facets.salary} selected={filters.salaryBuckets || []} onToggle={(v) => toggleArr('salaryBuckets', v)} onViewMore={() => setModal('salary')} />
      </Section>

      <Section title="Industry">
        <CheckboxList options={facets.industry} selected={filters.industries || []} onToggle={(v) => toggleArr('industries', v)} onViewMore={() => setModal('industry')} />
      </Section>

      <Section id={sid('education')} title="Education">
        <CheckboxList options={facets.education} selected={filters.educations || []} onToggle={(v) => toggleArr('educations', v)} onViewMore={() => setModal('education')} />
      </Section>

      <Section title="Highlights">
        <CheckboxList options={facets.highlight} selected={filters.highlight || []} onToggle={(v) => toggleArr('highlight', v)} limit={10} />
      </Section>

      <Section title="Top companies">
        <CheckboxList options={facets.company} selected={filters.companyIds || []} onToggle={(v) => toggleArr('companyIds', v)} onViewMore={() => setModal('company')} />
      </Section>

      {modal && modalConfig[modal] && (
        <FilterModal
          title={modalConfig[modal].title}
          options={modalConfig[modal].options}
          selected={filters[modalConfig[modal].key] || []}
          onToggle={(v) => toggleArr(modalConfig[modal].key, v)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
