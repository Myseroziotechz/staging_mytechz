'use client'

import { useEffect, useRef, useState } from 'react'

const ICONS = {
  newest:   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  salary:   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 10v2m9-6a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  deadline: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  match:    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/></svg>,
}

export default function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = options.find(o => o.value === value) || options[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'group inline-flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-[0.98]',
          'job-glass-panel hover:bg-white/95 hover:shadow-md hover:shadow-blue-900/10',
          open ? 'ring-2 ring-blue-300/60' : '',
        ].join(' ')}
      >
        <span className="text-slate-400">{ICONS[current.value] || ICONS.newest}</span>
        <span className="text-slate-500 hidden sm:inline">Sort:</span>
        <span className="text-slate-900">{current.label}</span>
        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-56 z-30 rounded-xl job-glass-panel shadow-xl shadow-blue-900/15 p-1 animate-[hero-fade-up_0.2s_ease-out]"
        >
          {options.map(o => {
            const active = o.value === value
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  role="option"
                  aria-selected={active}
                  className={[
                    'w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition',
                    active ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <span className={active ? 'text-blue-600' : 'text-slate-400'}>{ICONS[o.value] || ICONS.newest}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold">{o.label}</span>
                    {o.hint && <span className="block text-[11px] text-slate-500">{o.hint}</span>}
                  </span>
                  {active && (
                    <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
