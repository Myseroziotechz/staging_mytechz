'use client'

import { useMemo, useState } from 'react'
import { CITY_COST_INDEX, COST_INDEX_DISCLAIMER, equivalentPurchasingPower } from '@/lib/salary-calculator/cityCostOfLiving'
import { formatINR } from '@/lib/salary-calculator/format'

const fieldClass = 'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

export default function CityCostComparison({ initialMonthlyInHand }) {
  const [monthlyInHand, setMonthlyInHand] = useState(initialMonthlyInHand || 100000)
  const [fromCity, setFromCity] = useState('Bengaluru')

  const rows = useMemo(
    () => CITY_COST_INDEX.map((c) => ({
      city: c.city,
      equivalent: equivalentPurchasingPower(monthlyInHand, fromCity, c.city),
      index: c.index,
    })).sort((a, b) => a.index - b.index),
    [monthlyInHand, fromCity],
  )

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="col-amount" className="block text-xs font-medium text-gray-600 mb-1">Monthly In-Hand Salary (₹)</label>
            <input id="col-amount" type="number" min="0" inputMode="numeric" value={monthlyInHand} onChange={(e) => setMonthlyInHand(Number(e.target.value) || 0)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="col-city" className="block text-xs font-medium text-gray-600 mb-1">Currently Earned In</label>
            <select id="col-city" value={fromCity} onChange={(e) => setFromCity(e.target.value)} className={fieldClass}>
              {CITY_COST_INDEX.map((c) => <option key={c.city} value={c.city}>{c.city}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Equivalent Purchasing Power</h2>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.city} className={`flex items-center justify-between p-3 rounded-lg ${r.city === fromCity ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
              <span className="text-sm font-medium text-gray-800">{r.city}{r.city === fromCity && <span className="ml-2 text-[10px] font-bold text-green-700">(current)</span>}</span>
              <span className="text-sm font-bold text-gray-900">{formatINR(r.equivalent)} <span className="text-xs font-normal text-gray-400">/mo equivalent</span></span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-400">{COST_INDEX_DISCLAIMER}</p>
    </div>
  )
}
