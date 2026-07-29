'use client'

const TONES = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
}

export function Alert({ tone = 'info', className = '', children }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${TONES[tone] ?? TONES.info} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Shown in view mode when a section has no saved records yet.
 * Doubles as the entry point into edit mode so an empty profile is never a
 * dead end.
 */
export function EmptyState({ message, actionLabel, onAction, icon }) {
  return (
    <div className="py-8 text-center">
      {icon && <div className="mx-auto mb-3 text-gray-300">{icon}</div>}
      <p className="text-sm text-gray-400">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
