'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatINR } from '@/lib/salary-calculator/format'

const SLICE_COLORS = {
  'In-Hand': '#16a34a',
  'Employee PF': '#3b82f6',
  'Professional Tax': '#a855f7',
  'Income Tax': '#f97316',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{formatINR(value)} / year</p>
    </div>
  )
}

/** Donut chart showing where a year's CTC actually goes. */
export default function SalaryChart({ breakdown }) {
  if (!breakdown) return null

  const data = [
    { name: 'In-Hand', value: Math.round(breakdown.inHand.annual) },
    { name: 'Employee PF', value: Math.round(breakdown.deductions.employeePf.annual) },
    { name: 'Professional Tax', value: Math.round(breakdown.deductions.professionalTax.annual) },
    { name: 'Income Tax', value: Math.round(breakdown.deductions.incomeTax.annual) },
  ].filter((d) => d.value > 0)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Where Your CTC Goes</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((d) => (
                  <Cell key={d.name} fill={SLICE_COLORS[d.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SLICE_COLORS[d.name] || '#94a3b8' }} />
                {d.name}
              </span>
              <span className="font-semibold text-gray-900">{formatINR(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
