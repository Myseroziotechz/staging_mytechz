'use client'

import { formatINR } from '@/lib/salary-calculator/format'

function RegimeCard({ label, result, isRecommended }) {
  return (
    <div className={`rounded-xl border p-4 ${isRecommended ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</span>
        {isRecommended && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">Recommended</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{formatINR(result.inHand.monthly)}</p>
      <p className="text-xs text-gray-500 mb-2">per month · {formatINR(result.inHand.annual)}/year</p>
      <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
        <div className="flex justify-between"><span>Taxable income</span><span className="font-medium">{formatINR(result.taxableIncome)}</span></div>
        <div className="flex justify-between"><span>Income tax</span><span className="font-medium">{formatINR(result.deductions.incomeTax.annual)}</span></div>
        {result.taxSavings.total > 0 && (
          <div className="flex justify-between text-green-700"><span>Deductions claimed</span><span className="font-medium">{formatINR(result.taxSavings.total)}</span></div>
        )}
      </div>
    </div>
  )
}

/** Side-by-side old vs new tax regime comparison with a clear "recommended" call-out. */
export default function RegimeComparison({ comparison }) {
  if (!comparison) return null
  const { newRegime, oldRegime, betterRegime, annualSavings } = comparison

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Old vs New Tax Regime</h3>
      <div className="grid grid-cols-2 gap-3">
        <RegimeCard label="New Regime" result={newRegime} isRecommended={betterRegime === 'new'} />
        <RegimeCard label="Old Regime" result={oldRegime} isRecommended={betterRegime === 'old'} />
      </div>
      {annualSavings > 0 && (
        <p className="mt-4 text-sm text-center text-gray-700">
          The <span className="font-bold text-green-700">{betterRegime === 'new' ? 'New' : 'Old'} Regime</span> saves you{' '}
          <span className="font-bold text-green-700">{formatINR(annualSavings)}</span> per year.
        </p>
      )}
      <p className="mt-3 text-[11px] text-gray-400 text-center">
        {oldRegime.taxSavings.total > 0
          ? `Old regime figures include ${formatINR(oldRegime.taxSavings.total)} in HRA/80C/80D deductions from your inputs above.`
          : "Add HRA rent, 80C investments, or 80D health insurance above (under \"Add deductions\") to see how they change the Old Regime — right now this comparison doesn't include any of those, so the Old Regime may look worse than it really is for you."}
      </p>
    </div>
  )
}
