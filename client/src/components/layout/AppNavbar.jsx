'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AppNavbar({ user, onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const profileRef = useRef(null)
  const router = useRouter()

  const meta = user?.user_metadata || {}
  const avatar = !imgError ? (meta.avatar_url || meta.picture) : null
  const fullName = meta.full_name || meta.name || user?.email?.split('@')[0] || 'Account'
  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await fetch('/auth/sign-out', { method: 'POST', redirect: 'manual' })
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') || key.startsWith('supabase') || key.startsWith('mytechz')) {
          localStorage.removeItem(key)
        }
      })
    } catch { /* ignore */ }
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center">

      {/* Left zone — logo, aligned with sidebar width */}
      <div className="w-60 shrink-0 flex items-center px-4 border-r border-slate-200 h-full gap-3">
        {/* Hamburger — mobile only */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/Mytechz_logo.png"
            alt="MyTechZ"
            width={120}
            height={36}
            className="h-8 object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>
      </div>

      {/* Right zone — search + actions + profile */}
      <div className="flex-1 flex items-center justify-between px-5 h-full">

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <div className="w-full flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 rounded-xl px-4 py-2 text-sm text-slate-400 transition-colors cursor-pointer">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span>Search jobs, companies…</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-4">

          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-slate-100 transition-colors"
              aria-label="Profile menu"
            >
              <span className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center ring-2 ring-slate-200">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <span>{initials || 'U'}</span>
                )}
              </span>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {fullName}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            <div
              className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                profileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-semibold text-slate-900 truncate">{fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              {/* Links */}
              <div className="p-1.5 space-y-0.5">
                {[
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/profile',   label: 'Profile' },
                  { href: '/settings',  label: 'Settings' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="p-1.5 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
