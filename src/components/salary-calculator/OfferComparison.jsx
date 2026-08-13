'use client'

import { useMemo, useState } from 'react'
import { calculateSalaryBreakdown } from '@/lib/salary-calculator/calculate'
import { formatINR, formatLPA } from '@/lib/salary-calculator/format'

const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

function OfferInputs({ label, ctc, regime, onCtcChange, onRegimeChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">{label}</h3>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Annual CTC (₹)</label>
        <input type="number" min="0" inputMode="numeric" value={ctc === 0 ? '' : ctc} onChange={(e) => onCtcChange(Number(e.target.value) || 0)} className={fieldClass} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[{ key: 'new', label: 'New Regime' }, { key: 'old', label: 'Old Regime' }].map((opt) => (
          <button
            key={opt.key} type="button" onClick={() => onRegimeChange(opt.key)}
            className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              regime === opt.key ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function OfferComparison({ baseValues }) {
  const [offerA, setOfferA] = useState({ ctc: baseValues.ctc, regime: baseValues.regime })
  const [offerB, setOfferB] = useState({ ctc: Math.round(baseValues.ctc * 1.15), regime: baseValues.regime })

  const resultA = useMemo(() => calculateSalaryBreakdown({ ...baseValues, ...offerA }), [baseValues, offerA])
  const resultB = useMemo(() => calculateSalaryBreakdown({ ...baseValues, ...offerB }), [baseValues, offerB])

  const better = resultB.inHand.annual >= resultA.inHand.annual ? 'B' : 'A'
  const monthlyDelta = Math.abs(resultB.inHand.monthly - resultA.inHand.monthly)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <OfferInputs label="Offer A" ctc={offerA.ctc} regime={offerA.regime} onCtcChange={(ctc) => setOfferA((p) => ({ ...p, ctc }))} onRegimeChange={(regime) => setOfferA((p) => ({ ...p, regime }))} />
        <OfferInputs label="Offer B" ctc={offerB.ctc} regime={offerB.regime} onCtcChange={(ctc) => setOfferB((p) => ({ ...p, ctc }))} onRegimeChange={(regime) => setOfferB((p) => ({ ...p, regime }))} />
      </div>

      <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-green-700">Offer {better}</span> pays{' '}
          <span className="font-bold text-green-700">{formatINR(monthlyDelta)}</span> more per month in-hand.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[{ label: 'Offer A', result: resultA, isBetter: better === 'A' }, { label: 'Offer B', result: resultB, isBetter: better === 'B' }].map(({ label, result, isBetter }) => (
          <div key={label} className={`bg-white border rounded-2xl p-5 ${isBetter ? 'border-green-300' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">{label} · {formatLPA(result.ctc.annual)}</h3>
              {isBetter && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">Higher In-Hand</span>}
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatINR(result.inHand.monthly)}<span className="text-sm font-medium text-gray-500"> /mo</span></p>
            <div className="mt-3 text-xs text-gray-600 space-y-1 pt-3 border-t border-gray-100">
              <div className="flex justify-between"><span>Gross</span><span className="font-medium">{formatINR(result.gross.monthly)}/mo</span></div>
              <div className="flex justify-between"><span>Income Tax</span><span className="font-medium">{formatINR(result.deductions.incomeTax.monthly)}/mo</span></div>
              <div className="flex justify-between"><span>Employee PF</span><span className="font-medium">{formatINR(result.deductions.employeePf.monthly)}/mo</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
