import { describe, it, expect } from 'vitest'
import { estimateBasicPay, calculateGovernmentPay, PAY_MATRIX_LEVELS } from './governmentPay'
import { computeTaxForGrossIncome } from './calculate'

describe('estimateBasicPay', () => {
  it('returns the entry pay with zero years in level', () => {
    expect(estimateBasicPay(1, 0)).toBe(18000)
    expect(estimateBasicPay(10, 0)).toBe(56100)
  })

  it('applies compounding annual increments for years in level', () => {
    const oneYear = estimateBasicPay(10, 1)
    expect(oneYear).toBeGreaterThan(56100)
    expect(oneYear).toBeCloseTo(56100 * 1.03, 0)
  })

  it('returns 0 for an unknown level', () => {
    expect(estimateBasicPay('not-a-level', 0)).toBe(0)
  })

  it('every documented level is present and pay increases monotonically with level', () => {
    expect(PAY_MATRIX_LEVELS.length).toBeGreaterThanOrEqual(18)
    for (let i = 1; i < PAY_MATRIX_LEVELS.length; i++) {
      expect(PAY_MATRIX_LEVELS[i].entryPay).toBeGreaterThanOrEqual(PAY_MATRIX_LEVELS[i - 1].entryPay)
    }
  })
})

describe('calculateGovernmentPay', () => {
  it('computes gross as Basic + DA + HRA', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 50, cityClass: 'X', computeTax: computeTaxForGrossIncome })
    const expectedGross = result.basic.monthly + result.da.monthly + result.hra.monthly
    expect(result.gross.monthly).toBeCloseTo(expectedGross, 2)
  })

  it('uses the 30% HRA band once DA is at or above 50%', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 50, cityClass: 'X', computeTax: computeTaxForGrossIncome })
    expect(result.hra.ratePct).toBeCloseTo(0.30, 4)
  })

  it('uses the lower 24% HRA band when DA is below 25%', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 10, cityClass: 'X', computeTax: computeTaxForGrossIncome })
    expect(result.hra.ratePct).toBeCloseTo(0.24, 4)
  })

  it('applies mandatory employee NPS as 10% of Basic + DA', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 50, cityClass: 'X', computeTax: computeTaxForGrossIncome })
    const expectedNps = (result.basic.monthly + result.da.monthly) * 0.10
    expect(result.deductions.employeeNps.monthly).toBeCloseTo(expectedNps, 2)
  })

  it('in-hand is less than gross once deductions are applied', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 50, cityClass: 'X', computeTax: computeTaxForGrossIncome })
    expect(result.inHand.annual).toBeLessThan(result.gross.annual)
  })

  it('falls back to zero tax gracefully when no computeTax function is injected', () => {
    const result = calculateGovernmentPay({ level: 10, daPercent: 50, cityClass: 'X' })
    expect(result.deductions.incomeTax.annual).toBe(0)
  })
})
