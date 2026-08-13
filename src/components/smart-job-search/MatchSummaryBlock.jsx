const BREAKDOWN_LABELS = {
  skills: 'Skills',
  experience: 'Experience',
  domain: 'Role fit',
  location: 'Location',
  workMode: 'Work mode',
  freshness: 'Freshness',
}

function labelColor(label) {
  if (label === 'Excellent match') return 'text-emerald-700 bg-emerald-50 border-emerald-200'
  if (label === 'Strong match') return 'text-blue-700 bg-blue-50 border-blue-200'
  if (label === 'Fair match') return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-slate-600 bg-slate-100 border-slate-200'
}

function barColor(percent) {
  if (percent >= 80) return 'bg-emerald-500'
  if (percent >= 60) return 'bg-blue-500'
  if (percent >= 40) return 'bg-amber-500'
  return 'bg-slate-400'
}

/**
 * The single implementation of "why did I get this score" — shared by the
 * card's expandable "Why this match?" panel (WhyThisMatch.jsx) and the job
 * detail page's standalone AI Match Summary block. Every number here comes
 * from the real, already-computed `match` result (src/lib/ai/match/engine.js)
 * — nothing in this component invents or rounds toward a nicer-looking figure.
 */
export default function MatchSummaryBlock({ match }) {
  if (!match) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full border ${labelColor(match.label)}`}>
          {match.percent}% — {match.label}
        </span>
        {match.dampened && (
          <span className="text-xs text-slate-500">Adjusted for experience gap</span>
        )}
      </div>

      <div className="space-y-2">
        {Object.entries(match.breakdown).map(([key, percent]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-20 shrink-0">{BREAKDOWN_LABELS[key] || key}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full ${barColor(percent)}`} style={{ width: `${percent}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-9 text-right">{percent}%</span>
          </div>
        ))}
      </div>

      {match.explanation && (
        <p className="text-sm text-slate-600 leading-relaxed">{match.explanation}</p>
      )}
    </div>
  )
}
