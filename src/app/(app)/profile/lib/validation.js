/**
 * Validation for profile sections.
 *
 * Every validator returns a map of `{ [rowIndex]: { [field]: message } }`.
 * An empty object means the section is valid. The same validators run on the
 * client (instant feedback) and inside the API routes (trust boundary), so a
 * crafted request can't bypass them.
 */

import {
  MONTH_INDEX,
  PROFICIENCY_LEVELS,
  EMPLOYMENT_TYPES,
  MAX_HEADLINE_LENGTH,
  MAX_ABOUT_LENGTH,
} from './constants'

const isBlank = (v) => !v || String(v).trim() === ''

function isValidUrl(value, { requireHost } = {}) {
  if (isBlank(value)) return true
  let url
  try {
    url = new URL(String(value).trim())
  } catch {
    return false
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
  if (requireHost && !url.hostname.toLowerCase().includes(requireHost)) return false
  return true
}

/**
 * A start date must not be after an end date. Years are TEXT in the DB, so
 * compare numerically after parsing. Returns true when the range is coherent
 * or when there isn't enough information to judge.
 */
function isChronological(entry) {
  const sy = parseInt(entry.start_year, 10)
  const ey = parseInt(entry.end_year, 10)
  if (Number.isNaN(sy) || Number.isNaN(ey)) return true
  if (sy !== ey) return sy < ey
  const sm = MONTH_INDEX[entry.start_month]
  const em = MONTH_INDEX[entry.end_month]
  if (!sm || !em) return true
  return sm <= em
}

/**
 * Shared date-range rules for Education / Projects / Internships.
 *
 * start_year is required, not just recommended: the education/projects/
 * internships tables all define it NOT NULL, so an entry that's missing it
 * would fail at the database with a 23502 error rather than a friendly
 * message if this check didn't catch it first.
 */
function validateDateRange(entry, rowErrors, currentFlag) {
  const ongoing = entry[currentFlag] === true

  if (isBlank(entry.start_year)) {
    rowErrors.start_year = 'Start year is required.'
  }
  if (entry.end_month && !entry.end_year && !ongoing) {
    rowErrors.end_year = 'Select an end year.'
  }
  if (!ongoing && !isChronological(entry)) {
    rowErrors.end_year = 'End date must be after the start date.'
  }
}

// ─── Education ───────────────────────────────────────────────────────────────

export function validateEducation(entries) {
  const errors = {}
  entries.forEach((entry, i) => {
    const row = {}
    if (isBlank(entry.degree)) row.degree = 'Degree is required.'
    if (isBlank(entry.institution)) row.institution = 'Institution is required.'

    if (!isBlank(entry.cgpa)) {
      const cgpa = Number(entry.cgpa)
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 100) {
        row.cgpa = 'Enter a valid CGPA or percentage.'
      }
    }
    validateDateRange(entry, row, 'currently_studying')

    if (Object.keys(row).length) errors[i] = row
  })
  return errors
}

// ─── Projects ────────────────────────────────────────────────────────────────

export function validateProjects(entries) {
  const errors = {}
  entries.forEach((entry, i) => {
    const row = {}
    if (isBlank(entry.title)) row.title = 'Project title is required.'

    if (!isValidUrl(entry.project_url)) {
      row.project_url = 'Enter a valid URL starting with http:// or https://'
    }
    if (!isValidUrl(entry.github_url, { requireHost: 'github.com' })) {
      row.github_url = 'Enter a valid GitHub URL.'
    }
    validateDateRange(entry, row, 'currently_working')

    if (Object.keys(row).length) errors[i] = row
  })
  return errors
}

// ─── Internships ─────────────────────────────────────────────────────────────

export function validateInternships(entries) {
  const errors = {}
  entries.forEach((entry, i) => {
    const row = {}
    if (isBlank(entry.company)) row.company = 'Company is required.'
    if (isBlank(entry.role)) row.role = 'Role is required.'

    if (!isBlank(entry.employment_type) && !EMPLOYMENT_TYPES.includes(entry.employment_type)) {
      row.employment_type = 'Choose a valid employment type.'
    }
    validateDateRange(entry, row, 'currently_working')

    if (Object.keys(row).length) errors[i] = row
  })
  return errors
}

// ─── Languages ───────────────────────────────────────────────────────────────

