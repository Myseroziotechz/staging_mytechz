'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import MagicLinkSent from '@/components/auth/MagicLinkSent'
import LegalModal from '@/components/auth/LegalModal'

export default function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState(null)
  // 'candidate' | 'recruiter' — admin is never user-selectable
  const [intendedRole, setIntendedRole] = useState('candidate')
  // null | 'terms' | 'privacy'
  const [legalModal, setLegalModal] = useState(null)

  const returnTo = searchParams.get('returnTo') || '/'
  const urlError = searchParams.get('error')

  // Always use the actual browser origin so the OAuth redirect comes back to
  // wherever the user is (localhost, staging, production). The env var is only
  // a fallback for SSR where window is unavailable.
  const siteUrl =
    (typeof window !== 'undefined' ? window.location.origin : null) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Build callback URL with intended_role + returnTo in query params.
  // URL params are the ONLY reliable way to pass data through the
  // Google → Supabase → localhost OAuth redirect chain. Cookies get dropped.
  const buildCallbackUrl = () => {
    const url = new URL('/auth/callback', siteUrl)
    if (intendedRole !== 'candidate') url.searchParams.set('intended_role', intendedRole)
    if (returnTo && returnTo !== '/') url.searchParams.set('returnTo', returnTo)
    return url.toString()
  }

  // Save intended_role in BOTH localStorage and a cookie so the server-side
  // /auth/callback route can read it even if URL params get stripped by Supabase.
  const saveIntentToStorage = () => {
    try {
      localStorage.setItem('mytechz_intended_role', intendedRole)
      localStorage.setItem('mytechz_return_to', returnTo)
    } catch {
      // Private browsing or storage full.
    }
    // Server-readable cookie — 5 minutes is enough for the OAuth round-trip.
    try {
      document.cookie = `mytechz_intended_role=${encodeURIComponent(intendedRole)}; path=/; max-age=300; SameSite=Lax`
      if (returnTo && returnTo !== '/') {
        document.cookie = `mytechz_return_to=${encodeURIComponent(returnTo)}; path=/; max-age=300; SameSite=Lax`
      }
    } catch { /* ignore */ }
  }

  // Magic Link (Email OTP)
  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    saveIntentToStorage()

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          intendedRole,
          redirectTo: buildCallbackUrl(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send magic link')
      }

      setMagicLinkSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth
  const handleGoogleLogin = async () => {
    saveIntentToStorage()
    // Set the intended role via a server-side HttpOnly cookie. Client-side
    // document.cookie is unreliable through the cross-domain OAuth redirect
    // chain (Google → Supabase → localhost). This API call guarantees the
    // cookie reaches /auth/callback.
    try {
      await fetch('/api/auth/set-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: intendedRole }),
      })
    } catch {
      // If the API call fails, the document.cookie fallback is still set.
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildCallbackUrl(),
      },
    })
  }

  if (magicLinkSent) {
    return (
      <MagicLinkSent email={email} onBack={() => setMagicLinkSent(false)} />
    )
  }

  const isRecruiter = intendedRole === 'recruiter'

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-lg font-bold text-gray-900">
          {isRecruiter ? 'Welcome, Recruiter' : 'Welcome back!'}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {isRecruiter
            ? 'Sign in to post jobs and manage candidates'
            : 'Sign in to access your account'}
        </p>
      </div>

      {/* Role toggle */}
      <div
        role="tablist"
        aria-label="Sign in as"
        className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isRecruiter}
          onClick={() => setIntendedRole('candidate')}
          className={`py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            !isRecruiter
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Job Seeker
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isRecruiter}
          onClick={() => setIntendedRole('recruiter')}
          className={`py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            isRecruiter
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recruiter
        </button>
      </div>

      {/* URL Error */}
      {urlError && (
        <div className="p-2.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {urlError === 'auth_failed'
            ? 'Authentication failed. Please try again.'
            : urlError}
        </div>
      )}

      {/* Google OAuth */}
      <GoogleSignInButton onClick={handleGoogleLogin} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-400">or continue with email</span>
        </div>
      </div>

      {/* Email Magic Link Form */}
      <form onSubmit={handleMagicLink} className="space-y-2.5">
        <Input
          type="email"
          placeholder={isRecruiter ? 'Enter your work email' : 'Enter your email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          size="md"
        >
          {loading
            ? 'Sending...'
            : isRecruiter
              ? 'Send Recruiter Magic Link'
              : 'Send Magic Link'}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-2.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Footer text */}
      <p className="text-center text-[11px] text-gray-400">
        By signing in, you agree to our{' '}
        <button
          type="button"
          onClick={() => setLegalModal('terms')}
          className="underline text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
        {' '}and{' '}
        <button
          type="button"
          onClick={() => setLegalModal('privacy')}
          className="underline text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        .
      </p>

      {/* Legal modals */}
      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </div>
  )
}
