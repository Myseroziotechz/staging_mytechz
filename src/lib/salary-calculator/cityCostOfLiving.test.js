import { describe, it, expect } from 'vitest'
import { equivalentPurchasingPower, CITY_COST_INDEX } from './cityCostOfLiving'

describe('equivalentPurchasingPower', () => {
  it('returns the same amount when comparing a city to itself', () => {
    expect(equivalentPurchasingPower(100000, 'Bengaluru', 'Bengaluru')).toBeCloseTo(100000, 2)
  })

  it('shows more purchasing power moving to a cheaper city', () => {
    const result = equivalentPurchasingPower(100000, 'Mumbai', 'Ahmedabad')
    expect(result).toBeLessThan(100000) // Ahmedabad's index is lower, so the *equivalent* rupee figure is lower
  })

  it('shows less purchasing power moving to a pricier city', () => {
    const result = equivalentPurchasingPower(100000, 'Ahmedabad', 'Mumbai')
    expect(result).toBeGreaterThan(100000)
  })

  it('falls back to the original amount for an unknown city', () => {
    expect(equivalentPurchasingPower(50000, 'Nowhere', 'Bengaluru')).toBe(50000)
  })

  it('every listed city has all four index fields', () => {
    for (const c of CITY_COST_INDEX) {
      expect(c.index).toBeGreaterThan(0)
      expect(c.rentIndex).toBeGreaterThan(0)
      expect(c.foodIndex).toBeGreaterThan(0)
      expect(c.transportIndex).toBeGreaterThan(0)
    }
  })
})
