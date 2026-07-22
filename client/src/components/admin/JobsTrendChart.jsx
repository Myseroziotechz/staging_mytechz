'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function JobsTrendChart({ data = [] }) {
  if (data.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Jobs Posted</h3>
      <p className="text-[11px] text-gray-400 mb-4">Weekly trend (last 12 weeks)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={30} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Jobs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
