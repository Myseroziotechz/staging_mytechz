import MatchSummaryBlock from './MatchSummaryBlock'

/** Expandable "Why this match?" panel for a job card — same <details> pattern already used for job-detail-page FAQs. */
export default function WhyThisMatch({ match }) {
  if (!match) return null

  return (
    <details className="group rounded-xl border border-slate-200 bg-white/70">
      <summary className="cursor-pointer list-none flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700">
        Why this match?
        <svg className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-3 pb-3 pt-1">
        <MatchSummaryBlock match={match} />
      </div>
    </details>
  )
}
