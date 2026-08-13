/**
 * State-wise monthly Professional Tax (PT), India. Most states cap around
 * ₹200/mo (the constitutional ceiling on PT is ₹2,500/year). Maharashtra
 * charges ₹300 in February to hit that annual cap on a ₹200×11 + ₹300 schedule.
 * Values are typical/representative for salaried employees — real PT can have
 * additional income-based slabs in a few states, simplified here for v1.
 */
export const PROFESSIONAL_TAX_BY_STATE = {
  'Maharashtra': { monthly: 200, februaryOverride: 300 },
  'Karnataka': { monthly: 200 },
  'West Bengal': { monthly: 150 },
  'Tamil Nadu': { monthly: 0 },
  'Telangana': { monthly: 200 },
  'Andhra Pradesh': { monthly: 200 },
  'Gujarat': { monthly: 200 },
  'Madhya Pradesh': { monthly: 208 },
  'Kerala': { monthly: 200 },
  'Odisha': { monthly: 200 },
  'Assam': { monthly: 208 },
  'Bihar': { monthly: 200 },
  'Jharkhand': { monthly: 200 },
  'Delhi': { monthly: 0 },
  'Haryana': { monthly: 0 },
  'Uttar Pradesh': { monthly: 0 },
  'Rajasthan': { monthly: 0 },
  'Punjab': { monthly: 200 },
  'Other / Not Listed': { monthly: 200 },
}

export const STATE_OPTIONS = Object.keys(PROFESSIONAL_TAX_BY_STATE)

/** Average monthly PT across the year (accounts for Maharashtra's February bump), used for the annual figure. */
export function annualProfessionalTax(state) {
  const entry = PROFESSIONAL_TAX_BY_STATE[state] || PROFESSIONAL_TAX_BY_STATE['Other / Not Listed']
  if (entry.februaryOverride != null) {
    return entry.monthly * 11 + entry.februaryOverride
  }
  return entry.monthly * 12
}

export function monthlyProfessionalTax(state) {
  const entry = PROFESSIONAL_TAX_BY_STATE[state] || PROFESSIONAL_TAX_BY_STATE['Other / Not Listed']
  return entry.monthly
}
