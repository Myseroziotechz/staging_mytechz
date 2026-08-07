'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  private: '#3b82f6',
  government: '#f59e0b',
  internship: '#10b981',
  ai: '#8b5cf6',
}

const LABELS = {
  private: 'Private',
  government: 'Government',
  internship: 'Internship',
  ai: 'AI Picks',
}

export default function CategoryPieChart({ data = [] }) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: LABELS[d.category] || d.category,
      value: d.count,
      color: COLORS[d.category] || '#6b7280',
    }))

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Categories</h3>
        <p className="text-sm text-gray-400">No active jobs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Job Categories</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={75}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
