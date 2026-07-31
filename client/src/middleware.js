import { NextResponse } from 'next/server'

// IMPORTANT: this file must live at src/middleware.js, not at the project
// root. This app's routes live under src/app, and Next.js only auto-detects
// middleware next to the pages/app root — with a src/ layout that means
// src/middleware.js specifically. It previously sat at the project root and
// was silently never compiled or executed (no "Compiling /middleware" log
// line, ever) — confirmed by adding a request-level console.error probe here
// and observing it never fired until the file was moved. Every route below
// was actually being protected only by page/layout-level checks
// (ensure-session.js and friends), with no edge-level defense at all.
//
// `/admin` and `/recruiter` used to be "protected" only by src/proxy.js, a
// second file that looked like Next.js middleware but wasn't: Next.js 15 only
// recognizes `middleware.js` (verified against MIDDLEWARE_FILENAME in
// node_modules/next/dist/lib/constants.js) — a file literally named proxy.js
// with an `export async function proxy()` is never loaded either. That file
// has been removed; its route list and its "already logged in, visiting
// /login" redirect are folded in here.
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/my-applications',
  '/saved-jobs',
  '/settings',
  '/admin',
  '/recruiter',
  '/ai-tools/resume-builder/create',
  '/ai-tools/resume-builder/editor',
  '/ai-tools/resume-builder/my-resumes',
  '/ai-tools/resume-rank-checker/check',
]

const AUTH_ONLY_PREFIXES = ['/login']

const PROTECTED_JOB_SUFFIXES = ['/apply', '/preparation']

function matchesPrefix(pathname, prefixes) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isProtected(pathname) {
  if (matchesPrefix(pathname, PROTECTED_PREFIXES)) return true
  if (pathname.startsWith('/jobs/')) {
    return PROTECTED_JOB_SUFFIXES.some((s) => pathname.endsWith(s) || pathname.includes(s + '/'))
  }
  return false
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Check for any active Supabase session cookie.
  // Full JWT verification happens in the server components (ensure-session.js).
  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

  if (hasSession && matchesPrefix(pathname, AUTH_ONLY_PREFIXES)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/my-applications/:path*',
    '/saved-jobs/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/recruiter/:path*',
    '/login/:path*',
    '/jobs/:category/:slug/apply/:path*',
    '/jobs/:category/:slug/preparation/:path*',
    '/ai-tools/resume-builder/create/:path*',
    '/ai-tools/resume-builder/editor/:path*',
    '/ai-tools/resume-builder/my-resumes/:path*',
    '/ai-tools/resume-rank-checker/check/:path*',
  ],
}
