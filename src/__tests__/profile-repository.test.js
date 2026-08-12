import { describe, it, expect, beforeEach } from 'vitest'
import { replaceSection } from '@/app/(app)/profile/lib/profile-repository'
import { SECTIONS } from '@/app/(app)/profile/lib/constants'

/**
 * Covers the diffed-upsert reconciliation that replaced the previous
 * delete-all-then-reinsert strategy.
 *
 * The old code deleted every row for the user before inserting the new list,
 * so any failure after the delete left the user with nothing. These tests pin
 * the two properties that fixed it: untouched rows keep their ids, and writes
 * happen before deletes.
 */

/**
 * Minimal in-memory stand-in for the supabase query builder.
 *
 * Mirrors the real client's shape: insert/update/delete return the *builder*
 * so filters can still be chained afterwards, and the query only executes when
 * the builder is awaited.
 */
function makeFakeSupabase(initialRows, { failInsert = false, failUpdate = false } = {}) {
  let rows = initialRows.map((r) => ({ ...r }))
  const calls = []

  const client = {
    get rows() { return rows },
    calls,
    from() {
      const state = { filters: {}, op: null, payload: null }

      const matches = (row) =>
        Object.entries(state.filters).every(([key, value]) =>
          key.endsWith('__in')
            ? value.includes(row[key.slice(0, -4)])
            : row[key] === value,
        )

      const execute = () => {
        if (state.op === 'insert') {
          calls.push({ op: 'insert', count: state.payload.length })
          if (failInsert) return { data: null, error: { code: 'XX000' } }
          const added = state.payload.map((p, i) => ({
            id: `new-${rows.length + i}`,
            created_at: '2026-01-01',
            ...p,
          }))
          rows = [...rows, ...added]
          return { data: added, error: null }
        }

        if (state.op === 'update') {
          calls.push({ op: 'update', id: state.filters.id })
          if (failUpdate) return { data: null, error: { code: 'XX000' } }
          let updated = null
          rows = rows.map((r) => {
            if (!matches(r)) return r
            updated = { ...r, ...state.payload }
            return updated
          })
          return { data: updated, error: null }
        }

        if (state.op === 'delete') {
          const doomed = rows.filter(matches)
          calls.push({ op: 'delete', ids: doomed.map((r) => r.id) })
          rows = rows.filter((r) => !matches(r))
          return { data: doomed[0] ?? null, error: null }
        }

        return { data: rows.filter(matches), error: null }
      }

      const builder = {
        select() { return builder },
        eq(col, val) { state.filters[col] = val; return builder },
        in(col, vals) { state.filters[`${col}__in`] = vals; return builder },
        maybeSingle() {
          const { data, error } = execute()
          return Promise.resolve({
            data: Array.isArray(data) ? data[0] ?? null : data,
            error,
          })
        },
        insert(payload) {
          state.op = 'insert'
          state.payload = Array.isArray(payload) ? payload : [payload]
          return builder
        },
        update(payload) {
          state.op = 'update'
          state.payload = payload
          return builder
        },
        delete() {
          state.op = 'delete'
          return builder
        },
        // Awaiting the builder runs the query, as PostgrestBuilder does.
        then(resolve, reject) {
          return Promise.resolve(execute()).then(resolve, reject)
        },
      }
      return builder
    },
  }
  return client
}

const USER = 'user-1'

