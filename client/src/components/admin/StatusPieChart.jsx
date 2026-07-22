'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  applied: '#3b82f6',
  reviewing: '#f59e0b',
  interview: '#8b5cf6',
  offered: '#10b981',
  rejected: '#ef4444',
  withdrawn: '#6b7280',
}

const LABELS = {
  applied: 'Applied',
  reviewing: 'Reviewing',
  interview: 'Interview',
  offered: 'Offered',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function StatusPieChart({ data = [] }) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: LABELS[d.status] || d.status,
      value: d.count,
      color: COLORS[d.status] || '#6b7280',
    }))

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Application Status</h3>
        <p className="text-sm text-gray-400">No applications yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Application Status</h3>
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
