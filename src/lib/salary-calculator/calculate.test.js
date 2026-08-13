import { describe, it, expect } from 'vitest'
import { calculateSalaryBreakdown, compareRegimes, calculateHike } from './calculate'
import { computeSlabTax, computeNewRegimeTax, NEW_REGIME_SLABS } from './taxSlabs'

describe('computeSlabTax', () => {
  it('applies 0% to the first slab', () => {
    expect(computeSlabTax(300000, NEW_REGIME_SLABS)).toBe(0)
  })

  it('applies each band only to the income within it', () => {
    // 500,000 -> 400,000 at 0% + 100,000 at 5% = 5,000
    expect(computeSlabTax(500000, NEW_REGIME_SLABS)).toBe(5000)
  })

  it('handles zero and negative income safely', () => {
    expect(computeSlabTax(0, NEW_REGIME_SLABS)).toBe(0)
    expect(computeSlabTax(-1000, NEW_REGIME_SLABS)).toBe(0)
  })
})

describe('computeNewRegimeTax — 87A rebate boundary', () => {
  it('is exactly zero at and below the 12L taxable-income rebate limit', () => {
    expect(computeNewRegimeTax(1200000)).toBe(0)
    expect(computeNewRegimeTax(1080312)).toBe(0) // matches the 12L-CTC case below
  })

  it('is non-zero just above the rebate limit', () => {
    expect(computeNewRegimeTax(1200001)).toBeGreaterThan(0)
  })
})

describe('calculateSalaryBreakdown — structural invariants (hold for any CTC)', () => {
  const cases = [600000, 1200000, 2000000, 3500000, 6000000]

  it.each(cases)('in-hand <= gross <= ctc for CTC %i', (ctc) => {
    const r = calculateSalaryBreakdown({ ctc })
    expect(r.inHand.annual).toBeLessThanOrEqual(r.gross.annual)
    expect(r.gross.annual).toBeLessThanOrEqual(r.ctc.annual)
    expect(r.inHand.annual).toBeGreaterThan(0)
  })

  it.each(cases)('salary components sum back to gross for CTC %i', (ctc) => {
    const r = calculateSalaryBreakdown({ ctc })
    const sum = r.components.basic.annual + r.components.hra.annual + r.components.specialAllowance.annual
    expect(sum).toBeCloseTo(r.gross.annual, 2)
  })

  it.each(cases)('monthly figures are annual / 12 for CTC %i', (ctc) => {
    const r = calculateSalaryBreakdown({ ctc })
    expect(r.inHand.monthly).toBeCloseTo(r.inHand.annual / 12, 6)
  })

  it('caps PF contribution once monthly Basic exceeds the wage ceiling', () => {
    // Basic = 40% of CTC; monthly Basic > 15,000 once CTC > 450,000
    const r = calculateSalaryBreakdown({ ctc: 1200000 })
    expect(r.deductions.employeePf.monthly).toBeCloseTo(1800, 2)
  })
})

describe('calculateSalaryBreakdown — 12 LPA, new regime, metro (hand-verified)', () => {
  const r = calculateSalaryBreakdown({ ctc: 1200000, regime: 'new', isMetro: true })

  it('computes Basic as 40% of CTC', () => {
    expect(r.components.basic.annual).toBeCloseTo(480000, 2)
  })

  it('caps employer/employee PF at 1,800/month once Basic crosses the ceiling', () => {
    expect(r.employer.pf.annual).toBeCloseTo(21600, 2)
    expect(r.deductions.employeePf.annual).toBeCloseTo(21600, 2)
  })

  it('is not ESI-eligible at this income level', () => {
    expect(r.employer.esi.eligible).toBe(false)
    expect(r.deductions.employeeEsi.annual).toBe(0)
  })

  it('pays zero income tax (under the 87A rebate threshold)', () => {
    expect(r.deductions.incomeTax.annual).toBe(0)
    expect(r.isZeroTax).toBe(true)
  })

  it('produces the expected in-hand figure', () => {
    // Gross 1,155,312 - employeePF 21,600 - PT 2,400 (default state) - tax 0
    expect(r.inHand.annual).toBeCloseTo(1131312, 2)
    expect(r.inHand.monthly).toBeCloseTo(94276, 2)
  })
})

describe('compareRegimes', () => {
  it('returns both regimes and picks the one with higher in-hand', () => {
    const result = compareRegimes({ ctc: 1200000 })
    expect(['new', 'old']).toContain(result.betterRegime)
    const higher = result.betterRegime === 'new' ? result.newRegime : result.oldRegime
    const lower = result.betterRegime === 'new' ? result.oldRegime : result.newRegime
    expect(higher.inHand.annual).toBeGreaterThanOrEqual(lower.inHand.annual)
  })
})

describe('calculateHike', () => {
  it('increases CTC by the given percentage and reports a positive delta for a raise', () => {
    const result = calculateHike({ currentCtc: 1000000, hikePercent: 20 })
    expect(result.updated.ctc.annual).toBeCloseTo(1200000, 2)
    expect(result.ctcDelta).toBeCloseTo(200000, 2)
    expect(result.inHandDelta.annual).toBeGreaterThan(0)
  })
})

describe('calculateSalaryBreakdown — deductions integration', () => {
  it('is fully backward compatible: omitting `deductions` behaves exactly as before', () => {
    const withNoArg = calculateSalaryBreakdown({ ctc: 2000000, regime: 'old' })
    const withEmptyDeductions = calculateSalaryBreakdown({ ctc: 2000000, regime: 'old', deductions: {} })
    expect(withNoArg.inHand.annual).toBeCloseTo(withEmptyDeductions.inHand.annual, 6)
    expect(withNoArg.taxSavings.total).toBe(0)
  })

  it('HRA/80C/80D deductions only reduce tax under the old regime, never the new regime', () => {
    const deductions = { rentPaidAnnual: 300000, investment80C: 150000, health80DSelf: 25000 }
    const newRegime = calculateSalaryBreakdown({ ctc: 2000000, regime: 'new', deductions })
    const newRegimeNoDeductions = calculateSalaryBreakdown({ ctc: 2000000, regime: 'new' })
    expect(newRegime.deductions.incomeTax.annual).toBe(newRegimeNoDeductions.deductions.incomeTax.annual)
    expect(newRegime.taxSavings.hraExemption).toBe(0)
    expect(newRegime.taxSavings.section80C).toBe(0)
  })

  it('old regime tax drops (or stays the same) once real deductions are added', () => {
    const base = calculateSalaryBreakdown({ ctc: 2000000, regime: 'old' })
    const withDeductions = calculateSalaryBreakdown({
      ctc: 2000000, regime: 'old',
      deductions: { rentPaidAnnual: 300000, investment80C: 150000, health80DSelf: 25000 },
    })
    expect(withDeductions.deductions.incomeTax.annual).toBeLessThanOrEqual(base.deductions.incomeTax.annual)
    expect(withDeductions.inHand.annual).toBeGreaterThanOrEqual(base.inHand.annual)
    expect(withDeductions.taxSavings.total).toBeGreaterThan(0)
  })

  it('employer NPS reduces taxable income under both regimes', () => {
    for (const regime of ['new', 'old']) {
      const base = calculateSalaryBreakdown({ ctc: 2000000, regime })
      const withNps = calculateSalaryBreakdown({ ctc: 2000000, regime, deductions: { npsPctOfBasic: 0.10 } })
      expect(withNps.taxableIncome).toBeLessThan(base.taxableIncome)
      expect(withNps.taxSavings.employerNps).toBeGreaterThan(0)
    }
  })
})
