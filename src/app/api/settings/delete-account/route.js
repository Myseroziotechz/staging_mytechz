export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { fail, requireUser, readJson } from '@/app/api/profile/_lib/handlers'
import { getAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/settings/delete-account
 *
 * Requires the client to send `{ confirm: "DELETE" }` — the actual
 * confirmation gate lives in the UI (a dialog that only enables the button
 * once the user has typed the word), but the server re-checks it too so this
 * endpoint can't be triggered by an accidental/scripted request without that
 * exact phrase.
 *
 * Deleting the auth.users row cascades to every table with
 * `references auth.users(id) on delete cascade` — confirmed for
 * user_profiles and user_settings. Whether every other user-owned table
 * (resumes, applications, chat history, recruiter job postings) also
 * cascades has not been audited as part of this change; see the report.
 */
export async function POST(request) {
  const { user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  if (body?.confirm !== 'DELETE') {
    return fail('Type DELETE to confirm account deletion.', 400)
  }

  try {
    const admin = getAdminClient()
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) {
      console.error('[settings/delete-account] deleteUser failed:', error)
      return fail('Could not delete your account. Please try again or contact support.', 500)
    }
  } catch (err) {
    console.error('[settings/delete-account] unexpected error:', err)
    return fail('Could not delete your account. Please try again or contact support.', 500)
  }

  // The account row is gone, but this browser's session cookie is still
  // sitting there. Not cleared here — the caller follows up with a normal
  // POST to /auth/sign-out, reusing the existing (already-correct) cookie
  // cleanup instead of duplicating it.
  return NextResponse.json({ ok: true })
}
