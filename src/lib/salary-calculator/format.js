/** Formats a number as Indian-grouped rupees, e.g. 1155312 -> "₹11,55,312". */
export function formatINR(amount, { decimals = 0 } = {}) {
  const n = Number(amount) || 0
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}`
}

/** Compact LPA-style label, e.g. 1200000 -> "12 LPA", 1250000 -> "12.5 LPA". */
export function formatLPA(annualAmount) {
  const lpa = (Number(annualAmount) || 0) / 100000
  const rounded = Math.round(lpa * 10) / 10
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} LPA`
}
