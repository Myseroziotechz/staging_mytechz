'use client'

import { STATE_OPTIONS } from '@/lib/salary-calculator/professionalTax'
import { METRO_CITIES } from '@/lib/salary-calculator/defaults'
import DeductionsInputs from './DeductionsInputs'

const fieldClass = 'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

export default function SalaryCalculatorForm({ values, onChange, deductions, onDeductionsChange }) {
  const { ctc, regime, state, isMetro, basicPct } = values

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Enter Your Details</h2>

      <div>
        <label htmlFor="salary-ctc" className="block text-xs font-medium text-gray-600 mb-1">Annual CTC (₹)</label>
        <input
          id="salary-ctc"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="e.g. 1200000"
          value={ctc === 0 ? '' : ctc}
          onChange={(e) => onChange({ ctc: Number(e.target.value) || 0 })}
          className={fieldClass}
        />
        <p className="mt-1 text-[11px] text-gray-400">Enter your total annual Cost to Company, e.g. 12,00,000 for 12 LPA.</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Tax Regime</label>
        <div className="grid grid-cols-2 gap-2">
          {[{ key: 'new', label: 'New Regime' }, { key: 'old', label: 'Old Regime' }].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange({ regime: opt.key })}
              className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                regime === opt.key ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="salary-state" className="block text-xs font-medium text-gray-600 mb-1">State (for Professional Tax)</label>
        <select id="salary-state" value={state} onChange={(e) => onChange({ state: e.target.value })} className={fieldClass}>
          {STATE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">City Type (for HRA)</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ isMetro: true })}
            className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
              isMetro ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            Metro
          </button>
          <button
            type="button"
            onClick={() => onChange({ isMetro: false })}
            className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
              !isMetro ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            Non-Metro
          </button>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">Metro: {METRO_CITIES.join(', ')}.</p>
      </div>

      <div>
        <label htmlFor="salary-basic" className="block text-xs font-medium text-gray-600 mb-1">
          Basic Salary — {Math.round(basicPct * 100)}% of CTC
        </label>
        <input
          id="salary-basic"
          type="range"
          min="30"
          max="50"
          step="1"
          value={Math.round(basicPct * 100)}
          onChange={(e) => onChange({ basicPct: Number(e.target.value) / 100 })}
          className="w-full accent-green-600"
        />
        <p className="mt-1 text-[11px] text-gray-400">Most companies structure Basic between 40-50% of CTC. Adjust if you know your exact figure.</p>
      </div>

      {deductions && onDeductionsChange && (
        <DeductionsInputs regime={regime} deductions={deductions} onChange={onDeductionsChange} />
      )}
    </div>
  )
}
