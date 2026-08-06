'use client'

import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'
import Switch from '@/components/ui/Switch'
import useInstantPreferences from '../hooks/useInstantPreferences'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
)

export default function NotificationsSection({ initialSettings }) {
  const { settings, update, error } = useInstantPreferences(initialSettings)

  return (
    <SectionCard title="Notifications" icon={ICON} canEdit={false} error={error}>
      <p className="text-xs text-gray-500 mb-2">What you're notified about</p>
      <div className="divide-y divide-gray-100 mb-4">
        <Switch
          label="Job alerts"
          description="New job postings matching your preferences."
          checked={settings.notify_job_alerts}
          onChange={(v) => update('notify_job_alerts', v)}
        />
        <Switch
          label="Application status updates"
          description="When a recruiter updates the status of your application."
          checked={settings.notify_application_updates}
          onChange={(v) => update('notify_application_updates', v)}
        />
        <Switch
          label="Saved job reminders"
          description="Reminders about jobs you've saved but haven't applied to."
          checked={settings.notify_saved_job_reminders}
          onChange={(v) => update('notify_saved_job_reminders', v)}
        />
        <Switch
          label="Profile completion reminders"
          description="Tips to help you finish setting up your profile."
          checked={settings.notify_profile_reminders}
          onChange={(v) => update('notify_profile_reminders', v)}
        />
        <Switch
          label="Product & news updates"
          description="New features and occasional announcements from MyTechZ."
          checked={settings.notify_product_updates}
          onChange={(v) => update('notify_product_updates', v)}
        />
      </div>

      <p className="text-xs text-gray-500 mb-2 pt-2 border-t border-gray-100">How you're notified</p>
      <div className="divide-y divide-gray-100">
        <Switch
          label="Email notifications"
          description="Receive the notifications above by email."
          checked={settings.email_notifications_enabled}
          onChange={(v) => update('email_notifications_enabled', v)}
        />
        <Switch
          label="In-app notifications"
          description="Receive the notifications above in your notification bell."
          checked={settings.in_app_notifications_enabled}
          onChange={(v) => update('in_app_notifications_enabled', v)}
        />
      </div>
    </SectionCard>
  )
}
