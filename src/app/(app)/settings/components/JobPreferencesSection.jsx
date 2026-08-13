'use client'

import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'
import { EditActions } from '@/app/(app)/profile/components/shared/Actions'
import { TextInput, SelectInput } from '@/app/(app)/profile/components/shared/Fields'
import { Chip } from '@/app/(app)/profile/components/shared/Actions'
import useSettingsForm from '../hooks/useSettingsForm'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)

const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]
const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
]

function toForm(settings) {
  return {
    preferred_roles: (settings?.preferred_roles || []).join(', '),
    preferred_locations: (settings?.preferred_locations || []).join(', '),
    work_mode: settings?.work_mode || '',
    employment_type: settings?.employment_type || '',
  }
}

async function savePreferences(form) {
  const res = await fetch('/api/settings/preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      preferred_roles: form.preferred_roles.split(',').map((s) => s.trim()).filter(Boolean),
      preferred_locations: form.preferred_locations.split(',').map((s) => s.trim()).filter(Boolean),
      work_mode: form.work_mode || null,
      employment_type: form.employment_type || null,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.error || 'Save failed. Please try again.')
    if (data?.fieldErrors) err.fieldErrors = data.fieldErrors
    throw err
  }
  return data.settings
}

export default function JobPreferencesSection({ initialSettings }) {
  const {
    data: settings, form, setField, isEditing, saving, error, successMsg, fieldErrors,
    startEditing, cancelEditing, save,
  } = useSettingsForm({ initialData: initialSettings, toForm, save: savePreferences })

  return (
    <SectionCard
      title="Job Preferences"
      icon={ICON}
      isEditing={isEditing}
      onEdit={startEditing}
      error={error}
      successMsg={successMsg}
    >
      {isEditing ? (
        <div className="space-y-4">
          <TextInput
            label="Preferred Roles"
            hint="comma-separated"
            placeholder="Frontend Engineer, Product Manager"
            value={form.preferred_roles}
            error={fieldErrors.preferred_roles}
            onChange={(e) => setField('preferred_roles', e.target.value)}
          />
          <TextInput
            label="Preferred Locations"
            hint="comma-separated"
            placeholder="Bengaluru, Remote"
            value={form.preferred_locations}
            error={fieldErrors.preferred_locations}
            onChange={(e) => setField('preferred_locations', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput
              label="Work Mode"
              placeholder="Any"
              options={WORK_MODES}
              value={form.work_mode}
              error={fieldErrors.work_mode}
              onChange={(e) => setField('work_mode', e.target.value)}
            />
            <SelectInput
              label="Employment Type"
              placeholder="Any"
              options={EMPLOYMENT_TYPES}
              value={form.employment_type}
              error={fieldErrors.employment_type}
              onChange={(e) => setField('employment_type', e.target.value)}
            />
          </div>
          <EditActions onSave={save} onCancel={cancelEditing} saving={saving} />
        </div>
      ) : (
        <div className="space-y-4">
          <PreferenceRow label="Preferred roles" values={settings?.preferred_roles} />
          <PreferenceRow label="Preferred locations" values={settings?.preferred_locations} />
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
            <dt className="text-xs font-medium text-gray-400 sm:w-32 shrink-0">Work mode</dt>
            <dd className="text-sm text-gray-700">
              {WORK_MODES.find((m) => m.value === settings?.work_mode)?.label || <span className="text-gray-400">Not set</span>}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
            <dt className="text-xs font-medium text-gray-400 sm:w-32 shrink-0">Employment type</dt>
            <dd className="text-sm text-gray-700">
              {EMPLOYMENT_TYPES.find((t) => t.value === settings?.employment_type)?.label || <span className="text-gray-400">Not set</span>}
            </dd>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

function PreferenceRow({ label, values }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
      <dt className="text-xs font-medium text-gray-400 sm:w-32 shrink-0">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {values?.length ? values.map((v) => <Chip key={v} tone="gray">{v}</Chip>) : <span className="text-sm text-gray-400">Not set</span>}
      </dd>
    </div>
  )
}
