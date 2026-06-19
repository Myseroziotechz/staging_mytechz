import { NextResponse } from 'next/server'

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/my-applications',
  '/saved-jobs',
  '/settings',
]

const PROTECTED_JOB_SUFFIXES = ['/apply', '/preparation']

function isProtected(pathname) {
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true
  }
  if (pathname.startsWith('/jobs/')) {
    return PROTECTED_JOB_SUFFIXES.some((s) => pathname.endsWith(s) || pathname.includes(s + '/'))
  }
  return false
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  // Check for any active Supabase session cookie.
  // Full JWT verification happens in the server components (ensure-session.js).
  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

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
    '/jobs/:category/:slug/apply/:path*',
    '/jobs/:category/:slug/preparation/:path*',
  ],
}
