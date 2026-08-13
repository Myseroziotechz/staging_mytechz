/**
 * 7th Pay Commission government pay calculator.
 *
 * IMPORTANT accuracy note: the pay-matrix entry figures and the HRA-band
 * *rule* below are stable, published 7th CPC figures — those don't change.
 * Dearness Allowance (DA), however, is revised twice a year (January and
 * July) based on AICPI data, and is NOT hardcoded here — it's a required
 * user input with a labelled "verify against the latest DA notification"
 * default, rather than a baked-in number that would silently go stale.
 */

// 7th CPC Pay Matrix — entry-level (index 1) Basic Pay for each level.
// A simplified single-column view (not the full ~40-column matrix per
// level) — good enough for "what's the starting pay at my level", the
// most commonly searched figure; a "years in this level" input applies a
// simple approximate increment on top rather than modelling every cell.
export const PAY_MATRIX_LEVELS = [
  { level: 1, label: 'Level 1', entryPay: 18000 },
  { level: 2, label: 'Level 2', entryPay: 19900 },
  { level: 3, label: 'Level 3', entryPay: 21700 },
  { level: 4, label: 'Level 4', entryPay: 25500 },
  { level: 5, label: 'Level 5', entryPay: 29200 },
  { level: 6, label: 'Level 6', entryPay: 35400 },
  { level: 7, label: 'Level 7', entryPay: 44900 },
  { level: 8, label: 'Level 8', entryPay: 47600 },
  { level: 9, label: 'Level 9', entryPay: 53100 },
  { level: 10, label: 'Level 10', entryPay: 56100 },
  { level: 11, label: 'Level 11', entryPay: 67700 },
  { level: 12, label: 'Level 12', entryPay: 78800 },
  { level: 13, label: 'Level 13', entryPay: 123100 },
  { level: '13A', label: 'Level 13A', entryPay: 131100 },
  { level: 14, label: 'Level 14', entryPay: 144200 },
  { level: 15, label: 'Level 15', entryPay: 182200 },
  { level: 16, label: 'Level 16', entryPay: 205400 },
  { level: 17, label: 'Level 17', entryPay: 225000 },
  { level: 18, label: 'Level 18', entryPay: 250000 },
]

// Annual increment rate applied per completed year in the level, standard
// 7th CPC increment approximation (3% of Basic, rounded to nearest 100 in
// the real matrix — this is a smoothed approximation, not the exact cell).
const ANNUAL_INCREMENT_RATE = 0.03

export const CITY_CLASS = { X: 'X', Y: 'Y', Z: 'Z' }

export const CITY_CLASS_LABELS = {
  X: 'X — Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Ahmedabad, Pune',
  Y: 'Y — Other state capitals & larger cities',
  Z: 'Z — All other locations',
}

/** HRA % by city class, banded by current DA — this rule itself is a fixed, published 7th CPC rule. */
function hraPercentForCityClass(cityClass, daPercent) {
  let band
  if (daPercent >= 50) band = { X: 0.30, Y: 0.20, Z: 0.10 }
  else if (daPercent >= 25) band = { X: 0.27, Y: 0.18, Z: 0.09 }
  else band = { X: 0.24, Y: 0.16, Z: 0.08 }
  return band[cityClass] ?? band.Z
}

export function estimateBasicPay(level, yearsInLevel = 0) {
  const entry = PAY_MATRIX_LEVELS.find((l) => String(l.level) === String(level))
  if (!entry) return 0
  const years = Math.max(0, Math.min(40, Number(yearsInLevel) || 0)) // matrix realistically tops out well under 40 increments
  return Math.round(entry.entryPay * Math.pow(1 + ANNUAL_INCREMENT_RATE, years))
}

/**
 * Government employee pay breakdown. Reuses the same income-tax slab
 * engine as the private-sector calculator (govt employees choose a regime
 * too) rather than duplicating tax logic — only the pay STRUCTURE differs.
 */
export function calculateGovernmentPay({
  level,
  yearsInLevel = 0,
  daPercent = 50,
  cityClass = CITY_CLASS.X,
  state = 'Other / Not Listed',
  regime = 'new',
  computeTax, // injected to avoid a circular import with calculate.js/taxSlabs.js
}) {
  const basicMonthly = estimateBasicPay(level, yearsInLevel)
  const daMonthly = basicMonthly * (Math.max(0, Number(daPercent) || 0) / 100)
  const hraPct = hraPercentForCityClass(cityClass, Number(daPercent) || 0)
  const hraMonthly = basicMonthly * hraPct

  const grossMonthly = basicMonthly + daMonthly + hraMonthly
  const grossAnnual = grossMonthly * 12

  // Employee NPS (Tier I, mandatory for post-2004 recruits): 10% of (Basic + DA).
  const npsMonthly = (basicMonthly + daMonthly) * 0.10

  const taxResult = computeTax ? computeTax({ grossAnnual, regime, state }) : { incomeTaxAnnual: 0, professionalTaxAnnual: 0, taxableIncome: grossAnnual }

  const inHandAnnual = grossAnnual - npsMonthly * 12 - taxResult.professionalTaxAnnual - taxResult.incomeTaxAnnual

  return {
    level, cityClass, daPercent,
    basic: { monthly: basicMonthly, annual: basicMonthly * 12 },
    da: { monthly: daMonthly, annual: daMonthly * 12 },
    hra: { monthly: hraMonthly, annual: hraMonthly * 12, ratePct: hraPct },
    gross: { monthly: grossMonthly, annual: grossAnnual },
    deductions: {
      employeeNps: { monthly: npsMonthly, annual: npsMonthly * 12 },
      professionalTax: { annual: taxResult.professionalTaxAnnual, monthly: taxResult.professionalTaxAnnual / 12 },
      incomeTax: { annual: taxResult.incomeTaxAnnual, monthly: taxResult.incomeTaxAnnual / 12 },
    },
    taxableIncome: taxResult.taxableIncome,
    inHand: { annual: inHandAnnual, monthly: inHandAnnual / 12 },
  }
}
