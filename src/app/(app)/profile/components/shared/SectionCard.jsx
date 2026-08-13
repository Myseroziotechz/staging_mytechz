'use client'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Alert } from './Feedback'

/**
 * The card shell every profile section sits in.
 *
 * Replaces the four near-identical `SectionCard` copies that had drifted
 * between section files. Owns the header, the Edit affordance, the loading
 * state and the success/error banners so sections only render their content.
 */
export default function SectionCard({
  title,
  subtitle,
  icon,
  loading = false,
  isEditing = false,
  canEdit = true,
  onEdit,
  error,
  successMsg,
  children,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 scroll-mt-24">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>

        {!isEditing && !loading && canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {successMsg && <Alert tone="success" className="mb-4">{successMsg}</Alert>}

      {loading ? (
        <div className="py-10">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        children
      )}
    </section>
  )
}
