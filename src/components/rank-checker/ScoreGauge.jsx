'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = { low: '#ef4444', mid: '#f59e0b', high: '#22c55e' }

function getColor(score) {
  if (score >= 70) return COLORS.high
  if (score >= 40) return COLORS.mid
  return COLORS.low
}

function getLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Average'
  if (score >= 30) return 'Needs Work'
  return 'Poor'
}

function getInterpretation(score) {
  if (score >= 80) return 'Likely to pass most ATS filters. Strong keyword alignment.'
  if (score >= 70) return 'Good chance of passing ATS. Minor improvements possible.'
  if (score >= 50) return 'May pass some ATS filters. Add more relevant keywords.'
  if (score >= 30) return 'Unlikely to pass ATS. Significant keyword gaps found.'
  return 'Very low ATS compatibility. Resume needs major improvements.'
}

export default function ScoreGauge({ score = 0, source = 'local' }) {
  const color = getColor(score)
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">ATS Score</h3>
      <div className="relative w-48 h-28">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs font-semibold" style={{ color }}>{getLabel(score)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 text-center max-w-[220px]">
        {getInterpretation(score)}
      </p>
      <span className="mt-2 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
        {source === 'gemini' ? 'AI-Powered' : 'Rule-Based'} Analysis
      </span>
    </div>
  )
}
