'use client'

import { useActionState } from 'react'
import { removeAdminEmail } from '@/app/admin/whitelist/actions'

export default function RemoveAdminEmailButton({ email }) {
  const [state, formAction, pending] = useActionState(removeAdminEmail, {
    error: null,
  })

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`Remove ${email} from the admin whitelist?`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        title={state?.error || 'Remove from whitelist'}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-40 cursor-pointer"
      >
        {pending ? 'Removing…' : 'Remove'}
      </button>
    </form>
  )
}
