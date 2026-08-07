import { SECTION_TABLES } from '@/app/(app)/profile/lib/constants'
import { VALIDATORS, isValid } from '@/app/(app)/profile/lib/validation'
import {
  getSectionRow,
  updateSectionRow,
  deleteSectionRow,
} from '@/app/(app)/profile/lib/profile-repository'
import {
  ok,
  fail,
  requireUser,
  readJson,
  fromDbError,
  validationFailed,
} from '../../_lib/handlers'

/**
 * Single-record endpoints.
 *
 *   GET    /api/profile/education/:id
 *   PUT    /api/profile/education/:id
 *   DELETE /api/profile/education/:id
 *
 * Every query is scoped by user_id as well as id, so a valid id belonging to
 * another user resolves to nothing and returns 404 rather than leaking data.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function resolveSection(section) {
  return Object.prototype.hasOwnProperty.call(SECTION_TABLES, section) ? section : null
}

async function resolveParams(params) {
  const { section: raw, id } = await params
  const section = resolveSection(raw)
  if (!section) return { error: fail(`Unknown profile section "${raw}".`, 404) }
  if (!UUID_RE.test(id)) return { error: fail('Invalid record id.', 400) }
  return { section, id }
}

export async function GET(request, { params }) {
  const { section, id, error: badParams } = await resolveParams(params)
  if (badParams) return badParams

  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const row = await getSectionRow(supabase, section, user.id, id)
    if (!row) return fail('Record not found.', 404)
    return ok({ entry: row })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function PUT(request, { params }) {
  const { section, id, error: badParams } = await resolveParams(params)
  if (badParams) return badParams

  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const entry = body.entry ?? body
  const errors = VALIDATORS[section]([entry])
  if (!isValid(errors)) return validationFailed(errors)

  try {
    const row = await updateSectionRow(supabase, section, user.id, id, entry)
    if (!row) return fail('Record not found.', 404)
    return ok({ entry: row })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function DELETE(request, { params }) {
  const { section, id, error: badParams } = await resolveParams(params)
  if (badParams) return badParams

  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const row = await deleteSectionRow(supabase, section, user.id, id)
    if (!row) return fail('Record not found.', 404)
    return ok({ id })
  } catch (error) {
    return fromDbError(error)
  }
}
