import { describe, it, expect } from 'vitest'
import { calculateHraExemption, cap80C, calculate80D, calculateNpsExemption } from './deductions'

describe('calculateHraExemption', () => {
  const basicAnnual = 480000 // 40,000/month
  const hraReceived = 240000 // 50% of basic, metro

  it('takes the minimum of actual HRA, rent-10%-of-basic, and the metro/non-metro cap', () => {
    // Rent 300,000/yr -> rent - 10% basic = 300,000 - 48,000 = 252,000
    // Metro cap = 50% of basic = 240,000
    // Actual HRA = 240,000
    // Min of (240,000, 252,000, 240,000) = 240,000
    expect(calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual: 300000, isMetro: true })).toBeCloseTo(240000, 2)
  })

  it('is limited by rent paid when rent is low relative to basic', () => {
    // Rent 60,000/yr -> rent - 10% basic = 60,000 - 48,000 = 12,000 (the binding constraint)
    expect(calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual: 60000, isMetro: true })).toBeCloseTo(12000, 2)
  })

  it('returns 0 when rent paid is at or below 10% of basic', () => {
    expect(calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual: 40000, isMetro: true })).toBe(0)
  })

  it('returns 0 when no rent is paid', () => {
    expect(calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual: 0, isMetro: true })).toBe(0)
  })

  it('uses the lower non-metro cap (40% of basic)', () => {
    // Huge rent so the cap is the binding constraint: 40% of 480,000 = 192,000
    expect(calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual: 1000000, isMetro: false })).toBeCloseTo(192000, 2)
  })
})

describe('cap80C', () => {
  it('passes through amounts under the cap', () => {
    expect(cap80C(100000)).toBe(100000)
  })
  it('caps at 1,50,000', () => {
    expect(cap80C(300000)).toBe(150000)
  })
  it('floors negative/invalid input at 0', () => {
    expect(cap80C(-500)).toBe(0)
    expect(cap80C(undefined)).toBe(0)
  })
})

describe('calculate80D', () => {
  it('applies the standard 25,000 caps for non-seniors', () => {
    const result = calculate80D({ selfPremium: 30000, selfSenior: false, parentsPremium: 30000, parentsSenior: false })
    expect(result).toBe(25000 + 25000)
  })

  it('applies the higher 50,000 senior-citizen caps', () => {
    const result = calculate80D({ selfPremium: 60000, selfSenior: true, parentsPremium: 60000, parentsSenior: true })
    expect(result).toBe(50000 + 50000)
  })

  it('sums self and parents independently under their own caps', () => {
    const result = calculate80D({ selfPremium: 10000, selfSenior: false, parentsPremium: 40000, parentsSenior: true })
    expect(result).toBe(10000 + 40000)
  })
})

describe('calculateNpsExemption', () => {
  it('computes the given percentage of basic', () => {
    expect(calculateNpsExemption({ basicAnnual: 480000, npsPctOfBasic: 0.10 })).toBeCloseTo(48000, 2)
  })

  it('caps at the 10% private-sector maximum even if a larger % is requested', () => {
    expect(calculateNpsExemption({ basicAnnual: 480000, npsPctOfBasic: 0.20 })).toBeCloseTo(48000, 2)
  })

  it('is zero when no NPS contribution is entered', () => {
    expect(calculateNpsExemption({ basicAnnual: 480000, npsPctOfBasic: 0 })).toBe(0)
  })
})
