'use client'

import { useActionState, useState } from 'react'
import { saveProfile } from './actions'

const INITIAL = { ok: false, error: null }

export default function ProfileForm({ defaultValues }) {
  const [state, formAction, pending] = useActionState(saveProfile, INITIAL)
  const [skillInput, setSkillInput] = useState(defaultValues.skills || '')

  const pills = skillInput
    ? skillInput.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <form action={formAction} className="space-y-6">
      {/* Status banner */}
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

      {/* Personal Info */}
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
            placeholder="Naresh Raja"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="location"
            defaultValue={defaultValues.location}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bengaluru"
          />
        </div>
      </section>

      {/* Professional */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Professional</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Headline
            <span className="ml-1 text-xs text-gray-400 font-normal">(max 120 chars)</span>
          </label>
          <input
            type="text"
            name="headline"
            defaultValue={defaultValues.headline}
            maxLength={120}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Frontend Dev | React | Open to opportunities"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input
            type="url"
            name="linkedin_url"
            defaultValue={defaultValues.linkedin_url}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/your-profile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
            <span className="ml-1 text-xs text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="React, Node.js, TypeScript"
          />
          {pills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
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
