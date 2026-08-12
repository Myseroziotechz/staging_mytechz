'use client'

import { useId } from 'react'

/**
 * Boolean toggle switch. No equivalent exists in the shared component set
 * (only `CheckboxField` in the profile section — see
 * src/app/(app)/profile/components/shared/Fields.jsx) but the Settings page
 * needs ~11 on/off preferences (visibility + notifications), where a switch
 * reads more clearly than a checkbox at a glance.
 */
export default function Switch({ checked, onChange, label, description, disabled = false }) {
  const id = useId()

  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-gray-800 cursor-pointer">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
