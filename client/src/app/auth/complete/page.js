'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

// This page is now a FALLBACK only. The primary role-assignment and redirect
// happens server-side in /auth/callback/route.js. This page handles edge cases
// where the callback couldn't determine the role (e.g. RPC failed) and the
// user lands here with an already-valid session.

function Spinner({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  )
}

function AuthCompleteInner() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Setting up your account...')

  useEffect(() => {
    async function initializeAndRedirect() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          router.replace('/auth/error?reason=auth_failed')
          return
        }

        // Read intended_role from localStorage (last resort).
        let intendedRole = searchParams.get('intended_role') || null
        if (!intendedRole) {
          try {
            intendedRole = localStorage.getItem('mytechz_intended_role') || null
            localStorage.removeItem('mytechz_intended_role')
            localStorage.removeItem('mytechz_return_to')
          } catch { /* ignore */ }
        }

        // Try the RPC one more time from the client
        let role = null
        let onboardingCompleted = false

        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'initialize_session',
          { p_intended_role: intendedRole }
        )

        if (!rpcError && rpcData) {
          const row = Array.isArray(rpcData) ? rpcData[0] : rpcData
          if (row) {
            role = row.role
            onboardingCompleted = Boolean(row.onboarding_completed)
          }
        }

        // Fallback: direct query
        if (!role) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, onboarding_completed')
            .eq('id', user.id)
            .maybeSingle()

          role = profile?.role || 'candidate'
          onboardingCompleted = Boolean(profile?.onboarding_completed)
        }

        // Redirect
        let destination = '/dashboard'
        if (role === 'admin') destination = '/admin/dashboard'
        else if (role === 'recruiter') destination = onboardingCompleted ? '/recruiter/dashboard' : '/recruiter/onboarding'

        setStatus('Welcome! Redirecting...')
        router.replace(destination)
      } catch (err) {
        console.error('[auth/complete] error:', err)
        router.replace('/auth/error?reason=auth_failed')
      }
    }

    initializeAndRedirect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner text={status} />
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={<Spinner text="Loading..." />}>
      <AuthCompleteInner />
    </Suspense>
  )
}
