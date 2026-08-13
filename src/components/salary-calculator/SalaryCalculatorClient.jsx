'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { calculateSalaryBreakdown, compareRegimes } from '@/lib/salary-calculator/calculate'
import { formatINR, formatLPA } from '@/lib/salary-calculator/format'
import { exportSalaryBreakdownPdf } from '@/lib/salary-calculator/pdfExport'
import { buildExportFilenameBase } from '@/lib/filename'
import SalaryCalculatorForm from './SalaryCalculatorForm'
import SalaryBreakdown from './SalaryBreakdown'
import SalaryChart from './SalaryChart'
import RegimeComparison from './RegimeComparison'
import SalaryHikeCalculator from './SalaryHikeCalculator'
import OfferComparison from './OfferComparison'
import GovernmentPayCalculator from './GovernmentPayCalculator'
import CityCostComparison from './CityCostComparison'

const DEFAULT_VALUES = { ctc: 1200000, regime: 'new', state: 'Other / Not Listed', isMetro: true, basicPct: 0.40 }
const DEFAULT_DEDUCTIONS = {
  rentPaidAnnual: 0, investment80C: 0,
  health80DSelf: 0, health80DSelfSenior: false,
  health80DParents: 0, health80DParentsSenior: false,
  npsPctOfBasic: 0,
}

const TABS = [
  { key: 'ctc', label: 'CTC Calculator' },
  { key: 'hike', label: 'Salary Hike' },
  { key: 'compare', label: 'Compare Offers' },
  { key: 'government', label: 'Government Pay' },
  { key: 'city', label: 'City Comparison' },
]

function parseInitialValues(initial = {}) {
  return {
    ctc: Number(initial.ctc) > 0 ? Number(initial.ctc) : DEFAULT_VALUES.ctc,
    regime: initial.regime === 'old' ? 'old' : DEFAULT_VALUES.regime,
    state: initial.state || DEFAULT_VALUES.state,
    isMetro: initial.metro !== '0',
    basicPct: Number(initial.basic) >= 0.30 && Number(initial.basic) <= 0.50 ? Number(initial.basic) : DEFAULT_VALUES.basicPct,
  }
}

export default function SalaryCalculatorClient({ initialValues }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tab, setTab] = useState('ctc')
  const [values, setValues] = useState(() => parseInitialValues(initialValues))
  const [deductions, setDeductions] = useState(DEFAULT_DEDUCTIONS)
  const [fresherMode, setFresherMode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Keep the URL shareable — reflects the current inputs without adding a
  // history entry per keystroke (replace, not push). Only the CTC
  // calculator's inputs are reflected in the URL; the other tabs are
  // self-contained calculators that don't need to be shareable in v1.
  useEffect(() => {
    if (tab !== 'ctc') return
    const params = new URLSearchParams()
    params.set('ctc', String(values.ctc))
    params.set('regime', values.regime)
    if (values.state !== DEFAULT_VALUES.state) params.set('state', values.state)
    if (!values.isMetro) params.set('metro', '0')
    if (values.basicPct !== DEFAULT_VALUES.basicPct) params.set('basic', String(values.basicPct))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, tab])

  const handleChange = useCallback((patch) => {
    setValues((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleDeductionsChange = useCallback((patch) => {
    setDeductions((prev) => ({ ...prev, ...patch }))
  }, [])

  const breakdown = useMemo(() => calculateSalaryBreakdown({ ...values, deductions }), [values, deductions])
  const comparison = useMemo(() => compareRegimes({ ...values, deductions }), [values, deductions])

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable — link is still shareable via the address bar */ }
  }

  function handleWhatsAppShare() {
    const text = `My ${formatLPA(values.ctc)} CTC breaks down to ${formatINR(breakdown.inHand.monthly)}/month in-hand (${values.regime === 'new' ? 'New' : 'Old'} Regime). Calculate yours free: ${typeof window !== 'undefined' ? window.location.href : ''}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  function handlePdfExport() {
    const filename = buildExportFilenameBase({ userName: '', fallbackTitle: `${formatLPA(values.ctc)}-salary-breakdown`, kind: 'salary' })
    exportSalaryBreakdownPdf(breakdown, `${filename}.pdf`)
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-gray-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === t.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ctc' && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="space-y-4">
            <SalaryCalculatorForm values={values} onChange={handleChange} deductions={deductions} onDeductionsChange={handleDeductionsChange} />

            <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer">
              <input type="checkbox" checked={fresherMode} onChange={(e) => setFresherMode(e.target.checked)} className="accent-green-600" />
              <span className="text-sm font-medium text-gray-700">🎓 Fresher Mode — explain each term</span>
            </label>

            <div className="flex gap-2">
              <button onClick={handleShare} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                {copied ? 'Copied!' : 'Share URL'}
              </button>
              <button onClick={handleWhatsAppShare} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer">
                WhatsApp
              </button>
              <button onClick={handlePdfExport} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {fresherMode && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-sm font-semibold text-blue-900 mb-1">👋 Got your first offer? Here&apos;s how to read it.</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your offer letter shows an annual <strong>CTC</strong> (Cost to Company) — that&apos;s not what lands in your bank account every month.
                  Some of it (PF, gratuity) goes to your retirement savings, and some (tax) goes to the government.
                  What&apos;s actually left is your <strong>In-Hand Salary</strong> below — that&apos;s the number to budget with.
                </p>
              </div>
            )}

            <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-100 rounded-2xl p-6 text-center">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Your In-Hand Salary</p>
              <p className="text-4xl font-bold text-gray-900">{formatINR(breakdown.inHand.monthly)}<span className="text-lg font-medium text-gray-500"> / month</span></p>
              <p className="text-sm text-gray-600 mt-1">{formatINR(breakdown.inHand.annual)} per year · CTC {formatLPA(values.ctc)}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <SalaryBreakdown breakdown={breakdown} fresherMode={fresherMode} />
              <SalaryChart breakdown={breakdown} />
            </div>

            <RegimeComparison comparison={comparison} />
          </div>
        </div>
      )}

      {tab === 'hike' && <SalaryHikeCalculator baseValues={values} />}
      {tab === 'compare' && <OfferComparison baseValues={values} />}
      {tab === 'government' && <GovernmentPayCalculator />}
      {tab === 'city' && <CityCostComparison initialMonthlyInHand={Math.round(breakdown.inHand.monthly)} />}
    </div>
  )
}
