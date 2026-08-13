/**
 * City cost-of-living index — INDICATIVE ONLY, not sourced from a live or
 * third-party economic dataset. Rent tends to dominate the gap between
 * Indian cities far more than food/transport, so the composite index is
 * weighted accordingly. Every consumer of this data (the comparison
 * component) must show it's an approximation, not a precise economic
 * figure — see the disclaimer text exported below.
 *
 * Index base: Bengaluru = 100. A city at 70 means a given amount of money
 * goes roughly as far as ~100/70 ≈ 1.4x further there than in Bengaluru,
 * for typical mid-range urban living (rent, food, local transport).
 */
export const CITY_COST_INDEX = [
  { city: 'Mumbai', index: 138, rentIndex: 165, foodIndex: 115, transportIndex: 110 },
  { city: 'Delhi NCR', index: 108, rentIndex: 115, foodIndex: 105, transportIndex: 100 },
  { city: 'Bengaluru', index: 100, rentIndex: 100, foodIndex: 100, transportIndex: 100 },
  { city: 'Gurugram', index: 112, rentIndex: 125, foodIndex: 105, transportIndex: 100 },
  { city: 'Hyderabad', index: 88, rentIndex: 80, foodIndex: 90, transportIndex: 95 },
  { city: 'Pune', index: 90, rentIndex: 85, foodIndex: 90, transportIndex: 95 },
  { city: 'Chennai', index: 85, rentIndex: 75, foodIndex: 90, transportIndex: 95 },
  { city: 'Kolkata', index: 72, rentIndex: 60, foodIndex: 80, transportIndex: 85 },
  { city: 'Ahmedabad', index: 68, rentIndex: 55, foodIndex: 78, transportIndex: 85 },
  { city: 'Kochi', index: 74, rentIndex: 62, foodIndex: 82, transportIndex: 88 },
  { city: 'Jaipur', index: 65, rentIndex: 50, foodIndex: 75, transportIndex: 82 },
  { city: 'Chandigarh', index: 80, rentIndex: 72, foodIndex: 85, transportIndex: 88 },
]

export const COST_INDEX_DISCLAIMER =
  "This is an indicative comparison based on typical rent, food, and local transport patterns across Indian cities — not a live or third-party economic dataset. Real costs vary a lot by neighbourhood and lifestyle; use this for a rough sense of relative affordability, not a precise budget."

/**
 * Given a monthly in-hand figure earned in `fromCity`, estimates the
 * equivalent purchasing-power figure in `toCity` — i.e. "what would feel
 * like the same standard of living there".
 */
export function equivalentPurchasingPower(monthlyAmount, fromCity, toCity) {
  const from = CITY_COST_INDEX.find((c) => c.city === fromCity)
  const to = CITY_COST_INDEX.find((c) => c.city === toCity)
  if (!from || !to) return monthlyAmount
  return monthlyAmount * (to.index / from.index)
}
