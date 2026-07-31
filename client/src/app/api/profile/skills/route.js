import { validateSkills } from '@/app/(app)/profile/lib/validation'
import { splitTokens } from '@/app/(app)/profile/lib/format'
import { getSkills, setSkills } from '@/app/(app)/profile/lib/profile-repository'
import { ok, fail, requireUser, readJson, fromDbError } from '../_lib/handlers'

/**
 * Skills live in `user_profiles.skills` (TEXT[]) rather than their own table,
 * so they get a dedicated route. This static segment takes precedence over
 * the sibling [section] dynamic route.
 *
 *   GET    /api/profile/skills
 *   POST   /api/profile/skills   -> add one or more skills
 *   PUT    /api/profile/skills   -> replace the whole list
 *   DELETE /api/profile/skills   -> clear, or remove ?skill=React
 */

/** Case-insensitive de-duplication that preserves the user's original casing. */
function dedupe(list) {
  const seen = new Set()
  const out = []
  for (const raw of list) {
    const value = String(raw ?? '').trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(value)
  }
  return out
}

export async function GET() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    return ok({ skills: await getSkills(supabase, user.id) })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function POST(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const incoming = Array.isArray(body.skills)
    ? body.skills
    : splitTokens(body.skill ?? body.skills)

  if (incoming.length === 0) return fail('No skills provided.', 400)

  try {
    const merged = dedupe([...(await getSkills(supabase, user.id)), ...incoming])
    const invalid = validateSkills(merged)
    if (invalid) return fail(invalid, 422)

    return ok({ skills: await setSkills(supabase, user.id, merged) }, 201)
  } catch (error) {
    return fromDbError(error)
  }
}

export async function PUT(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  if (!Array.isArray(body.skills)) {
    return fail('Expected a "skills" array in the request body.', 400)
  }

  const skills = dedupe(body.skills)
  const invalid = validateSkills(skills)
  if (invalid) return fail(invalid, 422)

  try {
    return ok({ skills: await setSkills(supabase, user.id, skills) })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function DELETE(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const target = new URL(request.url).searchParams.get('skill')

  try {
    if (!target) {
      return ok({ skills: await setSkills(supabase, user.id, []) })
    }
    const remaining = (await getSkills(supabase, user.id)).filter(
      (s) => s.toLowerCase() !== target.trim().toLowerCase(),
    )
    return ok({ skills: await setSkills(supabase, user.id, remaining) })
  } catch (error) {
    return fromDbError(error)
  }
}
