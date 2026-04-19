'use client'

import { useActionState } from 'react'
import { verifyRecruiter } from '@/app/admin/recruiters/actions'

export default function RecruiterVerifyButton({ userId }) {
  const [state, formAction, pending] = useActionState(verifyRecruiter, {})

  if (state?.success) {
    return (
      <span className="text-xs font-medium text-green-700">Verified</span>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
      >
        {pending ? 'Verifying...' : 'Verify'}
      </button>
      {state?.error && (
        <p className="mt-1 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  )
}
