'use client'

import { useState } from 'react'
import AccountSection from './components/AccountSection'
import VisibilitySection from './components/VisibilitySection'
import JobPreferencesSection from './components/JobPreferencesSection'
import NotificationsSection from './components/NotificationsSection'
import SecuritySection from './components/SecuritySection'
import DataPrivacySection from './components/DataPrivacySection'

const TABS = [
  { key: 'account', label: 'Account' },
  { key: 'visibility', label: 'Profile Visibility' },
  { key: 'jobPreferences', label: 'Job Preferences' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'security', label: 'Security' },
  { key: 'privacy', label: 'Data & Privacy' },
]

export default function SettingsPageClient({ email, profile, settings, providers, lastSignInAt }) {
  const [active, setActive] = useState('account')

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account, preferences, and privacy.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Nav — sticky left column on desktop, horizontal scroll on mobile */}
        <nav className="sm:w-52 shrink-0">
          <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 sm:sticky sm:top-20">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={`shrink-0 text-left px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  active === tab.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          {active === 'account' && <AccountSection email={email} initialProfile={profile} />}
          {active === 'visibility' && <VisibilitySection initialSettings={settings} />}
          {active === 'jobPreferences' && <JobPreferencesSection initialSettings={settings} />}
          {active === 'notifications' && <NotificationsSection initialSettings={settings} />}
          {active === 'security' && (
            <SecuritySection email={email} providers={providers} lastSignInAt={lastSignInAt} />
          )}
          {active === 'privacy' && <DataPrivacySection />}
        </div>
      </div>
    </div>
  )
}
