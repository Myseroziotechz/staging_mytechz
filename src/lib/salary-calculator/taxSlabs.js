/**
 * Income tax slabs — FY 2026-27 (Assessment Year 2027-28).
 * Kept as one small, easy-to-update file per year, per the plan's own
 * "just update taxSlabs.js yearly" design goal.
 */

export const NEW_REGIME_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.10 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.20 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.30 },
]

export const OLD_REGIME_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
]

export const NEW_REGIME_STANDARD_DEDUCTION = 75000
export const OLD_REGIME_STANDARD_DEDUCTION = 50000

// Section 87A rebate — new regime: full rebate (tax reduced to 0) when
// taxable income (after standard deduction) is <= this threshold. This is
// why a real "0 tax" line exists at ~12.75L gross (12L taxable + 75k std
// deduction), not a rounding artifact.
export const NEW_REGIME_REBATE_TAXABLE_INCOME_LIMIT = 1200000
export const NEW_REGIME_REBATE_MAX_TAX = 60000 // rebate caps out here; irrelevant once income already implies 0 tax at the limit above, kept for correctness at the boundary

export const OLD_REGIME_REBATE_TAXABLE_INCOME_LIMIT = 500000
export const OLD_REGIME_REBATE_MAX_TAX = 12500

export const CESS_RATE = 0.04 // Health & Education Cess, on (tax + surcharge), both regimes

// Surcharge slabs — applied to tax (before cess) once taxable income crosses these bands.
export const SURCHARGE_SLABS = [
  { upto: 5000000, rate: 0 },
  { upto: 10000000, rate: 0.10 },
  { upto: 20000000, rate: 0.15 },
  { upto: Infinity, rate: 0.25 }, // simplified: new-regime cap; old regime's 37% band above 5Cr is a rare edge case not modelled for v1
]

/**
 * Computes tax on a taxable-income amount against a progressive slab table.
 * Slabs are cumulative "upto" bands — each band's rate applies only to the
 * income that falls within it.
 */
export function computeSlabTax(taxableIncome, slabs) {
  if (taxableIncome <= 0) return 0
  let tax = 0
  let lastCap = 0
  for (const { upto, rate } of slabs) {
    if (taxableIncome <= lastCap) break
    const bandTop = Math.min(taxableIncome, upto)
    tax += (bandTop - lastCap) * rate
    lastCap = upto
  }
  return tax
}

function computeSurcharge(taxableIncome, taxBeforeSurcharge) {
  if (taxBeforeSurcharge <= 0) return 0
  let rate = 0
  for (const { upto, rate: r } of SURCHARGE_SLABS) {
    if (taxableIncome <= upto) { rate = r; break }
  }
  return taxBeforeSurcharge * rate
}

/**
 * Full new-regime tax computation: slab tax -> 87A rebate -> surcharge -> cess.
 * `taxableIncome` is income AFTER the standard deduction is already subtracted.
 */
export function computeNewRegimeTax(taxableIncome) {
  if (taxableIncome <= NEW_REGIME_REBATE_TAXABLE_INCOME_LIMIT) return 0

  const slabTax = computeSlabTax(taxableIncome, NEW_REGIME_SLABS)
  const surcharge = computeSurcharge(taxableIncome, slabTax)
  const cess = (slabTax + surcharge) * CESS_RATE
  return Math.round(slabTax + surcharge + cess)
}

/** Same shape as computeNewRegimeTax, for the old regime. */
export function computeOldRegimeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0

  const slabTax = computeSlabTax(taxableIncome, OLD_REGIME_SLABS)
  // 87A rebate under the old regime: full rebate up to its own (lower) limit.
  const rebate = taxableIncome <= OLD_REGIME_REBATE_TAXABLE_INCOME_LIMIT
    ? Math.min(slabTax, OLD_REGIME_REBATE_MAX_TAX)
    : 0
  const taxAfterRebate = Math.max(0, slabTax - rebate)
  const surcharge = computeSurcharge(taxableIncome, taxAfterRebate)
  const cess = (taxAfterRebate + surcharge) * CESS_RATE
  return Math.round(taxAfterRebate + surcharge + cess)
}
