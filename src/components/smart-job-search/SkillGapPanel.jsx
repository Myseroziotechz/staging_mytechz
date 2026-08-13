/** Compact matched (✓) vs missing (⚠) skill chips for a match result. */
export default function SkillGapPanel({ matched = [], missing = [] }) {
  if (!matched.length && !missing.length) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {matched.slice(0, 6).map((s) => (
        <span
          key={`m-${s}`}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
        >
          ✓ {s}
        </span>
      ))}
      {missing.slice(0, 4).map((s) => (
        <span
          key={`g-${s}`}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
        >
          ⚠ {s}
        </span>
      ))}
    </div>
  )
}
