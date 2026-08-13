import { describe, it, expect } from 'vitest'
import { sanitizeForFilename, buildExportFilenameBase } from './filename'

describe('sanitizeForFilename', () => {
  it('replaces spaces with underscores', () => {
    expect(sanitizeForFilename('Varsha M R')).toBe('Varsha_M_R')
  })

  it('collapses repeated whitespace/dots into a single underscore', () => {
    expect(sanitizeForFilename('Varsha  M.R.')).toBe('Varsha_M_R')
  })

  it('strips invalid filesystem characters and collapses surrounding whitespace', () => {
    expect(sanitizeForFilename('John / Smith')).toBe('John_Smith')
  })

  it('handles every documented invalid character', () => {
    expect(sanitizeForFilename('a/b\\c:d*e?f"g<h>i|j')).toBe('a_b_c_d_e_f_g_h_i_j')
  })

  it('returns empty string for missing/blank input', () => {
    expect(sanitizeForFilename(undefined)).toBe('')
    expect(sanitizeForFilename(null)).toBe('')
    expect(sanitizeForFilename('   ')).toBe('')
  })
})

describe('buildExportFilenameBase', () => {
  it('prefers the sanitized user name with the kind suffix', () => {
    expect(buildExportFilenameBase({ userName: 'Varsha M R', fallbackTitle: 'My Draft', kind: 'resume' }))
      .toBe('Varsha_M_R_resume')
    expect(buildExportFilenameBase({ userName: 'Varsha M R', kind: 'cover_letter' }))
      .toBe('Varsha_M_R_cover_letter')
  })

  it('falls back to the document title when no name is available', () => {
    expect(buildExportFilenameBase({ userName: '', fallbackTitle: 'My Draft', kind: 'resume' }))
      .toBe('My_Draft')
  })

  it('falls back to a bare kind label when neither name nor title is available', () => {
    expect(buildExportFilenameBase({ userName: '', fallbackTitle: '', kind: 'resume' })).toBe('resume')
    expect(buildExportFilenameBase({ userName: undefined, fallbackTitle: null, kind: 'cover_letter' })).toBe('cover_letter')
  })

  it('never produces undefined/null/empty-prefixed filenames', () => {
    const result = buildExportFilenameBase({ userName: undefined, fallbackTitle: undefined, kind: 'resume' })
    expect(result).not.toMatch(/^undefined/)
    expect(result).not.toMatch(/^null/)
    expect(result).not.toMatch(/^_/)
  })
})
