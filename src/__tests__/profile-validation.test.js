import { describe, it, expect } from 'vitest'

import {
  validateEducation,
  validateProjects,
  validateInternships,
  validateLanguages,
  validateCertifications,
  validateSkills,
  validateAbout,
  isValid,
} from '@/app/(app)/profile/lib/validation'

import {
  toWritablePayload,
  normaliseEducation,
  normaliseProject,
  normaliseLanguage,
  normaliseCertification,
  isBlankEntry,
  createEmptyLanguage,
  createEmptyEducation,
  createEmptyCertification,
} from '@/app/(app)/profile/lib/entries'

import {
  formatDateRange,
  sortByRecency,
  splitTokens,
  initialsFrom,
} from '@/app/(app)/profile/lib/format'

import { SECTIONS } from '@/app/(app)/profile/lib/constants'

describe('education validation', () => {
  it('requires degree and institution', () => {
    const errors = validateEducation([{ degree: '', institution: '' }])
    expect(errors[0].degree).toBeTruthy()
    expect(errors[0].institution).toBeTruthy()
  })

  it('accepts a complete record', () => {
    const errors = validateEducation([
      { degree: 'B.E.', institution: 'XYZ College', start_year: '2020', end_year: '2024' },
    ])
    expect(isValid(errors)).toBe(true)
  })

  it('rejects an end date before the start date', () => {
    const errors = validateEducation([
      { degree: 'B.E.', institution: 'XYZ', start_year: '2024', end_year: '2020' },
    ])
    expect(errors[0].end_year).toMatch(/after the start/i)
  })

  it('compares months when the years match', () => {
    const errors = validateEducation([
      {
        degree: 'B.E.', institution: 'XYZ',
        start_year: '2024', start_month: 'June',
        end_year: '2024', end_month: 'March',
      },
    ])
    expect(errors[0].end_year).toBeTruthy()
  })

  it('skips the range check when currently studying', () => {
    const errors = validateEducation([
      {
        degree: 'B.E.', institution: 'XYZ',
        start_year: '2024', end_year: '2020',
        currently_studying: true,
      },
    ])
    expect(isValid(errors)).toBe(true)
  })

  it('rejects an out-of-range cgpa', () => {
    expect(validateEducation([{ degree: 'B', institution: 'X', cgpa: '150' }])[0].cgpa).toBeTruthy()
    expect(validateEducation([{ degree: 'B', institution: 'X', cgpa: 'abc' }])[0].cgpa).toBeTruthy()
    expect(isValid(validateEducation([{ degree: 'B', institution: 'X', cgpa: '8.8', start_year: '2020' }]))).toBe(true)
  })
})

describe('project validation', () => {
  it('requires a title', () => {
    expect(validateProjects([{ title: '' }])[0].title).toBeTruthy()
  })

  it('rejects malformed urls', () => {
    const errors = validateProjects([{ title: 'App', project_url: 'not-a-url' }])
    expect(errors[0].project_url).toBeTruthy()
  })

  it('rejects a non-github url in the github field', () => {
    const errors = validateProjects([{ title: 'App', github_url: 'https://gitlab.com/a/b' }])
    expect(errors[0].github_url).toBeTruthy()
  })

  it('accepts valid urls', () => {
    const errors = validateProjects([{
      title: 'App',
      project_url: 'https://example.com',
      github_url: 'https://github.com/user/repo',
      start_year: '2023',
    }])
    expect(isValid(errors)).toBe(true)
  })

  it('requires a start year', () => {
    expect(validateProjects([{ title: 'App' }])[0].start_year).toBeTruthy()
  })

  it('rejects a javascript: url', () => {
    const errors = validateProjects([{ title: 'App', project_url: 'javascript:alert(1)' }])
    expect(errors[0].project_url).toBeTruthy()
  })
})

describe('internship validation', () => {
  it('requires company and role', () => {
    const errors = validateInternships([{ company: '', role: '' }])
    expect(errors[0].company).toBeTruthy()
    expect(errors[0].role).toBeTruthy()
  })

  it('rejects an unknown employment type', () => {
    const errors = validateInternships([
      { company: 'A', role: 'B', employment_type: 'Wizard' },
    ])
    expect(errors[0].employment_type).toBeTruthy()
  })
})

