'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_NAV } from '@/config/navigation'


// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon Map
// ─────────────────────────────────────────────────────────────────────────────
function Icon({ name, className = 'w-5 h-5' }) {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
      </svg>
    ),
    briefcase: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    sparkles: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    contact: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    list: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    building: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2m-6 4h2m4 0h2" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    academic: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    document: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    bookmark: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    mail: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    chevronDown: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  }
  return icons[name] || null
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual nav link
// ─────────────────────────────────────────────────────────────────────────────
function NavLink({ href, icon, label, isChild = false }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && href !== '/recruiter/dashboard' && href !== '/admin/dashboard' && pathname?.startsWith(href + '/'))

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-xl transition-all duration-150
        ${isChild ? 'py-2 px-3 text-xs' : 'py-2.5 px-3 text-sm font-medium'}
        ${isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <span className={`shrink-0 ${isChild ? 'w-4 h-4' : 'w-5 h-5'}`}>
        <Icon name={icon} className={isChild ? 'w-4 h-4' : 'w-5 h-5'} />
      </span>
      <span className="truncate">{label}</span>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Category with collapsible children
// defaultOpen: true → always starts expanded
// ─────────────────────────────────────────────────────────────────────────────
function NavCategory({ item }) {
  const pathname = usePathname()
  const isAnyChildActive = item.children?.some(
    (c) => pathname === c.href || pathname?.startsWith(c.href + '/')
  ) ?? false

  // Start open if defaultOpen flag is set OR if a child is currently active
  const [open, setOpen] = useState(item.defaultOpen === true || isAnyChildActive)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium
          transition-all duration-150
          ${isAnyChildActive
            ? 'text-blue-700 bg-blue-50'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }
        `}
      >
        <span className="shrink-0 w-5 h-5">
          <Icon name={item.icon} />
        </span>
        <span className="flex-1 truncate text-left">{item.label}</span>
        <span className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Icon name="chevronDown" className="w-3.5 h-3.5" />
        </span>
      </button>

      {open && item.children && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-slate-200 space-y-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              href={child.href}
              icon={child.icon}
              label={child.label}
              isChild
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Sidebar
// - Top zone: scrollable, all items without position:'bottom'
// - Bottom zone: pinned to bottom, items with position:'bottom'
// ─────────────────────────────────────────────────────────────────────────────
export default function AppSidebar({ navItems = APP_NAV, open = false, onClose }) {
  const pathname = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const topItems = navItems.filter((item) => item.position !== 'bottom')
  const bottomItems = navItems.filter((item) => item.position === 'bottom')

  const renderItem = (item) =>
    item.children ? (
      <NavCategory key={item.label} item={item} />
    ) : (
      <NavLink
        key={item.href}
        href={item.href}
        icon={item.icon}
        label={item.label}
      />
    )

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-40 w-60
        bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Top zone — scrollable nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5 min-h-0">
        {topItems.map(renderItem)}
      </nav>

      {/* Bottom zone — pinned Contact + Settings */}
      {bottomItems.length > 0 && (
        <div className="shrink-0 border-t border-slate-100 p-3 space-y-0.5">
          {bottomItems.map(renderItem)}
        </div>
      )}
    </aside>
  )
}
