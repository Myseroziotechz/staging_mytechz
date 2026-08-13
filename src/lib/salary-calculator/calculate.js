import {
  PF_RATE, PF_WAGE_CEILING_MONTHLY, PF_CAPPED_CONTRIBUTION_MONTHLY,
  ESI_EMPLOYEE_RATE, ESI_EMPLOYER_RATE, ESI_GROSS_ELIGIBILITY_MONTHLY,
  GRATUITY_RATE, DEFAULT_BASIC_PCT_OF_CTC, HRA_PCT_METRO, HRA_PCT_NON_METRO,
  REGIME,
} from './defaults'
import { annualProfessionalTax } from './professionalTax'
import {
  computeNewRegimeTax, computeOldRegimeTax,
  NEW_REGIME_STANDARD_DEDUCTION, OLD_REGIME_STANDARD_DEDUCTION,
  NEW_REGIME_REBATE_TAXABLE_INCOME_LIMIT,
} from './taxSlabs'
import { calculateHraExemption, cap80C, calculate80D, calculateNpsExemption } from './deductions'

const DEFAULT_DEDUCTIONS = {
  rentPaidAnnual: 0,
  investment80C: 0,
  health80DSelf: 0,
  health80DSelfSenior: false,
  health80DParents: 0,
  health80DParentsSenior: false,
  npsPctOfBasic: 0,
}

/** Monthly PF contribution (employee or employer — same formula for both), from an annual Basic. */
function pfAnnual(basicAnnual) {
  const basicMonthly = basicAnnual / 12
  const monthlyContribution = basicMonthly > PF_WAGE_CEILING_MONTHLY
    ? PF_CAPPED_CONTRIBUTION_MONTHLY
    : basicMonthly * PF_RATE
  return monthlyContribution * 12
}

/**
 * Full CTC -> in-hand breakdown for one tax regime.
 *
 * Computation order matters here (see the plan's own diagram): Basic is
 * fixed as a % of CTC first (not of Gross) — that's what keeps this a
 * single, non-circular pass, since employer PF/gratuity are both % of
 * Basic and Gross is CTC minus those employer-side contributions.
 *
 * `deductions` (all optional, default to zero/off — fully backward
 * compatible with Phase 1 callers): HRA exemption, 80C, and 80D only ever
 * apply to the OLD regime (that's the law — the new regime doesn't allow
 * them). Employer NPS (80CCD(2)) is the one deduction the new regime does
 * allow, so it applies to both.
 */
