'use client'

import { formatINR } from '@/lib/salary-calculator/format'

const FRESHER_NOTES = {
  'Basic Salary': 'The core of your salary — everything else (HRA, PF, gratuity) is calculated as a % of this.',
  'HRA': 'House Rent Allowance — a portion of your salary meant for rent, whether you pay rent or not.',
  'Special Allowance': "The balancing amount that makes your salary components add up to your Gross — usually fully taxable.",
  'Gross Salary': 'What your salary actually is before any deductions — this is what shows up in your payslip before tax/PF.',
  'Employee PF': 'Provident Fund — a mandatory retirement savings deduction, matched by your employer. Goes to your EPF account, not lost.',
  'Employee ESI': 'Employee State Insurance — a small mandatory health-insurance-style deduction, only if your gross is below ₹21,000/month.',
  'Professional Tax': 'A small state government tax on salaried income, usually around ₹200/month.',
  'Income Tax (TDS)': 'Tax Deducted at Source — your employer deducts your estimated annual income tax and pays it to the government on your behalf, spread across the year.',
  'In-Hand Salary': "What actually lands in your bank account — this is the number that matters for your monthly budget.",
}

function Row({ label, monthly, annual, emphasis = false, negative = false, fresherMode = false }) {
  return (
    <div className={`py-2.5 ${emphasis ? '' : 'border-b border-gray-100 last:border-b-0'}`}>
      <div className="flex items-center justify-between">
        <span className={emphasis ? 'text-sm font-bold text-gray-900' : 'text-sm text-gray-600'}>{label}</span>
        <div className="text-right">
          <span className={emphasis ? 'text-base font-bold text-green-700' : `text-sm font-semibold ${negative ? 'text-red-600' : 'text-gray-900'}`}>
            {negative && monthly > 0 ? '− ' : ''}{formatINR(monthly)}
          </span>
          <span className="text-[11px] text-gray-400 block">{formatINR(annual)} / year</span>
        </div>
      </div>
      {fresherMode && FRESHER_NOTES[label] && (
        <p className="mt-1 text-[11px] text-gray-400 leading-snug max-w-[85%]">{FRESHER_NOTES[label]}</p>
      )}
    </div>
  )
}

/** Results table: monthly + annual figures for every salary component and deduction. */
export default function SalaryBreakdown({ breakdown, fresherMode = false }) {
  if (!breakdown) return null
  const { components, deductions, gross, inHand, isZeroTax } = breakdown

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Salary Breakup</h3>
        {isZeroTax && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
            You pay ₹0 tax
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Earnings</p>
        <Row label="Basic Salary" monthly={components.basic.monthly} annual={components.basic.annual} fresherMode={fresherMode} />
        <Row label="HRA" monthly={components.hra.monthly} annual={components.hra.annual} fresherMode={fresherMode} />
        <Row label="Special Allowance" monthly={components.specialAllowance.monthly} annual={components.specialAllowance.annual} fresherMode={fresherMode} />
        <Row label="Gross Salary" monthly={gross.monthly} annual={gross.annual} fresherMode={fresherMode} />
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Deductions</p>
        <Row label="Employee PF" monthly={deductions.employeePf.monthly} annual={deductions.employeePf.annual} negative fresherMode={fresherMode} />
        {deductions.employeeEsi.eligible && (
          <Row label="Employee ESI" monthly={deductions.employeeEsi.monthly} annual={deductions.employeeEsi.annual} negative fresherMode={fresherMode} />
        )}
        <Row label="Professional Tax" monthly={deductions.professionalTax.monthly} annual={deductions.professionalTax.annual} negative fresherMode={fresherMode} />
        <Row label="Income Tax (TDS)" monthly={deductions.incomeTax.monthly} annual={deductions.incomeTax.annual} negative fresherMode={fresherMode} />
      </div>

      <div className="mt-4 pt-3 border-t-2 border-gray-900">
        <Row label="In-Hand Salary" monthly={inHand.monthly} annual={inHand.annual} emphasis fresherMode={fresherMode} />
      </div>
    </div>
  )
}
