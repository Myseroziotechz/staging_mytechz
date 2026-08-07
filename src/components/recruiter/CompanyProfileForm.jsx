'use client'

import { useActionState } from 'react'
import { saveCompanyProfile } from '@/app/recruiter/onboarding/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const COMPANY_SIZES = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '501-1000', label: '501–1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
]

const WORK_MODES = [
  { value: 'office', label: 'Office' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
]

// `initial` is the existing recruiter_profiles row if any; undefined for
// first-time onboarding. Values in `state.values` (last submission) take
// precedence so we don't lose input on validation failure.
export default function CompanyProfileForm({ initial }) {
  const [state, formAction, pending] = useActionState(saveCompanyProfile, {
    error: null,
    fieldErrors: {},
    values: null,
  })

  const v = state?.values || initial || {}
  const fe = state?.fieldErrors || {}

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {state.error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Company Basics</h2>

        <Input
          name="company_name"
          label="Company name"
          defaultValue={v.company_name ?? ''}
          error={fe.company_name}
          required
        />

        <Input
          name="industry"
          label="Industry"
          placeholder="e.g. Software, FinTech, Healthcare"
          defaultValue={v.industry ?? ''}
          error={fe.industry}
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company size
          </label>
          <select
            name="company_size"
            defaultValue={v.company_size ?? ''}
            required
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fe.company_size ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" disabled>
              Select a size
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {fe.company_size && (
            <p className="mt-1 text-sm text-red-600">{fe.company_size}</p>
          )}
        </div>

        <Input
          name="head_office_location"
          label="Head office location"
          placeholder="City, Country"
          defaultValue={v.head_office_location ?? ''}
          error={fe.head_office_location}
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {WORK_MODES.map((m) => {
              const checked = (v.work_mode ?? '') === m.value
              return (
                <label
                  key={m.value}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                    checked
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="work_mode"
                    value={m.value}
                    defaultChecked={checked}
                    className="sr-only"
                  />
                  {m.label}
                </label>
              )
            })}
          </div>
          {fe.work_mode && (
            <p className="mt-1 text-sm text-red-600">{fe.work_mode}</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">About Your Company</h2>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company description
          </label>
          <textarea
            name="company_description"
            rows={5}
            minLength={50}
            defaultValue={v.company_description ?? ''}
            placeholder="A short paragraph candidates will see on your job posts."
            required
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fe.company_description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
          {fe.company_description ? (
            <p className="mt-1 text-sm text-red-600">{fe.company_description}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">At least 50 characters.</p>
          )}
        </div>

        <Input
          name="company_website"
          label="Company website (optional)"
          type="url"
          placeholder="https://"
          defaultValue={v.company_website ?? ''}
          error={fe.company_website}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Verification (optional)</h2>
        <p className="text-sm text-gray-500 -mt-2">
          Providing these helps us verify your company faster. You can add them later.
        </p>

        <Input
          name="gst_or_cin"
          label="GST or CIN"
          defaultValue={v.gst_or_cin ?? ''}
          error={fe.gst_or_cin}
        />
      </section>

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? 'Saving…' : initial ? 'Save changes' : 'Complete setup'}
        </Button>
      </div>
    </form>
  )
}
