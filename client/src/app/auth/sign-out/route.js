import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored
          }
        },
      },
    }
  )

  // Optional `{ scope: 'global' }` body signs out every session for this
  // user (all devices), not just this browser. No body / non-JSON body (the
  // existing Navbar callers) keeps the original local-only behaviour.
  let scope = 'local'
  try {
    const body = await request.json()
    if (body?.scope === 'global') scope = 'global'
  } catch {
    // No body sent — default to local.
  }

  await supabase.auth.signOut({ scope })

  const response = NextResponse.redirect(new URL('/', request.url), { status: 303 })
  // Clear all MyTechZ cookies
  response.cookies.set('mytechz_intended_role', '', { path: '/', maxAge: 0 })
  response.cookies.set('mytechz_return_to', '', { path: '/', maxAge: 0 })
  return response
}
