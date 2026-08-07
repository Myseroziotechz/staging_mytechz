/**
 * Shared constants for the Profile module.
 *
 * Previously MONTHS / YEAR_OPTIONS / EMPLOYMENT_TYPES were re-declared in each
 * section component, which let them drift apart. Single source of truth here.
 */

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Month name -> 1-based index, for chronological comparison/sorting. */
export const MONTH_INDEX = MONTHS.reduce((acc, name, i) => {
  acc[name] = i + 1
  return acc
}, {})

/** 1-based index -> month name, the reverse of MONTH_INDEX. The DB columns
 * store month as a small integer, but the UI works with month names. */
export const MONTH_NAME = MONTHS.reduce((acc, name, i) => {
  acc[i + 1] = name
  return acc
}, {})

/**
 * Year options as strings — <select value=...> always compares strings, and
 * this keeps the UI layer type-agnostic even though the DB columns are
 * integer. Conversion to/from integer happens only at the API boundary
 * (see COLUMN_TYPES below), never in the components.
 *
 * Computed lazily rather than at module scope so a server render and a client
 * render that straddle a New Year boundary can't produce different lists.
 *
 * @param {number} future - how many years ahead to include (expected graduation)
 * @param {number} past   - how many years back to include
 */
export function getYearOptions(future = 8, past = 50) {
  const current = new Date().getFullYear()
  const years = []
  for (let y = current + future; y >= current - past; y--) {
    years.push(String(y))
  }
  return years
}

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Professional', 'Native']

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Temporary',
  'Freelance',
]

/** Section keys — used for API routes, table names and cache tags. */
export const SECTIONS = {
  EDUCATION: 'education',
  PROJECTS: 'projects',
  INTERNSHIPS: 'internships',
  LANGUAGES: 'languages',
  CERTIFICATIONS: 'certifications',
  SKILLS: 'skills',
}

/**
 * Maps a section key to its Supabase table.
 *
 * `education` is an existing production table (singular, no `user_` prefix) —
 * `projects`, `internships`, `languages` and `certifications` were created to
 * match that same convention rather than introducing a second naming scheme.
 */
export const SECTION_TABLES = {
  [SECTIONS.EDUCATION]: 'education',
  [SECTIONS.PROJECTS]: 'projects',
  [SECTIONS.INTERNSHIPS]: 'internships',
  [SECTIONS.LANGUAGES]: 'languages',
  [SECTIONS.CERTIFICATIONS]: 'certifications',
}

/**
 * Columns that may be written for each section. Anything not listed is
 * stripped before hitting the DB, so client-only fields (_key, _isNew) and
 * server-managed fields (id, user_id, created_at) can never leak into a write.
 */
export const SECTION_COLUMNS = {
  [SECTIONS.EDUCATION]: [
    'degree', 'institution', 'field_of_study',
    'start_month', 'start_year', 'end_month', 'end_year',
    'currently_studying', 'cgpa', 'description',
  ],
  [SECTIONS.PROJECTS]: [
    'title', 'organization', 'description', 'skills_used',
    'project_url', 'github_url',
    'start_month', 'start_year', 'end_month', 'end_year',
    'currently_working',
  ],
  [SECTIONS.INTERNSHIPS]: [
    'company', 'role', 'location', 'employment_type',
    'start_month', 'start_year', 'end_month', 'end_year',
    'currently_working', 'description',
  ],
  [SECTIONS.LANGUAGES]: ['language', 'proficiency'],
  [SECTIONS.CERTIFICATIONS]: [
    'name', 'issuing_organization',
    'issue_month', 'issue_year', 'expiration_month', 'expiration_year',
    'does_not_expire', 'credential_id', 'credential_url',
  ],
}

/**
 * DB type for each writable column, keyed by column name (safe because no two
 * sections use the same column name for a different type). Drives the
 * string<->DB-type conversion in entries.js, which happens only at the API
 * boundary — every component and hook works with plain strings.
 *
 *   year_int    integer, NOT NULL for start_year/issue_year, nullable otherwise
 *   month_int   integer, nullable — stored as 1-12, shown as a month name
 *   numeric     numeric, nullable (education.cgpa)
 *   boolean     boolean
 *   text_array  text[] (projects.skills_used) — shown as a comma-separated string
 *   text        default: plain text, trimmed
 */
export const COLUMN_TYPES = {
  start_year: 'year_int',
  end_year: 'year_int',
  start_month: 'month_int',
  end_month: 'month_int',
  issue_year: 'year_int',
  issue_month: 'month_int',
  expiration_year: 'year_int',
  expiration_month: 'month_int',
  cgpa: 'numeric',
  currently_studying: 'boolean',
  currently_working: 'boolean',
  does_not_expire: 'boolean',
  skills_used: 'text_array',
}

export const MAX_HEADLINE_LENGTH = 120
export const MAX_ABOUT_LENGTH = 2000
