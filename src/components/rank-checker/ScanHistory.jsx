'use client'

import { useState, useEffect } from 'react'

function getScoreColor(score) {
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

function getScoreBg(score) {
  if (score >= 70) return 'bg-green-50 border-green-200'
  if (score >= 40) return 'bg-amber-50 border-amber-200'
  return 'bg-red-50 border-red-200'
}

export default function ScanHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ai/resume/rank-history')
      .then((r) => r.ok ? r.json() : { history: [] })
      .then((data) => setHistory(data.history || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (history.length === 0) return null

  // Mini sparkline data: scores in chronological order (oldest → newest)
  const scores = [...history].reverse().map((h) => h.score)
  const maxScore = Math.max(...scores, 100)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Scans</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Your last {history.length} ATS score checks</p>
        </div>
        {/* Mini sparkline */}
        {scores.length >= 2 && (
          <div className="flex items-end gap-0.5 h-6">
            {scores.map((s, i) => (
              <div
                key={i}
                className={`w-2 rounded-t ${s >= 70 ? 'bg-green-400' : s >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ height: `${Math.max((s / maxScore) * 24, 4)}px` }}
                title={`Score: ${s}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {history.map((scan, i) => {
          const prevScore = i < history.length - 1 ? history[i + 1].score : null
          const diff = prevScore !== null ? scan.score - prevScore : null

          return (
            <div
              key={scan.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${getScoreBg(scan.score)}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold tabular-nums ${getScoreColor(scan.score)}`}>
                  {scan.score}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-700">{scan.role}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(scan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {scan.source === 'gemini' && (
                      <span className="ml-1 text-purple-500">AI</span>
                    )}
                  </p>
                </div>
              </div>
              {diff !== null && (
                <span className={`text-xs font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {diff > 0 ? `+${diff}` : diff === 0 ? '—' : diff}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
