import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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
  '/ai-tools/cover-letter-builder/editor',
  '/ai-tools/cover-letter-builder/my-letters',
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

// Copies any Set-Cookie the Supabase client queued on `refreshed` (i.e. a
// rotated access/refresh token pair) onto whatever response we actually
// return, including redirects — otherwise a token refreshed mid-request
// would be discarded and the browser would keep sending the now-stale cookie.
function withRefreshedCookies(target, refreshed) {
  refreshed.cookies.getAll().forEach((cookie) => target.cookies.set(cookie))
  return target
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // `refreshed` starts as a pass-through response; Supabase's `setAll` below
  // rewrites it (and the request) whenever it rotates the session tokens.
  let refreshed = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          refreshed = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            refreshed.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This is the ONLY place in the app that can both refresh an expired
  // access token (via the refresh token) AND persist the rotated cookies
  // back to the browser — Server Components can read cookies but cannot
  // set them, so without this call a session silently stops working the
  // moment its access token expires (~1h), even though the user never
  // logged out. That was the actual cause of "can't access /profile":
  // this file used to only regex-match for a cookie *name*, never
  // verifying or refreshing the session it pointed to.
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) user = data.user
  } catch (err) {
    console.error('[middleware] Supabase auth check failed:', err.message)
  }

  if (user && matchesPrefix(pathname, AUTH_ONLY_PREFIXES)) {
    return withRefreshedCookies(NextResponse.redirect(new URL('/', request.url)), refreshed)
  }

  if (!isProtected(pathname)) {
    return refreshed
  }

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return withRefreshedCookies(NextResponse.redirect(loginUrl), refreshed)
  }

  return refreshed
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
    '/ai-tools/cover-letter-builder/editor/:path*',
    '/ai-tools/cover-letter-builder/my-letters/:path*',
    '/ai-tools/resume-rank-checker/check/:path*',
  ],
}
