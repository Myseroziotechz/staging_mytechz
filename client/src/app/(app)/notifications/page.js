'use client'

import { useState, useEffect, useCallback } from 'react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all') // 'all' | 'unread'

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.ok ? r.json() : { notifications: [] })
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const markRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' }).catch(() => {})
  }, [])

  const remove = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    await fetch('/api/notifications/mark-all-read', { method: 'POST' }).catch(() => {})
  }, [])

  const clearAll = useCallback(async () => {
    const ids = notifications.map((n) => n.id)
    setNotifications([])
    await Promise.all(
      ids.map((id) => fetch(`/api/notifications/${id}`, { method: 'DELETE' }).catch(() => {}))
    )
  }, [notifications])

  const visible = filter === 'unread'
    ? notifications.filter((n) => !n.is_read)
    : notifications

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'all',    label: 'All' },
          { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="w-6 h-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm font-medium">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visible.map((n) => (
              <div
                key={n.id}
                className={`group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-50 ${
                  n.is_read ? '' : 'bg-blue-50/40'
                }`}
              >
                {/* Unread indicator */}
                <div className="mt-1.5 shrink-0">
                  <span className={`block w-2 h-2 rounded-full ${n.is_read ? 'bg-gray-200' : 'bg-blue-500'}`} />
                </div>

                {/* Content — click to mark read */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => !n.is_read && markRead(n.id)}
                >
                  <p className={`text-sm leading-snug ${n.is_read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.body}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">{formatRelTime(n.created_at)}</p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.is_read && (
                    <button
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                      className="w-7 h-7 rounded-lg hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => remove(n.id)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg hover:bg-rose-100 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
