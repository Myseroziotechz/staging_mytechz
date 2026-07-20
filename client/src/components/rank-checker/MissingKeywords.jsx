'use client'

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-gray-50 text-gray-600 border-gray-200',
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function MissingKeywords({ missingKeywords = [] }) {
  if (missingKeywords.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Missing Keywords</h3>
        <p className="text-sm text-green-600 font-medium">No critical missing keywords found. Great job!</p>
      </div>
    )
  }

  const sorted = [...missingKeywords].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Missing Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {sorted.map((item, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.low}`}
            title={item.suggestion}
          >
            <span>{item.keyword}</span>
            <span className="text-[10px] opacity-60">→ {item.section}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-gray-400">Hover over a keyword to see where to add it</p>
    </div>
  )
}
