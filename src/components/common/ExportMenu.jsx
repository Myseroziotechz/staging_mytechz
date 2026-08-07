'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const FORMATS = [
  { key: 'csv', label: 'Download CSV', ext: '.csv' },
  { key: 'docx', label: 'Download DOCX', ext: '.docx' },
  { key: 'pdf', label: 'Download PDF', ext: '.pdf' },
]

// scope: 'jobs' | 'applications' | 'my-applicants' | 'users'
export default function ExportMenu({ scope, label = 'Export', extraParams }) {
  const [open, setOpen] = useState(false)
  const sp = useSearchParams()
  const ref = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function buildHref(format) {
    const params = new URLSearchParams(sp.toString())
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        if (v) params.set(k, v)
      }
    }
    params.set('format', format)
    return `/api/exports/${scope}?${params.toString()}`
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5 text-slate-700"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        {label}
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 right-0 mt-1 w-44 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          {FORMATS.map((f) => (
            <a
              key={f.key}
              href={buildHref(f.key)}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{f.label}</span>
              <span className="text-[10px] text-slate-400">{f.ext}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
