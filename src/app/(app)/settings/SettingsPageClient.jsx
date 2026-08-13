'use client'

import { useEffect, useRef, useState } from 'react'
import AccountSection from './components/AccountSection'
import VisibilitySection from './components/VisibilitySection'
import JobPreferencesSection from './components/JobPreferencesSection'
import NotificationsSection from './components/NotificationsSection'
import SecuritySection from './components/SecuritySection'
import DataPrivacySection from './components/DataPrivacySection'

// Icon paths are copied from each section's own `ICON` const (unchanged
// there) so the overview cards visually match the detail section below,
// just rendered larger inside a colored badge instead of small + gray.
const SECTIONS = [
  {
    key: 'account',
    label: 'Account',
    description: 'Your profile photo, name, and contact details.',
    features: ['Profile photo', 'Name & contact', 'Headline'],
    accent: 'bg-blue-50 text-blue-600',
    path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    key: 'visibility',
    label: 'Profile Visibility',
    description: 'Control what others can see on your public profile.',
    features: ['Public profile', 'Email & phone visibility', 'Search visibility'],
    accent: 'bg-indigo-50 text-indigo-600',
    paths: [
      'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
  {
    key: 'jobPreferences',
    label: 'Job Preferences',
    description: 'Roles, locations, and work preferences used for alerts.',
    features: ['Preferred roles', 'Locations', 'Work mode'],
    accent: 'bg-amber-50 text-amber-600',
    path: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: "Choose what you're notified about and how.",
    features: ['Job alerts', 'Application updates', 'Email & in-app'],
    accent: 'bg-rose-50 text-rose-600',
    path: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  },
  {
    key: 'security',
    label: 'Security',
    description: 'Sign-in methods and active sessions.',
    features: ['Sign-in methods', 'Active sessions', 'Sign out'],
    accent: 'bg-emerald-50 text-emerald-600',
    path: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  },
  {
    key: 'privacy',
    label: 'Data & Privacy',
    description: 'Export your data or delete your account.',
    features: ['Export your data', 'Delete account'],
    accent: 'bg-slate-100 text-slate-600',
    path: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

const HIGHLIGHT_MS = 1800

function SectionIcon({ section, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      {section.paths
        ? section.paths.map((d) => <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />)
        : <path strokeLinecap="round" strokeLinejoin="round" d={section.path} />}
    </svg>
  )
}

export default function SettingsPageClient({ email, profile, settings, providers, lastSignInAt }) {
  const [highlightedKey, setHighlightedKey] = useState(null)
  const overviewRef = useRef(null)
  const sectionRefs = useRef({})
  const highlightTimerRef = useRef(null)

  function scrollToSection(key) {
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setHighlightedKey(key)
    window.history.replaceState(null, '', `#${key}`)

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => setHighlightedKey(null), HIGHLIGHT_MS)
  }

  function scrollToOverview() {
    overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', window.location.pathname)
  }

  // Deep-link support: /settings#security lands on and highlights that
  // section directly, without adding extra browser-history entries (we only
  // ever use replaceState, never pushState).
  useEffect(() => {
    const key = window.location.hash.replace('#', '')
    if (SECTIONS.some((s) => s.key === key)) {
      const id = requestAnimationFrame(() => scrollToSection(key))
      return () => cancelAnimationFrame(id)
    }
  }, [])

  useEffect(() => () => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
  }, [])

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div ref={overviewRef} className="mb-6 scroll-mt-24">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account, visibility, job preferences, notifications, security, and data — all in one place.
        </p>
      </div>

      {/* Overview — 6 section cards, click to jump to the full section below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => scrollToSection(section.key)}
            className="text-left bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${section.accent}`}>
              <SectionIcon section={section} />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">{section.label}</h2>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">{section.description}</p>
            <p className="mt-2 text-[11px] text-gray-400">{section.features.join(' · ')}</p>
          </button>
        ))}
      </div>

      {/* Full sections, always rendered — clicking a card above scrolls here and highlights it */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            id={section.key}
            ref={(el) => (sectionRefs.current[section.key] = el)}
            className={`scroll-mt-24 rounded-2xl transition-shadow duration-700 ${
              highlightedKey === section.key ? 'ring-2 ring-offset-2 ring-blue-400' : ''
            }`}
          >
            {section.key === 'account' && <AccountSection email={email} initialProfile={profile} />}
            {section.key === 'visibility' && <VisibilitySection initialSettings={settings} />}
            {section.key === 'jobPreferences' && <JobPreferencesSection initialSettings={settings} />}
            {section.key === 'notifications' && <NotificationsSection initialSettings={settings} />}
            {section.key === 'security' && (
              <SecuritySection email={email} providers={providers} lastSignInAt={lastSignInAt} />
            )}
            {section.key === 'privacy' && <DataPrivacySection />}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={scrollToOverview}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
          Back to Settings overview
        </button>
      </div>
    </div>
  )
}
