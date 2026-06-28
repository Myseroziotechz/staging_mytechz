'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import AppNavbar from './AppNavbar'
import AppSidebar from './AppSidebar'

const SIDEBAR_DEFAULT         = 240
const SIDEBAR_MIN             = 56    // icon-only collapsed
const SIDEBAR_MAX             = 320
const SIDEBAR_ICON_THRESHOLD  = 72    // width below which labels are hidden
const STORAGE_KEY             = 'mytechz_sidebar_width'

export default function AppShell({
  user,
  navItems,
  role      = 'candidate',
  homeHref  = '/dashboard',
  children,
}) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT)
  const [isMounted,    setIsMounted]    = useState(false)

  const isDragging      = useRef(false)
  const dragStartX      = useRef(0)
  const dragStartWidth  = useRef(0)

  // Hydrate persisted width once mounted (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const w = parseInt(saved, 10)
        if (w >= SIDEBAR_MIN && w <= SIDEBAR_MAX) setSidebarWidth(w)
      }
    } catch { /* ignore — private browsing */ }
    setIsMounted(true)
  }, [])

  // ── Resize drag handlers (desktop only) ──────────────────────────────────
  const startResize = useCallback((e) => {
    isDragging.current     = true
    dragStartX.current     = e.clientX
    dragStartWidth.current = sidebarWidth
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [sidebarWidth])

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return
    const delta    = e.clientX - dragStartX.current
    const newWidth = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, dragStartWidth.current + delta))
    setSidebarWidth(newWidth)
  }, [])

  const onPointerUp = useCallback((e) => {
    if (!isDragging.current) return
    isDragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    // If very close to min, snap fully to icon-only
    const finalWidth = sidebarWidth < SIDEBAR_MIN + 12 ? SIDEBAR_MIN : sidebarWidth
    setSidebarWidth(finalWidth)
    try { localStorage.setItem(STORAGE_KEY, String(finalWidth)) } catch { /* ignore */ }
  }, [sidebarWidth])

  // ─────────────────────────────────────────────────────────────────────────
  const iconOnly       = isMounted && sidebarWidth <= SIDEBAR_ICON_THRESHOLD
  const desktopWidth   = isMounted ? sidebarWidth : SIDEBAR_DEFAULT

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Top navigation bar */}
      <AppNavbar
        user={user}
        role={role}
        homeHref={homeHref}
        sidebarWidth={desktopWidth}
        onMenuClick={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 overflow-hidden pt-16">

        {/* ── Mobile backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Desktop sidebar + drag handle ── */}
        <div
          className="hidden lg:block relative shrink-0 h-full"
          style={{ width: desktopWidth }}
        >
          <AppSidebar
            navItems={navItems}
            open={false}
            onClose={() => {}}
            width={desktopWidth}
            iconOnly={iconOnly}
          />

          {/* Drag handle — sits on the right edge of the sidebar */}
          <div
            role="separator"
            aria-label="Resize sidebar"
            className="absolute top-0 right-0 w-3 h-full z-50 cursor-col-resize select-none group flex items-center justify-center"
            onPointerDown={startResize}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* Visual pill that appears on hover / while dragging */}
            <div className="w-0.5 h-12 rounded-full bg-slate-300 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-active:bg-blue-500 transition-all duration-150" />
          </div>
        </div>

        {/* ── Mobile sidebar (fixed overlay) ── */}
        <div className="lg:hidden">
          <AppSidebar
            navItems={navItems}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            width={SIDEBAR_DEFAULT}
            iconOnly={false}
          />
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
