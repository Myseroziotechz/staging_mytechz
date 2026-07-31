import { SECTION_TABLES, SECTIONS } from './constants'
import { toWritablePayload } from './entries'

/**
 * Server-side data access for profile sections.
 *
 * Replaces the previous delete-all-then-reinsert strategy, which was both
 * non-atomic (a failed insert after a successful delete destroyed the user's
 * data outright) and destructive of `id` / `created_at` on every save.
 *
 * `replaceSection` now diffs the incoming list against what's stored:
 *   - rows with no id            -> INSERT
 *   - rows with an id that changed -> UPDATE (id and created_at preserved)
 *   - stored ids no longer sent  -> DELETE
 * Untouched rows are not written at all.
 *
 * All queries run through the caller's RLS-scoped client and are additionally
 * filtered by user_id, so a forged id belonging to another user matches no row.
 */

function tableFor(section) {
  const table = SECTION_TABLES[section]
  if (!table) throw new Error(`Unknown profile section: ${section}`)
  return table
}

function nowISO() {
  return new Date().toISOString()
}

/**
 * Compares a payload value (from toWritablePayload, e.g. JS number 8.8) against
 * a stored value (from a raw `select *`, where PostgREST may serialise a
 * `numeric` column as a string like "8.80"). A plain `!==` would treat those
 * as different and trigger an unnecessary UPDATE on every save.
 */
function valuesEqual(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a ?? []) === JSON.stringify(b ?? [])
  }
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return (a === true) === (b === true)
  }
  const na = a === '' || a == null ? null : Number(a)
  const nb = b === '' || b == null ? null : Number(b)
  if (na !== null && nb !== null && !Number.isNaN(na) && !Number.isNaN(nb)) {
    return na === nb
  }
  return (a ?? '') === (b ?? '')
}

export async function listSection(supabase, section, userId) {
  const { data, error } = await supabase
    .from(tableFor(section))
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data ?? []
}

export async function getSectionRow(supabase, section, userId, id) {
  const { data, error } = await supabase
    .from(tableFor(section))
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function insertSectionRow(supabase, section, userId, entry) {
  const { data, error } = await supabase
    .from(tableFor(section))
    .insert({ ...toWritablePayload(section, entry), user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSectionRow(supabase, section, userId, id, entry) {
  const { data, error } = await supabase
    .from(tableFor(section))
    .update({ ...toWritablePayload(section, entry), updated_at: nowISO() })
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) throw error
  return data
}

export async function deleteSectionRow(supabase, section, userId, id) {
  const { data, error } = await supabase
    .from(tableFor(section))
    .delete()
    .eq('user_id', userId)
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Reconciles the stored rows for a section with the list the client submitted.
 *
 * Ordering is deliberate: inserts and updates run before deletes, so if a write
 * fails the user's existing rows are still intact and nothing is lost. The
 * previous implementation deleted first, which made any later failure fatal.
 */
export async function replaceSection(supabase, section, userId, entries) {
  const table = tableFor(section)
  const existing = await listSection(supabase, section, userId)
  const existingById = new Map(existing.map((row) => [String(row.id), row]))

  const submittedIds = new Set(
    entries.map((e) => (e.id == null ? null : String(e.id))).filter(Boolean),
  )

  const toInsert = []
  const toUpdate = []

  for (const entry of entries) {
    const id = entry.id == null ? null : String(entry.id)
    // An id the caller doesn't actually own is treated as a new row rather
    // than trusted — RLS would reject the update anyway.
    if (id && existingById.has(id)) {
      const stored = existingById.get(id)
      const payload = toWritablePayload(section, entry)
      const changed = Object.keys(payload).some((col) => !valuesEqual(payload[col], stored[col]))
      if (changed) toUpdate.push({ id, payload })
    } else {
      toInsert.push(toWritablePayload(section, entry))
    }
  }

  const toDelete = existing
    .map((row) => String(row.id))
    .filter((id) => !submittedIds.has(id))

  // ── Writes first, so a failure can never leave the user with less data ──
  if (toInsert.length) {
    const { error } = await supabase
      .from(table)
      .insert(toInsert.map((payload) => ({ ...payload, user_id: userId })))
    if (error) throw error
  }

  for (const { id, payload } of toUpdate) {
    const { error } = await supabase
      .from(table)
      .update({ ...payload, updated_at: nowISO() })
      .eq('user_id', userId)
      .eq('id', id)
    if (error) throw error
  }

  if (toDelete.length) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId)
      .in('id', toDelete)
    if (error) throw error
  }

  return {
    rows: await listSection(supabase, section, userId),
    stats: {
      inserted: toInsert.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
    },
  }
}

// ─── Skills (a TEXT[] column on user_profiles, not its own table) ────────────

export async function getSkills(supabase, userId) {
  // maybeSingle, not single: a user with no profile row yet would otherwise
  // surface a raw PGRST116 error instead of an empty list.
  const { data, error } = await supabase
    .from('user_profiles')
    .select('skills')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.skills ?? []
}

export async function setSkills(supabase, userId, skills) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ skills, updated_at: nowISO() })
    .eq('id', userId)
    .select('skills')
    .maybeSingle()

  if (error) throw error
  return data?.skills ?? skills
}

export const ALL_SECTIONS = [
  SECTIONS.EDUCATION,
  SECTIONS.PROJECTS,
  SECTIONS.INTERNSHIPS,
  SECTIONS.LANGUAGES,
]
