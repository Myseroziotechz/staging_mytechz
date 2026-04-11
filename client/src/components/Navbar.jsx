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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const dropdownTimeout = useRef(null)
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
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 truncate max-w-[180px]">
                    {user.email}
                  </span>
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="secondary" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/20 transition-colors"
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

            <div className="pt-3 border-t border-white/20">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 truncate px-3">{user.email}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="sm">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
