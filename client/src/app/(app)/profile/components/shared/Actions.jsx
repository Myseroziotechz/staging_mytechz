'use client'

import { Spinner } from './Feedback'

/** Save + Cancel pair that closes every section's edit mode. */
export function EditActions({ onSave, onCancel, saving, saveLabel = 'Save', disabled }) {
  return (
    <div className="flex items-center gap-3 pt-4 mt-1 border-t border-gray-200">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || disabled}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
      >
        {saving && <Spinner />}
        {saving ? 'Saving…' : saveLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-60 transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

export function AddButton({ onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {children}
    </button>
  )
}

/**
 * The bordered container for one editable record, with its Delete control.
 * Standardises the label ("Delete", not a mix of Delete/Remove) across sections.
 */
export function EntryCard({ label, onDelete, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
      {children}
    </div>
  )
}

/** Small pill used for skills, languages and project tech tags in view mode. */
export function Chip({ children, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tones[tone] ?? tones.blue}`}
    >
      {children}
    </span>
  )
}