export function validateLanguages(entries) {
  const errors = {}
  const seen = new Map()

  entries.forEach((entry, i) => {
    const row = {}
    const name = String(entry.language ?? '').trim()

    if (isBlank(name)) {
      row.language = 'Language is required.'
    } else {
      const key = name.toLowerCase()
      if (seen.has(key)) row.language = 'This language is already listed.'
      else seen.set(key, i)
    }

    if (!PROFICIENCY_LEVELS.includes(entry.proficiency)) {
      row.proficiency = 'Choose a proficiency level.'
    }

    if (Object.keys(row).length) errors[i] = row
  })
  return errors
}

// ─── Certifications ──────────────────────────────────────────────────────────

/**
 * Certifications use issue_year/expiration_year rather than start_year/
 * end_year, and "does it expire" rather than "is it ongoing" — different
 * enough from validateDateRange's field names that reusing it would mean
 * threading four field-name parameters through, so this is its own check.
 */
export function validateCertifications(entries) {
  const errors = {}
  entries.forEach((entry, i) => {
    const row = {}
    if (isBlank(entry.name)) row.name = 'Certification name is required.'
    if (isBlank(entry.issue_year)) row.issue_year = 'Issue year is required.'

    const expires = entry.does_not_expire !== true
    if (expires) {
      if (entry.expiration_month && !entry.expiration_year) {
        row.expiration_year = 'Select an expiration year.'
      }
      const iy = parseInt(entry.issue_year, 10)
      const ey = parseInt(entry.expiration_year, 10)
      if (!Number.isNaN(iy) && !Number.isNaN(ey)) {
        const im = MONTH_INDEX[entry.issue_month]
        const em = MONTH_INDEX[entry.expiration_month]
        const coherent = iy !== ey ? iy < ey : !im || !em || im <= em
        if (!coherent) row.expiration_year = 'Expiration must be after the issue date.'
      }
    }

    if (!isValidUrl(entry.credential_url)) {
      row.credential_url = 'Enter a valid URL starting with http:// or https://'
    }

    if (Object.keys(row).length) errors[i] = row
  })
  return errors
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export function validateSkills(skills) {
  if (!Array.isArray(skills)) return 'Skills must be a list.'
  if (skills.length > 50) return 'You can add up to 50 skills.'
  if (skills.some((s) => String(s).trim().length > 50)) {
    return 'Each skill must be 50 characters or fewer.'
  }
  return null
}

// ─── About / personal details ────────────────────────────────────────────────

export function validateAbout(values) {
  const errors = {}

  if (isBlank(values.full_name)) {
    errors.full_name = 'Full name is required.'
  } else if (values.full_name.trim().length > 100) {
    errors.full_name = 'Full name must be 100 characters or fewer.'
  }

  if (!isBlank(values.headline) && values.headline.length > MAX_HEADLINE_LENGTH) {
    errors.headline = `Headline must be ${MAX_HEADLINE_LENGTH} characters or fewer.`
  }

  if (!isBlank(values.about) && values.about.length > MAX_ABOUT_LENGTH) {
    errors.about = `About must be ${MAX_ABOUT_LENGTH} characters or fewer.`
  }

  if (!isBlank(values.phone)) {
    const digits = String(values.phone).replace(/[^\d]/g, '')
    if (digits.length < 10 || digits.length > 15) {
      errors.phone = 'Enter a valid phone number.'
    }
  }

  if (!isBlank(values.total_experience_years)) {
    const years = Number(values.total_experience_years)
    if (Number.isNaN(years) || years < 0 || years > 50) {
      errors.total_experience_years = 'Enter a number of years between 0 and 50.'
    }
  }

  if (!isValidUrl(values.linkedin_url, { requireHost: 'linkedin.com' })) {
    errors.linkedin_url = 'Enter a valid LinkedIn URL.'
  }

  if (!isValidUrl(values.github_url, { requireHost: 'github.com' })) {
    errors.github_url = 'Enter a valid GitHub URL.'
  }

  if (!isValidUrl(values.portfolio_url)) {
    errors.portfolio_url = 'Enter a valid URL starting with http:// or https://'
  }

  return errors
}

export const VALIDATORS = {
  education: validateEducation,
  projects: validateProjects,
  internships: validateInternships,
  languages: validateLanguages,
  certifications: validateCertifications,
}

/** True when a validator result contains no row errors. */
export function isValid(errors) {
  return !errors || Object.keys(errors).length === 0
}
