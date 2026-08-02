'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import LegalModal from '@/components/auth/LegalModal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// defaultRole: 'candidate' | 'recruiter' — when set, locks the role and hides the role selector
export default function LoginForm({ defaultRole = null }) {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // 'candidate' | 'recruiter' — admin is never user-selectable
  const [intendedRole, setIntendedRole] = useState(defaultRole ?? 'candidate')
  // null | 'terms' | 'privacy'
  const [legalModal, setLegalModal] = useState(null)

  const [email, setEmail] = useState('')
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [magicLinkSentTo, setMagicLinkSentTo] = useState(null)

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

  // Google OAuth
  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
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

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildCallbackUrl(),
      },
    })

    // On success the browser navigates away to Google immediately, so this
    // only ever runs when signInWithOAuth failed before the redirect fired
    // (e.g. Supabase project misconfigured, network error).
    if (oauthError) {
      setError(oauthError.message || 'Could not start Google sign-in. Please try again.')
      setLoading(false)
    }
  }

  // Email Magic Link
  const handleMagicLink = async (e) => {
    e.preventDefault()
    setError(null)
    setMagicLinkSentTo(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setMagicLinkLoading(true)
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, intendedRole, returnTo }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || 'We could not send the login link. Please try again.')
      } else {
        setMagicLinkSentTo(trimmedEmail)
      }
    } catch {
      setError('Server unavailable. Please check your connection and try again.')
    } finally {
      setMagicLinkLoading(false)
    }
  }

  const isRecruiter = intendedRole === 'recruiter'

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-lg font-bold text-gray-900">
          {isRecruiter ? 'Recruiter Sign In' : 'Welcome back!'}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {isRecruiter
            ? 'Post jobs, search talent & manage applications'
            : 'Sign in to find your next tech opportunity'}
        </p>
      </div>

      {/* Role selector — hidden when defaultRole is locked */}
      {!defaultRole && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">I am a</p>
      )}

      {/* Role selection cards — only shown when role is not pre-set */}
      {!defaultRole && (
      <div role="tablist" aria-label="Sign in as" className="grid grid-cols-2 gap-2">
        {/* Job Seeker card */}
        <button
          type="button"
          role="tab"
          aria-selected={!isRecruiter}
          onClick={() => setIntendedRole('candidate')}
          className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
            !isRecruiter
              ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {/* Selected indicator */}
          {!isRecruiter && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          {/* Icon */}
          <span className={`w-6 h-6 flex items-center justify-center ${!isRecruiter ? 'text-blue-600' : 'text-gray-400'}`}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span className={`text-xs font-bold tracking-wide ${!isRecruiter ? 'text-blue-700' : 'text-gray-500'}`}>
            Job Seeker
          </span>
          <span className={`text-[10px] text-center leading-tight ${!isRecruiter ? 'text-blue-500' : 'text-gray-400'}`}>
            Find & apply for jobs
          </span>
        </button>

        {/* Recruiter card */}
        <button
          type="button"
          role="tab"
          aria-selected={isRecruiter}
          onClick={() => setIntendedRole('recruiter')}
          className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
            isRecruiter
              ? 'border-violet-500 bg-violet-50 shadow-sm shadow-violet-100'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {/* Selected indicator */}
          {isRecruiter && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          {/* Icon */}
          <span className={`w-6 h-6 flex items-center justify-center ${isRecruiter ? 'text-violet-600' : 'text-gray-400'}`}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2m-6 4h2m4 0h2" />
            </svg>
          </span>
          <span className={`text-xs font-bold tracking-wide ${isRecruiter ? 'text-violet-700' : 'text-gray-500'}`}>
            Recruiter
          </span>
          <span className={`text-[10px] text-center leading-tight ${isRecruiter ? 'text-violet-500' : 'text-gray-400'}`}>
            Post jobs & hire talent
          </span>
        </button>
      </div>
      )}

      {/* URL Error */}
      {urlError && (
        <div className="p-2.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {urlError === 'auth_failed'
            ? 'Authentication failed. Please try again.'
            : urlError}
        </div>
      )}

      {/* Email Magic Link */}
      {magicLinkSentTo ? (
        <div className="p-2.5 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 space-y-1.5">
          <p>Check your inbox. We&apos;ve sent a secure login link to <strong>{magicLinkSentTo}</strong>.</p>
          <button
            type="button"
            onClick={() => setMagicLinkSentTo(null)}
            className="text-xs font-semibold underline text-green-700 hover:text-green-800 cursor-pointer"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-2" noValidate>
          <label htmlFor="login-email" className="sr-only">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={magicLinkLoading || loading}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={magicLinkLoading || loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {magicLinkLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 py-0.5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google OAuth */}
      <GoogleSignInButton onClick={handleGoogleLogin} disabled={loading || magicLinkLoading} />

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
