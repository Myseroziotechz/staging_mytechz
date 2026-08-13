'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addAdminEmail } from '@/app/admin/whitelist/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AddAdminEmailForm() {
  const formRef = useRef(null)
  const [state, formAction, pending] = useActionState(addAdminEmail, {
    error: null,
    success: null,
    values: null,
  })

  // Clear the inputs after a successful add so the next entry starts fresh.
  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state?.success])

  const v = state?.values || {}

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
        <Input
          name="email"
          type="email"
          placeholder="email@company.com"
          defaultValue={v.email ?? ''}
          required
        />
        <Input
          name="note"
          type="text"
          placeholder="Note (optional)"
          defaultValue={v.note ?? ''}
        />
        <Button type="submit" disabled={pending} size="md">
          {pending ? 'Adding…' : 'Add admin'}
        </Button>
      </div>

      {state?.error && (
        <div className="p-2.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-2.5 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
          {state.success}
        </div>
      )}
    </form>
  )
}
