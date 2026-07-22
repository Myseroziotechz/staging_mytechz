'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function KeywordPieChart({ keywords = {} }) {
  const hardSkills = keywords.hardSkills || { matched: [], missing: [] }
  const softSkills = keywords.softSkills || { matched: [], missing: [] }
  const allMatched = keywords.matched?.length || 0
  const allMissing = keywords.missing?.length || 0
  const total = allMatched + allMissing

  if (total === 0) return null

  // Overall pie data
  const overallData = [
    { name: 'Matched', value: allMatched },
    { name: 'Missing', value: allMissing },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Keyword Coverage</h3>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={overallData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>

      {/* Hard Skills vs Soft Skills breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Hard Skills
            <span className="text-[10px] text-gray-400 font-normal">
              ({hardSkills.matched.length}/{hardSkills.matched.length + hardSkills.missing.length})
            </span>
          </p>
          <div className="flex flex-wrap gap-1">
            {hardSkills.matched.slice(0, 8).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[11px]">{kw}</span>
            ))}
            {hardSkills.missing.slice(0, 4).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[11px] line-through opacity-70">{kw}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Soft Skills
            <span className="text-[10px] text-gray-400 font-normal">
              ({softSkills.matched.length}/{softSkills.matched.length + softSkills.missing.length})
            </span>
          </p>
          <div className="flex flex-wrap gap-1">
            {softSkills.matched.slice(0, 6).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[11px]">{kw}</span>
            ))}
            {softSkills.missing.slice(0, 4).map((kw) => (
              <span key={kw} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[11px] line-through opacity-70">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
