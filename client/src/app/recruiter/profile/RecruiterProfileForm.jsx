'use client'

import { useActionState } from 'react'
import { saveRecruiterPersonalProfile } from './actions'

const INITIAL = { ok: false, error: null }

export default function RecruiterProfileForm({ defaultValues }) {
  const [state, formAction, pending] = useActionState(saveRecruiterPersonalProfile, INITIAL)

  return (
    <form action={formAction} className="space-y-6">
      {state?.ok && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-800">
          Profile saved successfully.
        </div>
      )}
      {state?.error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            defaultValue={defaultValues.full_name}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={defaultValues.phone}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+91 9876543210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            defaultValue={defaultValues.designation}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="HR Manager, Talent Acquisition Lead…"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {pending ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
