/**
 * Display formatting + sorting helpers for profile entries.
 *
 * The date columns are TEXT (month name + year string), so both sorting and
 * rendering need explicit parsing — `.order('start_year')` in Postgres sorts
 * these lexicographically, which is wrong.
 */

import { MONTH_INDEX } from './constants'

/**
 * Renders a start/end pair as "March 2023 – Present" / "2021 – May 2024".
 * Returns '' when there's nothing meaningful to show.
 */
export function formatDateRange(entry, { ongoingFlag, ongoingLabel = 'Present' } = {}) {
  const start = joinMonthYear(entry.start_month, entry.start_year)
  const ongoing = ongoingFlag ? entry[ongoingFlag] === true : false
  const end = ongoing ? ongoingLabel : joinMonthYear(entry.end_month, entry.end_year)

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
function sortValue(entry, ongoingFlag) {
  if (ongoingFlag && entry[ongoingFlag] === true) return Number.MAX_SAFE_INTEGER
  const y = parseInt(entry.end_year, 10)
  if (!Number.isNaN(y)) return y * 100 + (MONTH_INDEX[entry.end_month] ?? 0)
  const sy = parseInt(entry.start_year, 10)
  if (!Number.isNaN(sy)) return sy * 100 + (MONTH_INDEX[entry.start_month] ?? 0)
  return -1
}

/** Returns a new array sorted newest-first. Does not mutate the input. */
export function sortByRecency(entries, ongoingFlag) {
  return [...entries].sort((a, b) => sortValue(b, ongoingFlag) - sortValue(a, ongoingFlag))
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
