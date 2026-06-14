import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/my-applications',
  '/saved-jobs',
  '/settings',
]

// Protected path segments within /jobs
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

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

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
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
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
