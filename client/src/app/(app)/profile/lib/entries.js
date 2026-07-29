/**
 * Entry factories + normalisation for each profile section.
 *
 * Normalisation matters: the DB columns are nullable, so a row can come back
 * with `field_of_study: null`. Feeding null into a controlled <input value={...}>
 * makes React switch the input from controlled to uncontrolled and log a
 * warning. Every fetched row goes through normalise* before reaching state.
 */

import { SECTIONS, SECTION_COLUMNS, COLUMN_TYPES, MONTH_INDEX, MONTH_NAME } from './constants'
import { splitTokens } from './format'

/** Stable client-side key for list rendering (survives reorder/removal). */
export function makeKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts, where crypto.randomUUID is undefined.
  return `k_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

const str = (v) => (v == null ? '' : String(v))
const bool = (v) => v === true

/**
 * DB value -> form string, per COLUMN_TYPES. Every profile form field is a
 * plain string or boolean in component state; this is the only place a
 * fetched row's integer/numeric/array DB types get converted to that shape.
 */
function fromDbValue(col, value) {
  switch (COLUMN_TYPES[col]) {
    case 'month_int':
      return value == null ? '' : (MONTH_NAME[value] ?? '')
    case 'year_int':
    case 'numeric':
      return value == null ? '' : String(value)
    case 'boolean':
      return value === true
    case 'text_array':
      return Array.isArray(value) ? value.join(', ') : ''
    default:
      return str(value)
  }
}

/**
 * Form string -> DB value, per COLUMN_TYPES. Empty strings become null for
 * nullable numeric/integer columns — Postgres rejects '' for an integer
 * column outright, and a blank optional field should mean "not set", not 0.
 */
function toDbValue(col, value) {
  switch (COLUMN_TYPES[col]) {
    case 'month_int': {
      const n = MONTH_INDEX[value]
      return n ?? null
    }
    case 'year_int': {
      const n = parseInt(value, 10)
      return Number.isNaN(n) ? null : n
    }
    case 'numeric': {
      const n = Number(value)
      return value === '' || value == null || Number.isNaN(n) ? null : n
    }
    case 'boolean':
      return value === true
    case 'text_array':
      return splitTokens(value)
    default:
      return str(value).trim()
  }
}

// ─── Education ───────────────────────────────────────────────────────────────

export function createEmptyEducation() {
  return {
    id: null,
    degree: '',
    institution: '',
    field_of_study: '',
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    currently_studying: false,
    cgpa: '',
    description: '',
    _key: makeKey(),
  }
}

export function normaliseEducation(row) {
  return {
    id: row.id ?? null,
    degree: str(row.degree),
    institution: str(row.institution),
    field_of_study: str(row.field_of_study),
    start_month: fromDbValue('start_month', row.start_month),
    start_year: fromDbValue('start_year', row.start_year),
    end_month: fromDbValue('end_month', row.end_month),
    end_year: fromDbValue('end_year', row.end_year),
    currently_studying: bool(row.currently_studying),
    cgpa: fromDbValue('cgpa', row.cgpa),
    description: str(row.description),
    _key: row.id ?? makeKey(),
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

export function createEmptyProject() {
  return {
    id: null,
    title: '',
    organization: '',
    description: '',
    skills_used: '',
    project_url: '',
    github_url: '',
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    currently_working: false,
    _key: makeKey(),
  }
}

export function normaliseProject(row) {
  return {
    id: row.id ?? null,
    title: str(row.title),
    organization: str(row.organization),
    description: str(row.description),
    skills_used: fromDbValue('skills_used', row.skills_used),
    project_url: str(row.project_url),
    github_url: str(row.github_url),
    start_month: fromDbValue('start_month', row.start_month),
    start_year: fromDbValue('start_year', row.start_year),
    end_month: fromDbValue('end_month', row.end_month),
    end_year: fromDbValue('end_year', row.end_year),
    currently_working: bool(row.currently_working),
    _key: row.id ?? makeKey(),
  }
}

// ─── Internships ─────────────────────────────────────────────────────────────

export function createEmptyInternship() {
  return {
    id: null,
    company: '',
    role: '',
    location: '',
    employment_type: '',
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    currently_working: false,
    description: '',
    _key: makeKey(),
  }
}

export function normaliseInternship(row) {
  return {
    id: row.id ?? null,
    company: str(row.company),
    role: str(row.role),
    location: str(row.location),
    employment_type: str(row.employment_type),
    start_month: fromDbValue('start_month', row.start_month),
    start_year: fromDbValue('start_year', row.start_year),
    end_month: fromDbValue('end_month', row.end_month),
    end_year: fromDbValue('end_year', row.end_year),
    currently_working: bool(row.currently_working),
    description: str(row.description),
    _key: row.id ?? makeKey(),
  }
}

// ─── Languages ───────────────────────────────────────────────────────────────

export function createEmptyLanguage() {
  return {
    id: null,
    language: '',
    proficiency: 'Beginner',
    _key: makeKey(),
  }
}

export function normaliseLanguage(row) {
  return {
    id: row.id ?? null,
    language: str(row.language),
    proficiency: str(row.proficiency) || 'Beginner',
    _key: row.id ?? makeKey(),
  }
}

// ─── Generic ─────────────────────────────────────────────────────────────────

export const NORMALISERS = {
  [SECTIONS.EDUCATION]: normaliseEducation,
  [SECTIONS.PROJECTS]: normaliseProject,
  [SECTIONS.INTERNSHIPS]: normaliseInternship,
  [SECTIONS.LANGUAGES]: normaliseLanguage,
}

export const FACTORIES = {
  [SECTIONS.EDUCATION]: createEmptyEducation,
  [SECTIONS.PROJECTS]: createEmptyProject,
  [SECTIONS.INTERNSHIPS]: createEmptyInternship,
  [SECTIONS.LANGUAGES]: createEmptyLanguage,
}

/**
 * Strips an entry down to writable columns for a section and converts each
 * value to its real DB type (see COLUMN_TYPES). Guarantees client-only keys
 * (_key) and server-managed keys (id, user_id, created_at) never reach an
 * INSERT/UPDATE payload.
 */
export function toWritablePayload(section, entry) {
  const allowed = SECTION_COLUMNS[section]
  if (!allowed) throw new Error(`Unknown profile section: ${section}`)

  const payload = {}
  for (const col of allowed) {
    payload[col] = toDbValue(col, entry[col])
  }
  return payload
}

/**
 * True when a row is still exactly as `createEmpty*` produced it.
 *
 * Compared against the factory rather than "every field is falsy", because
 * some factories seed a default (Languages start at 'Beginner'). Checking for
 * non-empty values alone would treat an untouched new row as filled in and
 * reject the save with "Language is required" instead of quietly dropping it.
 */
export function isBlankEntry(section, entry) {
  if (entry.id != null) return false

  const template = FACTORIES[section]?.()
  if (!template) return false

  return SECTION_COLUMNS[section].every((col) => {
    const value = entry[col]
    const seed = template[col]
    if (typeof seed === 'boolean') return value === seed
    return String(value ?? '').trim() === String(seed ?? '')
  })
}
