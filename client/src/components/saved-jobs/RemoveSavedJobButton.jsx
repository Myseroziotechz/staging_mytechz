'use client'

import { useActionState } from 'react'
import { removeSavedJob } from '@/app/saved-jobs/actions'

export default function RemoveSavedJobButton({ jobId }) {
  const [state, formAction, pending] = useActionState(removeSavedJob, {})

  if (state?.success) return null

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="id" value={jobId} />
      <button
        type="submit"
        disabled={pending}
        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        title="Remove saved job"
      >
        {pending ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
      {state?.error && (
        <p className="text-xs text-red-600 mt-1">{state.error}</p>
      )}
    </form>
  )
}
