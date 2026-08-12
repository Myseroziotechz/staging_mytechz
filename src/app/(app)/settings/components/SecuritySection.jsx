'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const PROVIDER_LABELS = { google: 'Google', email: 'Email Magic Link' }

function clearLocalAuthStorage() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-') || key.startsWith('supabase') || key.startsWith('mytechz')) {
        localStorage.removeItem(key)
      }
    })
  } catch { /* ignore */ }
}

export default function SecuritySection({ email, providers, lastSignInAt }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(null)
  const [error, setError] = useState(null)

  async function handleSignOut(scope) {
    setSigningOut(scope)
    setError(null)
    try {
      await fetch('/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
        redirect: 'manual',
      })
      clearLocalAuthStorage()
      router.push('/')
      router.refresh()
    } catch {
      setError('Could not sign out. Please try again.')
      setSigningOut(null)
    }
  }

  return (
    <SectionCard title="Security" icon={ICON} canEdit={false} error={error}>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Signed in as</p>
          <p className="text-sm text-gray-700">{email}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">Sign-in method{providers.length > 1 ? 's' : ''}</p>
          <div className="flex flex-wrap gap-1.5">
            {providers.map((p) => (
              <span key={p} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                {PROVIDER_LABELS[p] || p}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            MyTechZ uses passwordless sign-in — there&apos;s no password to manage.
          </p>
        </div>

        {lastSignInAt && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">This session</p>
            <p className="text-sm text-gray-700">
              Last signed in {new Date(lastSignInAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleSignOut('local')}
            disabled={!!signingOut}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {signingOut === 'local' ? 'Signing out…' : 'Sign out of this device'}
          </button>
          <button
            type="button"
            onClick={() => handleSignOut('global')}
            disabled={!!signingOut}
            className="px-4 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {signingOut === 'global' ? 'Signing out…' : 'Sign out of all devices'}
          </button>
        </div>
      </div>
    </SectionCard>
  )
}
