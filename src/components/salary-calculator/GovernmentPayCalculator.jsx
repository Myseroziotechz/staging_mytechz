'use client'

import { useMemo, useState } from 'react'
import { calculateGovernmentPay, PAY_MATRIX_LEVELS, CITY_CLASS_LABELS } from '@/lib/salary-calculator/governmentPay'
import { computeTaxForGrossIncome } from '@/lib/salary-calculator/calculate'
import { STATE_OPTIONS } from '@/lib/salary-calculator/professionalTax'
import { formatINR } from '@/lib/salary-calculator/format'

const fieldClass = 'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

export default function GovernmentPayCalculator() {
  const [level, setLevel] = useState(6)
  const [yearsInLevel, setYearsInLevel] = useState(0)
  const [daPercent, setDaPercent] = useState(50)
  const [cityClass, setCityClass] = useState('X')
  const [state, setState] = useState('Other / Not Listed')
  const [regime, setRegime] = useState('new')

  const result = useMemo(
    () => calculateGovernmentPay({ level, yearsInLevel, daPercent, cityClass, state, regime, computeTax: computeTaxForGrossIncome }),
    [level, yearsInLevel, daPercent, cityClass, state, regime],
  )

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">7th CPC Pay Details</h2>

        <div>
          <label htmlFor="gov-level" className="block text-xs font-medium text-gray-600 mb-1">Pay Level</label>
          <select id="gov-level" value={level} onChange={(e) => setLevel(e.target.value)} className={fieldClass}>
            {PAY_MATRIX_LEVELS.map((l) => <option key={l.level} value={l.level}>{l.label} (Entry: {formatINR(l.entryPay)})</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="gov-years" className="block text-xs font-medium text-gray-600 mb-1">Years in Current Level — {yearsInLevel}</label>
          <input id="gov-years" type="range" min="0" max="20" step="1" value={yearsInLevel} onChange={(e) => setYearsInLevel(Number(e.target.value))} className="w-full accent-green-600" />
          <p className="mt-1 text-[11px] text-gray-400">Approximate — applies a standard 3%/year increment, not the exact matrix cell.</p>
        </div>

        <div>
          <label htmlFor="gov-da" className="block text-xs font-medium text-gray-600 mb-1">Dearness Allowance — {daPercent}%</label>
          <input id="gov-da" type="range" min="0" max="70" step="1" value={daPercent} onChange={(e) => setDaPercent(Number(e.target.value))} className="w-full accent-green-600" />
          <p className="mt-1 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded px-2 py-1">
            DA changes every January and July. Check the latest official DA notification and enter the current rate — we don&apos;t auto-update this.
          </p>
        </div>

        <div>
          <label htmlFor="gov-city" className="block text-xs font-medium text-gray-600 mb-1">City Classification (for HRA)</label>
          <select id="gov-city" value={cityClass} onChange={(e) => setCityClass(e.target.value)} className={fieldClass}>
            {Object.entries(CITY_CLASS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="gov-state" className="block text-xs font-medium text-gray-600 mb-1">State (for Professional Tax)</label>
          <select id="gov-state" value={state} onChange={(e) => setState(e.target.value)} className={fieldClass}>
            {STATE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Tax Regime</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ key: 'new', label: 'New' }, { key: 'old', label: 'Old' }].map((opt) => (
              <button key={opt.key} type="button" onClick={() => setRegime(opt.key)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${regime === opt.key ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-100 rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Estimated In-Hand Salary</p>
          <p className="text-4xl font-bold text-gray-900">{formatINR(result.inHand.monthly)}<span className="text-lg font-medium text-gray-500"> / month</span></p>
          <p className="text-sm text-gray-600 mt-1">{formatINR(result.inHand.annual)} per year</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Pay Breakup</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Basic Pay</span><span className="font-semibold">{formatINR(result.basic.monthly)}/mo</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Dearness Allowance</span><span className="font-semibold">{formatINR(result.da.monthly)}/mo</span></div>
            <div className="flex justify-between"><span className="text-gray-600">HRA ({Math.round(result.hra.ratePct * 100)}%)</span><span className="font-semibold">{formatINR(result.hra.monthly)}/mo</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold"><span>Gross</span><span>{formatINR(result.gross.monthly)}/mo</span></div>
            <div className="flex justify-between pt-2"><span className="text-gray-600">Employee NPS (10%)</span><span className="font-semibold text-red-600">− {formatINR(result.deductions.employeeNps.monthly)}/mo</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Professional Tax</span><span className="font-semibold text-red-600">− {formatINR(result.deductions.professionalTax.monthly)}/mo</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Income Tax</span><span className="font-semibold text-red-600">− {formatINR(result.deductions.incomeTax.monthly)}/mo</span></div>
          </div>
        </div>

        <p className="text-[11px] text-gray-400">
          Simplified model: Basic + DA + HRA only (excludes Transport Allowance and other location/role-specific allowances). Pay-matrix entry figures and the HRA-band rule are published 7th CPC figures; DA is your own input and must be verified against the latest notification.
        </p>
      </div>
    </div>
  )
}
