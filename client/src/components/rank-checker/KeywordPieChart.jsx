'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function KeywordPieChart({ keywords = {} }) {
  const matched = keywords.matched?.length || 0
  const missing = keywords.missing?.length || 0
  const total = matched + missing

  if (total === 0) return null

  const data = [
    { name: 'Matched', value: matched },
    { name: 'Missing', value: missing },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Keyword Coverage</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-semibold text-green-700 mb-1">Matched ({matched})</p>
          <div className="flex flex-wrap gap-1">
            {(keywords.matched || []).slice(0, 12).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded">{kw}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-red-700 mb-1">Missing ({missing})</p>
          <div className="flex flex-wrap gap-1">
            {(keywords.missing || []).slice(0, 12).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
