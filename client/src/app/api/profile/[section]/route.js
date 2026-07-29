import { SECTION_TABLES } from '@/app/(app)/profile/lib/constants'
import { VALIDATORS, isValid } from '@/app/(app)/profile/lib/validation'
import {
  listSection,
  replaceSection,
  insertSectionRow,
} from '@/app/(app)/profile/lib/profile-repository'
import {
  ok,
  fail,
  requireUser,
  readJson,
  fromDbError,
  validationFailed,
} from '../_lib/handlers'

/**
 * Collection endpoints for a profile section.
 *
 *   GET    /api/profile/education   -> list the user's rows
 *   POST   /api/profile/education   -> append one row
 *   PUT    /api/profile/education   -> reconcile the whole list (diffed upsert)
 *   DELETE /api/profile/education   -> clear the section
 *
 * `section` is validated against SECTION_TABLES, so the path segment can never
 * be used to reach an arbitrary table.
 */

function resolveSection(section) {
  return Object.prototype.hasOwnProperty.call(SECTION_TABLES, section) ? section : null
}

export async function GET(request, { params }) {
  const { section: raw } = await params
  const section = resolveSection(raw)
  if (!section) return fail(`Unknown profile section "${raw}".`, 404)

  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    return ok({ [section]: await listSection(supabase, section, user.id) })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function POST(request, { params }) {
  const { section: raw } = await params
  const section = resolveSection(raw)
  if (!section) return fail(`Unknown profile section "${raw}".`, 404)

  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const entry = body.entry ?? body
  const errors = VALIDATORS[section]([entry])
  if (!isValid(errors)) return validationFailed(errors)

  try {
    const row = await insertSectionRow(supabase, section, user.id, entry)
    return ok({ entry: row }, 201)
  } catch (error) {
    return fromDbError(error)
  }
}

export async function PUT(request, { params }) {
  const t0 = Date.now()
  const { section: raw } = await params
  const section = resolveSection(raw)
  if (!section) return fail(`Unknown profile section "${raw}".`, 404)

  // Diagnostic trace added while investigating a reported Save timeout.
  // Route-entered is logged before requireUser() specifically so a hang in
  // auth (Supabase's getUser() round-trip) is distinguishable from a hang in
  // the database write that follows it.
  console.log(`[api/profile PUT ${section}] route entered`)

  const { supabase, user, response } = await requireUser()
  if (response) return response
  console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms auth resolved (user=${user.id})`)

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const entries = body.entries ?? body[section]
  if (!Array.isArray(entries)) {
    return fail('Expected an "entries" array in the request body.', 400)
  }

  const errors = VALIDATORS[section](entries)
  if (!isValid(errors)) return validationFailed(errors)
  console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms validation passed (${entries.length} entries)`)

  try {
    console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms database write starting`)
    const { rows, stats } = await replaceSection(supabase, section, user.id, entries)
    console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms database write complete`, stats)
    return ok({ [section]: rows, stats })
  } catch (error) {
    console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms database write threw`, error?.message)
    return fromDbError(error)
  } finally {
    console.log(`[api/profile PUT ${section}] +${Date.now() - t0}ms handler returning`)
  }
}

export async function DELETE(request, { params }) {
  const { section: raw } = await params
  const section = resolveSection(raw)
  if (!section) return fail(`Unknown profile section "${raw}".`, 404)

  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { stats } = await replaceSection(supabase, section, user.id, [])
    return ok({ [section]: [], stats })
  } catch (error) {
    return fromDbError(error)
  }
}
