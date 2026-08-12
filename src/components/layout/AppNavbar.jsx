'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import { AVATAR_UPDATED_EVENT } from '@/lib/avatar-events'

const ROLE_LABELS = {
  admin:     { label: 'Admin',      color: 'bg-rose-100 text-rose-700' },
  recruiter: { label: 'Recruiter',  color: 'bg-violet-100 text-violet-700' },
  candidate: { label: 'Job Seeker', color: 'bg-blue-100 text-blue-700' },
}

// ─── Notifications dropdown ───────────────────────────────────────────────────
function NotificationsDropdown() {
  const [open,          setOpen]          = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch when opened
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/notifications')
      .then((r) => r.ok ? r.json() : { notifications: [] })
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [open])

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
    )
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' }).catch(() => {})
  }, [])

  const remove = useCallback(async (id, e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 z-50 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={async () => {
                setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
                await fetch('/api/notifications/mark-all-read', { method: 'POST' }).catch(() => {})
              }}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-xs font-medium">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                  n.is_read ? '' : 'bg-blue-50/60'
                }`}
              >
                {/* Unread dot */}
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-blue-500'}`} />
                {(() => {
                  const Wrapper = n.link ? Link : 'div'
                  const wrapperProps = n.link ? { href: n.link } : {}
                  return (
                    <Wrapper
                      {...wrapperProps}
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        if (!n.is_read) markRead(n.id)
                        if (n.link) setOpen(false)
                      }}
                    >
                      <p className={`text-xs font-semibold text-slate-800 leading-snug ${n.is_read ? 'font-medium text-slate-600' : ''}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">{formatRelTime(n.created_at)}</p>
                    </Wrapper>
                  )
                })()}
                {/* Delete */}
                <button
                  onClick={(e) => remove(n.id, e)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg hover:bg-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-500"
                  aria-label="Delete notification"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-slate-50 transition-colors"
          >
            See all notifications
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function formatRelTime(ts) {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)  return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function AppNavbar({
  user,
  role         = 'candidate',
  homeHref     = '/dashboard',
  avatarUrl    = null,
  sidebarWidth = 240,
  onMenuClick,
}) {
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [customAvatar,  setCustomAvatar]  = useState(avatarUrl)
  const [switchingRole, setSwitchingRole] = useState(null)
  const profileRef = useRef(null)
  const router     = useRouter()

  const meta     = user?.user_metadata || {}
  // A custom upload wins over the OAuth-provider photo.
  const avatar   = customAvatar || meta.avatar_url || meta.picture || null
  const fullName = meta.full_name || meta.name || user?.email?.split('@')[0] || 'Account'

  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.candidate

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Reflect a Settings-page avatar save immediately, without a page refresh.
  useEffect(() => {
    const handler = (e) => setCustomAvatar(e.detail?.avatarUrl ?? null)
    window.addEventListener(AVATAR_UPDATED_EVENT, handler)
    return () => window.removeEventListener(AVATAR_UPDATED_EVENT, handler)
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

  const handleSwitchRole = async (newRole) => {
    setSwitchingRole(newRole)
    try {
      const res  = await fetch('/api/auth/switch-role', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role: newRole }),
      })
      const json = await res.json()
      if (!res.ok) { console.error('Role switch failed:', json.error); return }
      setProfileOpen(false)
      router.push(json.redirectTo)
      router.refresh()
    } finally {
      setSwitchingRole(null)
    }
  }

  const switchOptions = []
  if (role === 'admin') {
    switchOptions.push({ to: 'recruiter', label: 'Switch to Recruiter' })
    switchOptions.push({ to: 'candidate', label: 'Switch to Job Seeker' })
  } else if (role === 'recruiter') {
    switchOptions.push({ to: 'candidate', label: 'Switch to Job Seeker' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center">

      {/* Mobile left zone — hamburger + logo, auto width */}
      <div className="lg:hidden shrink-0 flex items-center px-3 h-full gap-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href={homeHref} className="flex items-center min-w-0">
          <Image
            src="/Mytechz_logo.png"
            alt="MyTechZ"
            width={100}
            height={30}
            className="h-7 object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>
      </div>

      {/* Desktop left zone — width syncs with resizable sidebar */}
      <div
        className="hidden lg:flex shrink-0 items-center px-4 border-r border-slate-200 h-full"
        style={{ width: sidebarWidth }}
      >
        <Link href={homeHref} className="flex items-center min-w-0">
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

      {/* Right zone — spacer + actions + profile */}
      <div className="flex-1 flex items-center justify-end px-3 sm:px-5 h-full gap-1.5 sm:gap-2">

        {/* Notifications */}
        <NotificationsDropdown />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 sm:gap-2.5 rounded-xl px-2 sm:px-2.5 py-1.5 hover:bg-slate-100 transition-colors"
            aria-label="Profile menu"
          >
            <Avatar src={avatar} name={fullName} size="sm" className="ring-2 ring-slate-200" />
            <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
              {fullName}
            </span>
            <svg
              className={`hidden sm:block w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 z-50 ${
              profileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {/* User info + role badge */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 truncate">{fullName}</p>
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Nav links */}
            <div className="p-1.5 space-y-0.5">
              {[
                { href: homeHref,    label: 'Home' },
                { href: '/profile',  label: 'Profile' },
                { href: '/settings', label: 'Settings' },
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

            {/* Role switcher — only for admin / recruiter */}
            {switchOptions.length > 0 && (
              <div className="p-1.5 border-t border-slate-100 space-y-0.5">
                <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Switch Role</p>
                {switchOptions.map((opt) => (
                  <button
                    key={opt.to}
                    onClick={() => handleSwitchRole(opt.to)}
                    disabled={!!switchingRole}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {switchingRole === opt.to ? (
                      <svg className="w-3.5 h-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Sign out */}
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
    </header>
  )
}
