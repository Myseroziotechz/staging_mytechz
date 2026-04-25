'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function NewsletterSubscribe() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchStatus() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      setUser(authUser)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_subscribed')
        .eq('id', authUser.id)
        .maybeSingle()

      if (profile) {
        setRole(profile.role)
        setIsSubscribed(Boolean(profile.is_subscribed))
      }
    }

    fetchStatus()
  }, [])

  const handleToggle = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)

    const newValue = !isSubscribed

    const { error } = await supabase
      .from('user_profiles')
      .update({ is_subscribed: newValue, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' })
    } else {
      setIsSubscribed(newValue)
      setMessage({
        type: 'success',
        text: newValue ? 'You are now subscribed!' : 'You have been unsubscribed.',
      })
      setTimeout(() => setMessage(null), 3000)
    }

    setLoading(false)
  }

  // Only show subscribe for candidates (not recruiter/admin)
  const isCandidate = user && role === 'candidate'

  // Not logged in — show static input that links to login
  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 md:w-72 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
          readOnly
          onFocus={(e) => {
            e.target.blur()
            window.location.href = '/login'
          }}
        />
        <a
          href="/login"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap shadow-lg text-center"
        >
          Subscribe
        </a>
      </div>
    )
  }

  // Logged in but not a candidate — don't show subscribe
  if (!isCandidate) {
    return null
  }

  // Candidate — show toggle
  return (
    <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
      {isSubscribed ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium text-white border border-white/20">
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Subscribed
          </span>
          <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-blue-200 border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Unsubscribe'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap shadow-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      )}

      {message && (
        <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