describe('language validation', () => {
  it('requires a language name', () => {
    expect(validateLanguages([{ language: '', proficiency: 'Native' }])[0].language).toBeTruthy()
  })

  it('flags case-insensitive duplicates on the second occurrence', () => {
    const errors = validateLanguages([
      { language: 'English', proficiency: 'Native' },
      { language: 'english', proficiency: 'Beginner' },
    ])
    expect(errors[0]).toBeUndefined()
    expect(errors[1].language).toMatch(/already listed/i)
  })

  it('rejects an unknown proficiency', () => {
    const errors = validateLanguages([{ language: 'Tamil', proficiency: 'Fluent' }])
    expect(errors[0].proficiency).toBeTruthy()
  })
})

describe('certification validation', () => {
  it('requires a name and issue year', () => {
    const errors = validateCertifications([{ name: '', issue_year: '' }])
    expect(errors[0].name).toBeTruthy()
    expect(errors[0].issue_year).toBeTruthy()
  })

  it('accepts a complete non-expiring credential', () => {
    const errors = validateCertifications([
      { name: 'AWS Certified Developer', issue_year: '2024', does_not_expire: true },
    ])
    expect(isValid(errors)).toBe(true)
  })

  it('does not require an expiration date when it does not expire', () => {
    const errors = validateCertifications([
      { name: 'X', issue_year: '2024', does_not_expire: true, expiration_month: '', expiration_year: '' },
    ])
    expect(isValid(errors)).toBe(true)
  })

  it('rejects an expiration before the issue date', () => {
    const errors = validateCertifications([
      { name: 'X', issue_year: '2024', expiration_year: '2020' },
    ])
    expect(errors[0].expiration_year).toBeTruthy()
  })

  it('rejects an invalid credential url', () => {
    const errors = validateCertifications([
      { name: 'X', issue_year: '2024', credential_url: 'not-a-url' },
    ])
    expect(errors[0].credential_url).toBeTruthy()
  })
})

describe('skills validation', () => {
  it('rejects more than 50 skills', () => {
    expect(validateSkills(Array.from({ length: 51 }, (_, i) => `s${i}`))).toBeTruthy()
  })

  it('rejects an overlong skill', () => {
    expect(validateSkills(['x'.repeat(51)])).toBeTruthy()
  })

  it('accepts a normal list', () => {
    expect(validateSkills(['React', 'Node.js'])).toBeNull()
  })
})

describe('about validation', () => {
  it('requires a full name', () => {
    expect(validateAbout({ full_name: '   ' }).full_name).toBeTruthy()
  })

  it('enforces the headline limit', () => {
    expect(validateAbout({ full_name: 'A', headline: 'x'.repeat(121) }).headline).toBeTruthy()
  })

  it('rejects a non-linkedin url', () => {
    const errors = validateAbout({ full_name: 'A', linkedin_url: 'https://twitter.com/x' })
    expect(errors.linkedin_url).toBeTruthy()
  })

  it('accepts a linkedin url with or without www', () => {
    expect(validateAbout({ full_name: 'A', linkedin_url: 'https://linkedin.com/in/x' }).linkedin_url)
      .toBeUndefined()
    expect(validateAbout({ full_name: 'A', linkedin_url: 'https://www.linkedin.com/in/x' }).linkedin_url)
      .toBeUndefined()
  })

  it('rejects an implausible phone number', () => {
    expect(validateAbout({ full_name: 'A', phone: '123' }).phone).toBeTruthy()
    expect(validateAbout({ full_name: 'A', phone: '+91 9876543210' }).phone).toBeUndefined()
  })

  it('rejects a non-github url in the github field', () => {
    const errors = validateAbout({ full_name: 'A', github_url: 'https://gitlab.com/x' })
    expect(errors.github_url).toBeTruthy()
  })

  it('accepts a valid github url', () => {
    expect(validateAbout({ full_name: 'A', github_url: 'https://github.com/x' }).github_url)
      .toBeUndefined()
  })

  it('rejects a malformed portfolio url but accepts a valid one', () => {
    expect(validateAbout({ full_name: 'A', portfolio_url: 'not-a-url' }).portfolio_url)
      .toBeTruthy()
    expect(validateAbout({ full_name: 'A', portfolio_url: 'https://example.com' }).portfolio_url)
      .toBeUndefined()
  })
})

describe('entry normalisation', () => {
  it('converts null columns to empty strings so inputs stay controlled', () => {
    const row = normaliseEducation({
      id: 'abc', degree: null, institution: null, field_of_study: null,
      cgpa: null, description: null, currently_studying: null,
    })
    expect(row.degree).toBe('')
    expect(row.field_of_study).toBe('')
    expect(row.currently_studying).toBe(false)
  })

  it('defaults a missing proficiency to Beginner', () => {
    expect(normaliseLanguage({ id: '1', language: 'Tamil', proficiency: null }).proficiency)
      .toBe('Beginner')
  })

  it('reuses the row id as the react key so keys stay stable', () => {
    expect(normaliseEducation({ id: 'row-1' })._key).toBe('row-1')
  })
})

