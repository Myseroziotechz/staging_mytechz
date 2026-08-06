'use client'

import { useSaveToggle } from '@/lib/hooks/useSaveToggle'

const BOOKMARK = (filled) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.5A1.5 1.5 0 016.5 3h11A1.5 1.5 0 0119 4.5V21l-7-4-7 4V4.5z" />
  </svg>
)

// Standalone save/unsave control for the job detail page's action bar —
// reuses the same useSaveToggle hook as JobCard's icon-only bookmark so the
// optimistic-update, auth-redirect and error-handling logic lives in one
// place, just rendered with a label here instead of icon-only.
export default function SaveJobButton({ jobUrl, jobTitle, companyName, initialSaved = false, className = '' }) {
  const { saved, pending, error, toggle } = useSaveToggle({ jobUrl, jobTitle, companyName, initialSaved })

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={saved}
        className={[
          'inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait',
          saved
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        ].join(' ')}
      >
        {BOOKMARK(saved)}
        {saved ? 'Saved' : 'Save'}
      </button>
      {error && (
        <div
          role="alert"
          className="absolute left-0 top-full mt-1.5 z-10 w-max max-w-[220px] text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 shadow-sm"
        >
          {error}
        </div>
      )}
    </div>
  )
}
