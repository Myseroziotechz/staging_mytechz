/**
 * Display formatting + sorting helpers for profile entries.
 *
 * The date columns are TEXT (month name + year string), so both sorting and
 * rendering need explicit parsing — `.order('start_year')` in Postgres sorts
 * these lexicographically, which is wrong.
 */

import { MONTH_INDEX } from './constants'

const DEFAULT_FIELDS = {
  startMonth: 'start_month',
  startYear: 'start_year',
  endMonth: 'end_month',
  endYear: 'end_year',
}

/**
 * Renders a start/end pair as "March 2023 – Present" / "2021 – May 2024".
 * Returns '' when there's nothing meaningful to show.
 *
 * `fields` lets a section with differently-named date columns (certifications
 * use issue- and expiration-prefixed columns, not start/end) reuse this
 * instead of every caller re-implementing the same formatting.
 */
export function formatDateRange(entry, { ongoingFlag, ongoingLabel = 'Present', fields } = {}) {
  const f = { ...DEFAULT_FIELDS, ...fields }
  const start = joinMonthYear(entry[f.startMonth], entry[f.startYear])
  const ongoing = ongoingFlag ? entry[ongoingFlag] === true : false
  const end = ongoing ? ongoingLabel : joinMonthYear(entry[f.endMonth], entry[f.endYear])

  if (start && end) return `${start} – ${end}`
  if (start) return ongoing ? `${start} – ${ongoingLabel}` : start
  if (end) return end
  return ''
}

function joinMonthYear(month, year) {
  const m = String(month ?? '').trim()
  const y = String(year ?? '').trim()
  if (m && y) return `${m} ${y}`
  return y || ''
}

/**
 * Sort key: most recent first. Ongoing entries sort above everything, then by
 * end date, then start date. Missing values sort last rather than to the top.
 */
function sortValue(entry, ongoingFlag, fields) {
  if (ongoingFlag && entry[ongoingFlag] === true) return Number.MAX_SAFE_INTEGER
  const y = parseInt(entry[fields.endYear], 10)
  if (!Number.isNaN(y)) return y * 100 + (MONTH_INDEX[entry[fields.endMonth]] ?? 0)
  const sy = parseInt(entry[fields.startYear], 10)
  if (!Number.isNaN(sy)) return sy * 100 + (MONTH_INDEX[entry[fields.startMonth]] ?? 0)
  return -1
}

/** Returns a new array sorted newest-first. Does not mutate the input. */
export function sortByRecency(entries, ongoingFlag, fields) {
  const f = { ...DEFAULT_FIELDS, ...fields }
  return [...entries].sort((a, b) => sortValue(b, ongoingFlag, f) - sortValue(a, ongoingFlag, f))
}

/** Splits a comma-separated string into trimmed, de-duplicated tokens. */
export function splitTokens(value) {
  if (!value) return []
  const seen = new Set()
  const out = []
  for (const raw of String(value).split(/[,;\n]/)) {
    const token = raw.trim()
    if (!token) continue
    const key = token.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(token)
  }
  return out
}

/** Builds up-to-two-letter initials for the avatar fallback. */
export function initialsFrom(name, fallback = 'U') {
  const source = String(name || fallback).trim()
  if (!source) return fallback
  return source
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