describe('toWritablePayload', () => {
  it('strips client-only and server-managed keys', () => {
    const payload = toWritablePayload(SECTIONS.LANGUAGES, {
      id: 'abc', user_id: 'evil', created_at: 'x', _key: 'k',
      language: 'Tamil', proficiency: 'Native',
    })
    expect(payload).toEqual({ language: 'Tamil', proficiency: 'Native' })
  })

  it('keeps booleans as booleans rather than coercing to a string', () => {
    const payload = toWritablePayload(SECTIONS.EDUCATION, {
      degree: 'B.E.', currently_studying: true,
    })
    expect(payload.currently_studying).toBe(true)

    const missing = toWritablePayload(SECTIONS.EDUCATION, { degree: 'B.E.' })
    expect(missing.currently_studying).toBe(false)
  })

  it('trims string values', () => {
    expect(toWritablePayload(SECTIONS.LANGUAGES, { language: '  Tamil  ' }).language).toBe('Tamil')
  })

  it('throws on an unknown section', () => {
    expect(() => toWritablePayload('bogus', {})).toThrow(/Unknown profile section/)
  })

  it('converts month names and years to the integer columns the DB actually has', () => {
    const payload = toWritablePayload(SECTIONS.EDUCATION, {
      degree: 'B.E.', institution: 'XYZ',
      start_month: 'June', start_year: '2020',
      end_month: '', end_year: '',
      cgpa: '8.8',
    })
    expect(payload.start_month).toBe(6)
    expect(payload.start_year).toBe(2020)
    expect(payload.end_month).toBeNull()
    expect(payload.end_year).toBeNull()
    expect(payload.cgpa).toBe(8.8)
    expect(typeof payload.start_month).toBe('number')
  })

  it('sends null, not 0 or NaN, for a blank optional numeric field', () => {
    expect(toWritablePayload(SECTIONS.EDUCATION, { cgpa: '' }).cgpa).toBeNull()
    expect(toWritablePayload(SECTIONS.EDUCATION, { start_month: '' }).start_month).toBeNull()
  })

  it('converts skills_used from a comma string into a deduplicated array', () => {
    const payload = toWritablePayload(SECTIONS.PROJECTS, {
      title: 'App', skills_used: 'React, Node.js, React',
    })
    expect(payload.skills_used).toEqual(['React', 'Node.js'])
  })
})

describe('DB -> form round trip (normalise* after toWritablePayload)', () => {
  it('education: integer month/year and numeric cgpa come back as form strings', () => {
    const row = normaliseEducation({
      id: 'row-1', degree: 'B.E.', institution: 'XYZ', field_of_study: null,
      start_month: 6, start_year: 2020, end_month: null, end_year: null,
      cgpa: '8.80', currently_studying: false, description: null,
    })
    expect(row.start_month).toBe('June')
    expect(row.start_year).toBe('2020')
    expect(row.end_month).toBe('')
    expect(row.cgpa).toBe('8.80')
  })

  it('projects: a text[] skills_used column becomes a comma string for the input', () => {
    const row = normaliseProject({
      id: 'row-1', title: 'App', organization: '', description: null,
      skills_used: ['React', 'Node.js'], project_url: null, github_url: null,
      start_month: 3, start_year: 2023, end_month: null, end_year: null,
      currently_working: true,
    })
    expect(row.skills_used).toBe('React, Node.js')
    expect(row.start_month).toBe('March')
  })

  it('projects: an empty or null skills_used array becomes an empty string, not "null"', () => {
    expect(normaliseProject({ id: '1', skills_used: [] }).skills_used).toBe('')
    expect(normaliseProject({ id: '1', skills_used: null }).skills_used).toBe('')
  })

  it('certifications: issue_/expiration_ integer columns round-trip through toWritablePayload', () => {
    const payload = toWritablePayload(SECTIONS.CERTIFICATIONS, {
      name: 'AWS Certified Developer', issuing_organization: 'AWS',
      issue_month: 'June', issue_year: '2024',
      expiration_month: '', expiration_year: '',
      does_not_expire: true, credential_id: 'ABC123', credential_url: '',
    })
    expect(payload.issue_month).toBe(6)
    expect(payload.issue_year).toBe(2024)
    expect(payload.expiration_month).toBeNull()
    expect(payload.does_not_expire).toBe(true)

    const row = normaliseCertification({
      id: 'row-1', name: 'AWS Certified Developer', issuing_organization: 'AWS',
      issue_month: 6, issue_year: 2024, expiration_month: null, expiration_year: null,
      does_not_expire: true, credential_id: 'ABC123', credential_url: null,
    })
    expect(row.issue_month).toBe('June')
    expect(row.issue_year).toBe('2024')
    expect(row.does_not_expire).toBe(true)
    expect(row.credential_url).toBe('')
  })

  it('certifications: a freshly added row is blank even with the does_not_expire default', () => {
    expect(isBlankEntry(SECTIONS.CERTIFICATIONS, createEmptyCertification())).toBe(true)
    expect(isBlankEntry(SECTIONS.CERTIFICATIONS, { ...createEmptyCertification(), name: 'X' }))
      .toBe(false)
  })
})

