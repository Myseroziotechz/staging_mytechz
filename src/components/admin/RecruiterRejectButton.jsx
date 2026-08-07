'use client'

import { useActionState } from 'react'
import { rejectRecruiter } from '@/app/admin/recruiters/actions'

export default function RecruiterRejectButton({ userId }) {
  const [state, formAction, pending] = useActionState(rejectRecruiter, {})

  if (state?.success) {
    return (
      <span className="text-xs font-medium text-red-700">Rejected</span>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
      >
        {pending ? 'Rejecting...' : 'Reject'}
      </button>
      {state?.error && (
        <p className="mt-1 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  )
}
