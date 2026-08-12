'use client'

import { useState, useRef, useEffect } from 'react'

const FORMATS = [
  { key: 'pdf', label: 'PDF', description: 'Best for applications' },
  { key: 'print', label: 'Print', description: 'Open your browser\'s print dialog' },
  { key: 'docx', label: 'DOCX', description: 'Editable Word document' },
]

/**
 * Same shell/behaviour as the resume builder's ExportDropdown, scoped to the
 * three formats the cover letter spec actually asks for (PDF, Print, DOCX —
 * no PNG/JPG/SVG). Kept as its own small component instead of adding a
 * `formats` prop to the resume one, to avoid touching resume-builder files.
 */
export default function CoverLetterExportDropdown({ onExport, disabled = false }) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleExport(format) {
    setExporting(format)
    setOpen(false)
    try {
      await onExport(format)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled || !!exporting}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        {exporting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {exporting === 'print' ? 'Preparing…' : `Exporting ${exporting.toUpperCase()}...`}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.key}
              onClick={() => handleExport(fmt.key)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div>
                <div className="text-sm font-medium text-slate-800">{fmt.label}</div>
                <div className="text-xs text-slate-500">{fmt.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
