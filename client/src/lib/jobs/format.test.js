import { describe, it, expect } from 'vitest'
import { formatStipend, jobTypeLabel, workModeLabel, companyInitials } from './format'

describe('formatStipend', () => {
  it('returns null when neither salary bound is set', () => {
    expect(formatStipend({ salary_min: null, salary_max: null })).toBeNull()
  })

  it('formats a monthly range in thousands', () => {
    expect(formatStipend({ salary_min: 15000, salary_max: 25000, salary_currency: 'INR' })).toBe('₹15K – ₹25K / mo')
  })

  it('converts a yearly figure down to a monthly figure', () => {
    expect(formatStipend({ salary_min: 240000, salary_max: null, salary_period: 'year', salary_currency: 'INR' })).toBe('₹20K / mo')
  })

  it('respects is_salary_disclosed = false', () => {
    expect(formatStipend({ is_salary_disclosed: false, salary_min: 10000 })).toBe('Unpaid / not disclosed')
  })
})

describe('jobTypeLabel', () => {
  it('maps known job types to display labels', () => {
    expect(jobTypeLabel('full_time')).toBe('Full-time')
    expect(jobTypeLabel('internship')).toBe('Internship')
  })

  it('falls back to the raw value for unknown types', () => {
    expect(jobTypeLabel('freelance')).toBe('freelance')
  })
})

describe('workModeLabel', () => {
  it('maps known work modes to display labels', () => {
    expect(workModeLabel('remote')).toBe('Remote')
    expect(workModeLabel('onsite')).toBe('On-site')
  })
})

describe('companyInitials', () => {
  it('takes the first letter of up to two words', () => {
    expect(companyInitials('MyTechZ Solutions')).toBe('MS')
  })

  it('falls back to a dash for empty input', () => {
    expect(companyInitials('')).toBe('–')
  })
})
