'use client'

import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'
import Switch from '@/components/ui/Switch'
import useInstantPreferences from '../hooks/useInstantPreferences'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function VisibilitySection({ initialSettings }) {
  const { settings, update, error } = useInstantPreferences(initialSettings)

  return (
    <SectionCard title="Profile Visibility" icon={ICON} canEdit={false} error={error}>
      <div className="divide-y divide-gray-100">
        <Switch
          label="Public profile"
          description="Recruiters can find and view your profile in search."
          checked={settings.profile_public}
          onChange={(v) => update('profile_public', v)}
        />
        <Switch
          label="Show email on profile"
          description="Your email is visible to recruiters viewing your profile."
          checked={settings.show_email}
          onChange={(v) => update('show_email', v)}
          disabled={!settings.profile_public}
        />
        <Switch
          label="Show phone number on profile"
          description="Your phone number is visible to recruiters viewing your profile."
          checked={settings.show_phone}
          onChange={(v) => update('show_phone', v)}
          disabled={!settings.profile_public}
        />
        <Switch
          label="Search engine visibility"
          description="Allow your public profile to be indexed by search engines like Google."
          checked={settings.searchable}
          onChange={(v) => update('searchable', v)}
          disabled={!settings.profile_public}
        />
      </div>
    </SectionCard>
  )
}
