'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import MagicLinkSent from '@/components/auth/MagicLinkSent'

export default function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState(null)
  // 'candidate' | 'recruiter' — admin is never user-selectable
  const [intendedRole, setIntendedRole] = useState('candidate')

  const returnTo = searchParams.get('returnTo') || '/'
  const urlError = searchParams.get('error')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  // Persist returnTo + intended role across the OAuth / magic-link redirect.
  const saveIntent = () => {
    document.cookie = `return-to=${returnTo}; max-age=600; path=/`
    document.cookie = `intended_role=${intendedRole}; max-age=600; path=/; samesite=lax`
  }

  // Magic Link (Email OTP) — intended_role rides in the request body so the
  // send-otp route can pass it to Supabase options.data, which lands in
  // raw_user_meta_data and is read by the handle_new_user() trigger.
  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    saveIntent()

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          intendedRole,
          redirectTo: `${origin}/auth/callback`,
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

  // Google OAuth — provider ignores custom user metadata, so the cookie is the
  // only way intended_role survives the round-trip. The auth callback reads it.
  const handleGoogleLogin = async () => {
    saveIntent()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isRecruiter ? 'Welcome, Recruiter' : 'Welcome to MyTechZ'}
        </h1>
        <p className="mt-2 text-gray-500">
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
          className={`py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
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
          className={`py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
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
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
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
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">or continue with email</span>
        </div>
      </div>

      {/* Email Magic Link Form */}
      <form onSubmit={handleMagicLink} className="space-y-4">
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
          size="lg"
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
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Footer text */}
      <p className="text-center text-xs text-gray-400">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
