'use client'

import { useState } from 'react'

const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500'

/**
 * Optional HRA/80C/80D/NPS inputs, collapsed by default so the base
 * calculator stays simple. HRA/80C/80D only affect the Old Regime (that's
 * the law); NPS applies to both, so it's shown regardless of regime.
 */
export default function DeductionsInputs({ regime, deductions, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-xs font-semibold text-green-700 hover:text-green-800 cursor-pointer"
      >
        <span>+ Add deductions (HRA, 80C, 80D, NPS)</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {regime !== 'old' && (
            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
              HRA, 80C, and 80D only reduce tax under the Old Regime — switch regimes above to see them applied. Employer NPS below applies either way.
            </p>
          )}

          <div>
            <label htmlFor="ded-rent" className="block text-xs font-medium text-gray-600 mb-1">Annual Rent Paid (₹) — for HRA exemption</label>
            <input
              id="ded-rent" type="number" min="0" inputMode="numeric" placeholder="e.g. 240000"
              value={deductions.rentPaidAnnual || ''}
              onChange={(e) => onChange({ rentPaidAnnual: Number(e.target.value) || 0 })}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="ded-80c" className="block text-xs font-medium text-gray-600 mb-1">Section 80C Investments (₹, max 1,50,000)</label>
            <input
              id="ded-80c" type="number" min="0" max="150000" inputMode="numeric" placeholder="PPF, ELSS, EPF, life insurance..."
              value={deductions.investment80C || ''}
              onChange={(e) => onChange({ investment80C: Number(e.target.value) || 0 })}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="ded-80d-self" className="block text-xs font-medium text-gray-600 mb-1">Health Insurance — Self/Family (₹)</label>
              <input
                id="ded-80d-self" type="number" min="0" inputMode="numeric" placeholder="e.g. 20000"
                value={deductions.health80DSelf || ''}
                onChange={(e) => onChange({ health80DSelf: Number(e.target.value) || 0 })}
                className={fieldClass}
              />
              <label className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                <input type="checkbox" checked={!!deductions.health80DSelfSenior} onChange={(e) => onChange({ health80DSelfSenior: e.target.checked })} />
                Senior citizen (cap ₹50,000)
              </label>
            </div>
            <div>
              <label htmlFor="ded-80d-parents" className="block text-xs font-medium text-gray-600 mb-1">Health Insurance — Parents (₹)</label>
              <input
                id="ded-80d-parents" type="number" min="0" inputMode="numeric" placeholder="e.g. 15000"
                value={deductions.health80DParents || ''}
                onChange={(e) => onChange({ health80DParents: Number(e.target.value) || 0 })}
                className={fieldClass}
              />
              <label className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                <input type="checkbox" checked={!!deductions.health80DParentsSenior} onChange={(e) => onChange({ health80DParentsSenior: e.target.checked })} />
                Senior citizen (cap ₹50,000)
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="ded-nps" className="block text-xs font-medium text-gray-600 mb-1">
              Employer NPS Contribution — {Math.round((deductions.npsPctOfBasic || 0) * 100)}% of Basic
            </label>
            <input
              id="ded-nps" type="range" min="0" max="10" step="1"
              value={Math.round((deductions.npsPctOfBasic || 0) * 100)}
              onChange={(e) => onChange({ npsPctOfBasic: Number(e.target.value) / 100 })}
              className="w-full accent-green-600"
            />
            <p className="mt-1 text-[11px] text-gray-400">Tax-exempt under both regimes, up to 10% of Basic — only if your employer actually offers this.</p>
          </div>
        </div>
      )}
    </div>
  )
}
