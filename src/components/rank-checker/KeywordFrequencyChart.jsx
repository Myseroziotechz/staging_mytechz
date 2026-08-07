'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function KeywordFrequencyChart({ keywordFrequency = {} }) {
  const entries = Object.entries(keywordFrequency)
  if (entries.length === 0) return null

  // Sort by JD count descending, take top 10
  const data = entries
    .sort((a, b) => b[1].jdCount - a[1].jdCount)
    .slice(0, 10)
    .map(([keyword, counts]) => ({
      keyword: keyword.length > 14 ? keyword.slice(0, 12) + '...' : keyword,
      fullKeyword: keyword,
      'In JD': counts.jdCount,
      'In Resume': counts.resumeCount,
    }))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Keyword Frequency</h3>
      <p className="text-[11px] text-gray-400 mb-4">How often top keywords appear in your resume vs the job description</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="keyword" tick={{ fontSize: 11 }} width={110} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value, name) => [value, name]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullKeyword || label}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="In JD" fill="#93c5fd" radius={[0, 3, 3, 0]} barSize={10} />
          <Bar dataKey="In Resume" fill="#22c55e" radius={[0, 3, 3, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
