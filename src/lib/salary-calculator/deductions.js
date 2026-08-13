/**
 * Old-regime deduction calculations (HRA exemption, 80C, 80D) plus employer
 * NPS (80CCD(2)), which is the one deduction available under BOTH regimes.
 * Kept separate from taxSlabs.js/calculate.js since these are all
 * "reduce taxable income" inputs a user opts into, not part of the base
 * CTC->in-hand pass every calculation needs.
 */

export const SECTION_80C_CAP = 150000

export const SECTION_80D_SELF_CAP = 25000
export const SECTION_80D_SELF_SENIOR_CAP = 50000
export const SECTION_80D_PARENTS_CAP = 25000
export const SECTION_80D_PARENTS_SENIOR_CAP = 50000

export const NPS_EMPLOYER_MAX_PCT_OF_BASIC = 0.10 // private sector cap under 80CCD(2); govt employees get 14%, not modelled separately in v1

/**
 * HRA exemption (old regime only) — the lowest of:
 *   1. Actual HRA received
 *   2. Rent paid minus 10% of Basic
 *   3. 50% of Basic (metro) or 40% of Basic (non-metro)
 * Returns 0 (not negative) if the numbers don't support any exemption —
 * e.g. rent paid is less than 10% of Basic.
 */
export function calculateHraExemption({ hraReceived, basicAnnual, rentPaidAnnual, isMetro }) {
  const rent = Math.max(0, Number(rentPaidAnnual) || 0)
  if (rent === 0) return 0

  const tenPctBasic = basicAnnual * 0.10
  const rentMinusTenPct = Math.max(0, rent - tenPctBasic)
  const pctOfBasicLimit = basicAnnual * (isMetro ? 0.50 : 0.40)

  return Math.max(0, Math.min(hraReceived, rentMinusTenPct, pctOfBasicLimit))
}

/** Section 80C — combined cap across PPF/ELSS/EPF/life insurance/etc. The user enters their total claim. */
export function cap80C(investedAmount) {
  return Math.min(Math.max(0, Number(investedAmount) || 0), SECTION_80C_CAP)
}

/** Section 80D — health insurance premiums, self/family and parents tracked separately since their caps differ by senior-citizen status. */
export function calculate80D({ selfPremium, selfSenior, parentsPremium, parentsSenior }) {
  const selfCap = selfSenior ? SECTION_80D_SELF_SENIOR_CAP : SECTION_80D_SELF_CAP
  const parentsCap = parentsSenior ? SECTION_80D_PARENTS_SENIOR_CAP : SECTION_80D_PARENTS_CAP
  const self = Math.min(Math.max(0, Number(selfPremium) || 0), selfCap)
  const parents = Math.min(Math.max(0, Number(parentsPremium) || 0), parentsCap)
  return self + parents
}

/** Employer NPS contribution (80CCD(2)) — tax-exempt under both regimes, capped at 10% of Basic. */
export function calculateNpsExemption({ basicAnnual, npsPctOfBasic }) {
  const pct = Math.min(Math.max(0, Number(npsPctOfBasic) || 0), NPS_EMPLOYER_MAX_PCT_OF_BASIC)
  return basicAnnual * pct
}