describe('replaceSection — diffed upsert', () => {
  let existing

  beforeEach(() => {
    existing = [
      { id: 'row-a', user_id: USER, language: 'English', proficiency: 'Native' },
      { id: 'row-b', user_id: USER, language: 'Tamil', proficiency: 'Beginner' },
    ]
  })

  it('does not touch rows the user left unchanged', async () => {
    const db = makeFakeSupabase(existing)

    await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Native' },
      { id: 'row-b', language: 'Tamil', proficiency: 'Beginner' },
    ])

    expect(db.calls.filter((c) => c.op === 'insert')).toHaveLength(0)
    expect(db.calls.filter((c) => c.op === 'update')).toHaveLength(0)
    expect(db.calls.filter((c) => c.op === 'delete')).toHaveLength(0)
  })

  it('preserves ids across a save, rather than recreating every row', async () => {
    const db = makeFakeSupabase(existing)

    const { rows } = await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Professional' },
      { id: 'row-b', language: 'Tamil', proficiency: 'Beginner' },
    ])

    expect(rows.map((r) => r.id).sort()).toEqual(['row-a', 'row-b'])
    expect(rows.find((r) => r.id === 'row-a').proficiency).toBe('Professional')
    // created_at survives, which the old delete-and-reinsert approach destroyed.
    expect(rows.find((r) => r.id === 'row-b')).toHaveProperty('user_id', USER)
  })

  it('updates only the changed row', async () => {
    const db = makeFakeSupabase(existing)

    const { stats } = await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Professional' },
      { id: 'row-b', language: 'Tamil', proficiency: 'Beginner' },
    ])

    expect(stats).toEqual({ inserted: 0, updated: 1, deleted: 0 })
  })

  it('inserts rows that have no id', async () => {
    const db = makeFakeSupabase(existing)

    const { stats } = await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Native' },
      { id: 'row-b', language: 'Tamil', proficiency: 'Beginner' },
      { language: 'Hindi', proficiency: 'Intermediate' },
    ])

    expect(stats.inserted).toBe(1)
    expect(db.rows).toHaveLength(3)
  })

  it('deletes rows the client no longer sends', async () => {
    const db = makeFakeSupabase(existing)

    const { stats } = await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Native' },
    ])

    expect(stats.deleted).toBe(1)
    expect(db.rows.map((r) => r.id)).toEqual(['row-a'])
  })

  it('clears the section when given an empty list', async () => {
    const db = makeFakeSupabase(existing)
    const { stats } = await replaceSection(db, SECTIONS.LANGUAGES, USER, [])

    expect(stats.deleted).toBe(2)
    expect(db.rows).toHaveLength(0)
  })

  it('treats an id the user does not own as a new row instead of trusting it', async () => {
    const db = makeFakeSupabase([
      ...existing,
      { id: 'someone-elses', user_id: 'user-2', language: 'French', proficiency: 'Native' },
    ])

    await replaceSection(db, SECTIONS.LANGUAGES, USER, [
      { id: 'row-a', language: 'English', proficiency: 'Native' },
      { id: 'row-b', language: 'Tamil', proficiency: 'Beginner' },
      { id: 'someone-elses', language: 'Hacked', proficiency: 'Native' },
    ])

    // The other user's row is untouched...
    const victim = db.rows.find((r) => r.id === 'someone-elses')
    expect(victim.language).toBe('French')
    expect(victim.user_id).toBe('user-2')
    // ...and the forged entry became a fresh row owned by the caller.
    expect(db.calls.some((c) => c.op === 'insert')).toBe(true)
  })

  it('leaves existing rows intact when the insert fails', async () => {
    const db = makeFakeSupabase(existing, { failInsert: true })

    await expect(
      replaceSection(db, SECTIONS.LANGUAGES, USER, [
        { language: 'Hindi', proficiency: 'Intermediate' },
      ]),
    ).rejects.toBeTruthy()

    // The critical regression guard: the old implementation deleted first, so
    // this same failure wiped the user's entire section.
    expect(db.rows).toHaveLength(2)
    expect(db.calls.some((c) => c.op === 'delete')).toBe(false)
  })

  it('does not delete anything when an update fails', async () => {
    const db = makeFakeSupabase(existing, { failUpdate: true })

    await expect(
      replaceSection(db, SECTIONS.LANGUAGES, USER, [
        { id: 'row-a', language: 'English', proficiency: 'Professional' },
      ]),
    ).rejects.toBeTruthy()

    expect(db.rows).toHaveLength(2)
    expect(db.calls.some((c) => c.op === 'delete')).toBe(false)
  })

  it('rejects an unknown section rather than querying an arbitrary table', async () => {
    const db = makeFakeSupabase(existing)
    await expect(replaceSection(db, 'users; drop table', USER, []))
      .rejects.toThrow(/Unknown profile section/)
  })
})
