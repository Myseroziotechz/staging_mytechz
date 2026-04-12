'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Button from '@/components/ui/Button'

const navItems = [
  {
    label: 'Jobs',
    href: '/jobs',
    dropdown: [
      { label: 'Private Jobs', href: '/jobs/private', description: 'Explore opportunities in top private companies' },
      { label: 'Government Jobs', href: '/jobs/government', description: 'Find secure careers in the public sector' },
    ],
  },
  {
    label: 'AI Tools',
    href: '/ai-tools',
    dropdown: [
      { label: 'Resume Builder', href: '/ai-tools/resume-builder', description: 'Create professional resumes with AI' },
      { label: 'Smart Job Search', href: '/ai-tools/smart-job-search', description: 'AI-powered job matching for you' },
      { label: 'Resume Rank Checker', href: '/ai-tools/resume-rank-checker', description: 'Check how your resume scores' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const profileMenu = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    description: 'Your personalised overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    description: 'View and edit your details',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m12 7a8 8 0 10-16 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'My Applications',
    href: '/my-applications',
    description: 'Track your job applications',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Saved Jobs',
    href: '/saved-jobs',
    description: 'Jobs you have bookmarked',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    description: 'Preferences and account',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 013.35 0c.138.595.728 1 1.338.923.61-.077 1.218.22 1.472.78.254.56.088 1.227-.41 1.603-.498.377-.67 1.05-.376 1.603.294.553.94.826 1.543.666.604-.16 1.258.13 1.544.69.286.56.127 1.242-.365 1.63-.491.388-.68 1.05-.455 1.615.225.564.853.88 1.47.745.617-.135 1.236.208 1.468.81.232.6-.011 1.268-.578 1.58-.567.312-.812.98-.588 1.56.224.58-.043 1.232-.626 1.52-.583.288-1.266.107-1.63-.428-.365-.535-1.06-.694-1.6-.366-.54.328-.742 1.006-.475 1.58.267.575-.018 1.247-.615 1.524-.597.277-1.298.11-1.644-.39-.346-.5-1.04-.637-1.59-.315-.551.321-.747.996-.466 1.563.28.567.024 1.255-.575 1.548-.6.293-1.32.112-1.662-.417-.343-.53-1.032-.68-1.587-.35-.555.33-.757 1.015-.478 1.594.28.58.002 1.266-.608 1.548-.61.282-1.324.086-1.659-.456-.335-.542-1.022-.708-1.58-.383-.559.325-.77.998-.49 1.582.281.585.014 1.276-.593 1.57" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function DropdownMenu({ items, isOpen }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ease-out ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/60 p-2 min-w-[260px]">
        {/* Glass highlight strip at the top */}
        <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />
        {items.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex flex-col gap-0.5 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-blue-50/60 ${
              idx !== items.length - 1 ? 'mb-0.5' : ''
            }`}
          >
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {item.label}
            </span>
            {item.description && (
              <span className="text-xs text-gray-500 group-hover:text-blue-500/70 transition-colors">
                {item.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

function ProfileDropdown({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const ref = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const meta = user?.user_metadata || {}
  const avatar = !imgError ? (meta.avatar_url || meta.picture) : null
  const fullName = meta.full_name || meta.name || user?.email?.split('@')[0] || 'Account'
  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 bg-white/40 hover:bg-white/60 border border-white/60 shadow-sm transition-all"
        aria-label="Open profile menu"
      >
        <span className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white/70">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={fullName}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials || 'U'}</span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute top-full right-0 pt-3 transition-all duration-300 ease-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/60 p-2 min-w-[280px]">
          <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />

          {/* User header */}
          <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/60">
            <span className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <span>{initials || 'U'}</span>
              )}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{fullName}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>

          {profileMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-blue-50/60"
            >
              <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                {item.icon}
              </span>
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-500/70 transition-colors">
                  {item.description}
                </span>
              </span>
            </Link>
          ))}

          <div className="my-1 h-px bg-gray-100" />

          <button
            onClick={onSignOut}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-rose-50/60"
          >
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const dropdownTimeout = useRef(null)
  const navRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setMobileExpanded(null)
  }, [pathname])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false)
        setMobileExpanded(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleDropdownEnter = (label) => {
    clearTimeout(dropdownTimeout.current)
    setOpenDropdown(label)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pt-3 pointer-events-none">
      <nav
        ref={navRef}
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-500 ease-out rounded-2xl ${
          scrolled
            ? 'bg-white/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.1)] border border-white/40'
            : 'bg-white/15 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] border border-white/30'
        }`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo → Home */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/Mytechz_logo.png"
                alt="MyTechz Logo"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleDropdownEnter(item.label)}
                  onMouseLeave={() => item.dropdown && handleDropdownLeave()}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pathname === item.href || pathname?.startsWith(item.href + '/')
                        ? 'text-blue-600 bg-blue-50/50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-white/30'
                    }`}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {item.dropdown && (
                    <DropdownMenu items={item.dropdown} isOpen={openDropdown === item.label} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {user ? (
                <ProfileDropdown user={user} onSignOut={handleSignOut} />
              ) : (
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              )}
            </div>

            {/* Mobile: Profile (left of hamburger) + Hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              {user ? (
                <ProfileDropdown user={user} onSignOut={handleSignOut} />
              ) : (
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              )}
            <button
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <span
                  className={`block h-0.5 w-5 bg-gray-700 transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-700 transition-all duration-300 ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-700 transition-all duration-300 ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out overflow-hidden ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-white/20 px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white/20 font-medium transition-all duration-200"
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          mobileExpanded === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        mobileExpanded === item.label ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-4 py-1 space-y-0.5">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block py-2 px-3 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/40 transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2.5 px-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white/20 font-medium transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

          </div>
        </div>
      </nav>
    </div>
  )
}
