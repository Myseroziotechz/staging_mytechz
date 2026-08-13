'use client'

import { useMemo, useState } from 'react'
import { calculateHike } from '@/lib/salary-calculator/calculate'
import { formatINR, formatLPA } from '@/lib/salary-calculator/format'

const fieldClass = 'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

export default function SalaryHikeCalculator({ baseValues }) {
  const [currentCtc, setCurrentCtc] = useState(baseValues.ctc)
  const [hikePercent, setHikePercent] = useState(10)

  const result = useMemo(
    () => calculateHike({ currentCtc, hikePercent, regime: baseValues.regime, state: baseValues.state, isMetro: baseValues.isMetro, basicPct: baseValues.basicPct }),
    [currentCtc, hikePercent, baseValues],
  )

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Package & Hike</h2>
        <div>
          <label htmlFor="hike-ctc" className="block text-xs font-medium text-gray-600 mb-1">Current Annual CTC (₹)</label>
          <input
            id="hike-ctc" type="number" min="0" inputMode="numeric"
            value={currentCtc === 0 ? '' : currentCtc}
            onChange={(e) => setCurrentCtc(Number(e.target.value) || 0)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="hike-pct" className="block text-xs font-medium text-gray-600 mb-1">Hike — {hikePercent}%</label>
          <input
            id="hike-pct" type="range" min="0" max="100" step="1"
            value={hikePercent}
            onChange={(e) => setHikePercent(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-100 rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">New In-Hand Salary</p>
          <p className="text-4xl font-bold text-gray-900">{formatINR(result.updated.inHand.monthly)}<span className="text-lg font-medium text-gray-500"> / month</span></p>
          <p className="text-sm text-gray-600 mt-1">Up from {formatINR(result.current.inHand.monthly)}/month · New CTC {formatLPA(result.updated.ctc.annual)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">CTC Increase</p>
            <p className="text-lg font-bold text-gray-900">{formatINR(result.ctcDelta)}</p>
            <p className="text-xs text-gray-400">/ year</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">In-Hand Increase</p>
            <p className="text-lg font-bold text-green-700">{formatINR(result.inHandDelta.monthly)}</p>
            <p className="text-xs text-gray-400">/ month · {formatINR(result.inHandDelta.annual)}/year</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-400">
          Note: your in-hand doesn&apos;t increase by the full hike % — a portion goes to higher PF/tax as your Basic and taxable income rise too.
        </p>
      </div>
    </div>
  )
}
