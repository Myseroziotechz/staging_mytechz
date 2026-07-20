'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CATEGORY_LABELS = {
  keywordMatch: 'Keyword Match',
  sectionCompleteness: 'Sections',
  formatting: 'Formatting',
  contentDepth: 'Content Depth',
}

const WEIGHTS = {
  keywordMatch: '40%',
  sectionCompleteness: '25%',
  formatting: '15%',
  contentDepth: '20%',
}

function getBarColor(value) {
  if (value >= 70) return '#22c55e'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

export default function CategoryBarChart({ categoryScores = {} }) {
  const data = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    name: label,
    score: categoryScores[key] || 0,
    weight: WEIGHTS[key],
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
          <Tooltip
            formatter={(value, name, props) => [`${value}/100 (weight: ${props.payload.weight})`, 'Score']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
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
