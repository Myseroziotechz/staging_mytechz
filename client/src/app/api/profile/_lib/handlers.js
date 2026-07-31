import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Shared plumbing for the /api/profile/* routes: auth, JSON parsing,
 * consistent status codes and error shapes.
 */

export function ok(data, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status })
}

export function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status })
}

/**
 * Resolves the signed-in user, or returns a 401 response.
 * Callers must check `.response` before using `.user`.
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { response: fail('You must be signed in to do that.', 401) }
  }
  return { supabase, user }
}

/** Parses a JSON body, returning a 400 response on malformed input. */
export async function readJson(request) {
  try {
    const body = await request.json()
    if (body === null || typeof body !== 'object') {
      return { response: fail('Request body must be a JSON object.', 400) }
    }
    return { body }
  } catch {
    return { response: fail('Request body must be valid JSON.', 400) }
  }
}

/**
 * Maps a Postgres/PostgREST error to a sensible HTTP status.
 * Anything unrecognised becomes a 500 with a generic message so raw database
 * detail is never echoed back to the client.
 */
export function fromDbError(error) {
  const code = error?.code

  if (code === '23505') return fail('That record already exists.', 409)
  if (code === '23503') return fail('Referenced record does not exist.', 422)
  if (code === '23514') return fail('One or more values are not allowed.', 422)
  if (code === '23502') return fail('A required field is missing.', 422)
  if (code === '42501' || code === 'PGRST301') {
    return fail('You do not have permission to modify this record.', 403)
  }
  if (code === '42P01') {
    return fail(
      'Profile tables are missing. Run the profile migration on your Supabase project.',
      503,
    )
  }

  console.error('[api/profile] unexpected database error:', error)
  return fail('Something went wrong saving your profile. Please try again.', 500)
}

/** Formats a validator result into a 422 with per-row field errors. */
export function validationFailed(errors) {
  return fail('Please fix the highlighted fields.', 422, { fieldErrors: errors })
}