export function calculateSalaryBreakdown({
  ctc,
  regime = REGIME.NEW,
  state = 'Other / Not Listed',
  isMetro = true,
  basicPct = DEFAULT_BASIC_PCT_OF_CTC,
  deductions: rawDeductions = {},
}) {
  const deductionInputs = { ...DEFAULT_DEDUCTIONS, ...rawDeductions }
  const safeCtc = Math.max(0, Number(ctc) || 0)

  const basicAnnual = safeCtc * basicPct
  const gratuityAnnual = basicAnnual * GRATUITY_RATE
  const employerPFAnnual = pfAnnual(basicAnnual)

  // Gross before employer ESI, used only to check the ESI eligibility
  // threshold (ESI's own rate is defined as a % of Gross, so it can't be
  // part of the Gross figure it's checked against).
  const grossBeforeESI = safeCtc - employerPFAnnual - gratuityAnnual
  const esiEligible = (grossBeforeESI / 12) <= ESI_GROSS_ELIGIBILITY_MONTHLY
  const employerESIAnnual = esiEligible ? grossBeforeESI * ESI_EMPLOYER_RATE : 0

  const grossAnnual = grossBeforeESI - employerESIAnnual

  const hraAnnual = basicAnnual * (isMetro ? HRA_PCT_METRO : HRA_PCT_NON_METRO)
  const specialAllowanceAnnual = Math.max(0, grossAnnual - basicAnnual - hraAnnual)

  const employeePFAnnual = pfAnnual(basicAnnual)
  const employeeESIAnnual = esiEligible ? grossAnnual * ESI_EMPLOYEE_RATE : 0
  const professionalTaxAnnual = annualProfessionalTax(state)

  // Employer NPS exemption (80CCD(2)) — both regimes.
  const npsExemption = calculateNpsExemption({ basicAnnual, npsPctOfBasic: deductionInputs.npsPctOfBasic })

  // HRA exemption + 80C + 80D — old regime only.
  const hraExemption = regime === REGIME.OLD
    ? calculateHraExemption({ hraReceived: hraAnnual, basicAnnual, rentPaidAnnual: deductionInputs.rentPaidAnnual, isMetro })
    : 0
  const deduction80C = regime === REGIME.OLD ? cap80C(deductionInputs.investment80C) : 0
  const deduction80D = regime === REGIME.OLD
    ? calculate80D({
        selfPremium: deductionInputs.health80DSelf,
        selfSenior: deductionInputs.health80DSelfSenior,
        parentsPremium: deductionInputs.health80DParents,
        parentsSenior: deductionInputs.health80DParentsSenior,
      })
    : 0

  const totalDeductions = npsExemption + hraExemption + deduction80C + deduction80D
  const standardDeduction = regime === REGIME.NEW ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION
  const taxableIncome = Math.max(0, grossAnnual - standardDeduction - totalDeductions)
  const incomeTaxAnnual = regime === REGIME.NEW
    ? computeNewRegimeTax(taxableIncome)
    : computeOldRegimeTax(taxableIncome)

  const inHandAnnual = grossAnnual - employeePFAnnual - employeeESIAnnual - professionalTaxAnnual - incomeTaxAnnual

  return {
    regime,
    ctc: { annual: safeCtc, monthly: safeCtc / 12 },
    employer: {
      pf: { annual: employerPFAnnual, monthly: employerPFAnnual / 12 },
      esi: { annual: employerESIAnnual, monthly: employerESIAnnual / 12, eligible: esiEligible },
      gratuity: { annual: gratuityAnnual, monthly: gratuityAnnual / 12 },
    },
    gross: { annual: grossAnnual, monthly: grossAnnual / 12 },
    components: {
      basic: { annual: basicAnnual, monthly: basicAnnual / 12 },
      hra: { annual: hraAnnual, monthly: hraAnnual / 12 },
      specialAllowance: { annual: specialAllowanceAnnual, monthly: specialAllowanceAnnual / 12 },
    },
    deductions: {
      employeePf: { annual: employeePFAnnual, monthly: employeePFAnnual / 12 },
      employeeEsi: { annual: employeeESIAnnual, monthly: employeeESIAnnual / 12, eligible: esiEligible },
      professionalTax: { annual: professionalTaxAnnual, monthly: professionalTaxAnnual / 12 },
      incomeTax: { annual: incomeTaxAnnual, monthly: incomeTaxAnnual / 12 },
    },
    taxableIncome,
    standardDeduction,
    // Tax-saving deductions applied (distinct from `deductions` above, which
    // are payroll deductions from Gross) — exposed so the UI can show what
    // was actually claimed, e.g. "HRA exemption: ₹1,20,000 applied".
    taxSavings: {
      hraExemption,
      section80C: deduction80C,
      section80D: deduction80D,
      employerNps: npsExemption,
      total: totalDeductions,
    },
    isZeroTax: regime === REGIME.NEW
      ? taxableIncome <= NEW_REGIME_REBATE_TAXABLE_INCOME_LIMIT
      : incomeTaxAnnual === 0,
    inHand: { annual: inHandAnnual, monthly: inHandAnnual / 12 },
  }
}

/** Both regimes at once, for the side-by-side comparison view. */
export function compareRegimes(input) {
  const newRegime = calculateSalaryBreakdown({ ...input, regime: REGIME.NEW })
  const oldRegime = calculateSalaryBreakdown({ ...input, regime: REGIME.OLD })
  const betterRegime = newRegime.inHand.annual >= oldRegime.inHand.annual ? REGIME.NEW : REGIME.OLD
  const annualSavings = Math.abs(newRegime.inHand.annual - oldRegime.inHand.annual)
  return { newRegime, oldRegime, betterRegime, annualSavings }
}

/**
 * Hike calculator (Phase 2, exposed now since it's a trivial function on
 * top of the same engine — no separate calculation logic needed).
 */
export function calculateHike({ currentCtc, hikePercent, ...rest }) {
  const newCtc = Number(currentCtc || 0) * (1 + Number(hikePercent || 0) / 100)
  const current = calculateSalaryBreakdown({ ctc: currentCtc, ...rest })
  const updated = calculateSalaryBreakdown({ ctc: newCtc, ...rest })
  return {
    current,
    updated,
    ctcDelta: updated.ctc.annual - current.ctc.annual,
    inHandDelta: { annual: updated.inHand.annual - current.inHand.annual, monthly: updated.inHand.monthly - current.inHand.monthly },
  }
}

/**
 * Thin tax-computation wrapper for a plain gross-income figure (no CTC/PF
 * structure) — used by governmentPay.js via dependency injection so it can
 * reuse this same slab/rebate/surcharge/cess engine and professional-tax
 * table instead of duplicating tax logic for government pay.
 */
export function computeTaxForGrossIncome({ grossAnnual, regime = REGIME.NEW, state = 'Other / Not Listed' }) {
  const standardDeduction = regime === REGIME.NEW ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION
  const taxableIncome = Math.max(0, grossAnnual - standardDeduction)
  const incomeTaxAnnual = regime === REGIME.NEW ? computeNewRegimeTax(taxableIncome) : computeOldRegimeTax(taxableIncome)
  const professionalTaxAnnual = annualProfessionalTax(state)
  return { taxableIncome, incomeTaxAnnual, professionalTaxAnnual }
}
