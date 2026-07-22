'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CATEGORY_META = {
  keywordMatch: { label: 'Keyword Match', weight: '40%', tip: 'How well your resume keywords align with the job description' },
  sectionCompleteness: { label: 'Sections', weight: '25%', tip: 'Whether your resume has all standard sections (summary, experience, education, skills)' },
  formatting: { label: 'Formatting', weight: '15%', tip: 'ATS-friendly formatting: no special chars, proper dates, contact info' },
  contentDepth: { label: 'Content Depth', weight: '20%', tip: 'Action verbs, quantified achievements, and skills detail' },
}

function getBarColor(value) {
  if (value >= 70) return '#22c55e'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const { name, score, weight, tip } = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-w-[220px]">
      <p className="text-sm font-semibold text-gray-900">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{tip}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-lg font-bold" style={{ color: getBarColor(score) }}>{score}/100</span>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Weight: {weight}</span>
      </div>
    </div>
  )
}

export default function CategoryBarChart({ categoryScores = {} }) {
  const data = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    name: `${meta.label} (${meta.weight})`,
    score: categoryScores[key] || 0,
    weight: meta.weight,
    tip: meta.tip,
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