describe('isBlankEntry', () => {
  it('treats a freshly added row as blank even when it has a seeded default', () => {
    // Languages start at 'Beginner', so a "has any non-empty value" check would
    // wrongly treat an untouched new row as filled in.
    expect(isBlankEntry(SECTIONS.LANGUAGES, createEmptyLanguage())).toBe(true)
    expect(isBlankEntry(SECTIONS.EDUCATION, createEmptyEducation())).toBe(true)
  })

  it('is not blank once the user types anything', () => {
    expect(isBlankEntry(SECTIONS.LANGUAGES, { ...createEmptyLanguage(), language: 'Tamil' }))
      .toBe(false)
  })

  it('is not blank when a proficiency is changed from the default', () => {
    expect(isBlankEntry(SECTIONS.LANGUAGES, { ...createEmptyLanguage(), proficiency: 'Native' }))
      .toBe(false)
  })

  it('never treats a persisted row as blank', () => {
    expect(isBlankEntry(SECTIONS.LANGUAGES, { ...createEmptyLanguage(), id: 'row-1' })).toBe(false)
  })

  it('treats a checkbox toggle as a real edit', () => {
    expect(isBlankEntry(SECTIONS.EDUCATION, { ...createEmptyEducation(), currently_studying: true }))
      .toBe(false)
  })
})

describe('formatting', () => {
  it('renders a full month-year range', () => {
    expect(formatDateRange(
      { start_month: 'March', start_year: '2021', end_month: 'May', end_year: '2024' },
    )).toBe('March 2021 – May 2024')
  })

  it('renders Present for ongoing entries', () => {
    expect(formatDateRange(
      { start_month: 'March', start_year: '2021', currently_working: true },
      { ongoingFlag: 'currently_working' },
    )).toBe('March 2021 – Present')
  })

  it('returns an empty string when there are no dates', () => {
    expect(formatDateRange({})).toBe('')
  })

  it('sorts ongoing entries first, then by most recent end date', () => {
    const sorted = sortByRecency(
      [
        { id: 'old', end_year: '2019' },
        { id: 'ongoing', currently_working: true },
        { id: 'recent', end_year: '2024' },
      ],
      'currently_working',
    )
    expect(sorted.map((e) => e.id)).toEqual(['ongoing', 'recent', 'old'])
  })

  it('sorts years numerically, not lexicographically', () => {
    // A plain string sort would place '9' after '10'.
    const sorted = sortByRecency([{ id: 'a', end_year: '999' }, { id: 'b', end_year: '1000' }])
    expect(sorted[0].id).toBe('b')
  })

  it('splits and de-duplicates comma-separated tokens', () => {
    expect(splitTokens('React, node.js , React,, Vue')).toEqual(['React', 'node.js', 'Vue'])
  })

  it('formats and sorts by custom date field names (certifications)', () => {
    const fields = {
      startMonth: 'issue_month', startYear: 'issue_year',
      endMonth: 'expiration_month', endYear: 'expiration_year',
    }

    expect(formatDateRange(
      { issue_month: 'June', issue_year: '2024', does_not_expire: true },
      { ongoingFlag: 'does_not_expire', ongoingLabel: 'No Expiration', fields },
    )).toBe('June 2024 – No Expiration')

    const sorted = sortByRecency(
      [
        { id: 'expired', expiration_year: '2020' },
        { id: 'never-expires', does_not_expire: true },
        { id: 'expires-later', expiration_year: '2030' },
      ],
      'does_not_expire',
      fields,
    )
    expect(sorted.map((e) => e.id)).toEqual(['never-expires', 'expires-later', 'expired'])
  })

  it('builds initials from a name', () => {
    expect(initialsFrom('Naresh Raja')).toBe('NR')
    expect(initialsFrom('naresh')).toBe('N')
    expect(initialsFrom('')).toBe('U')
  })
})
