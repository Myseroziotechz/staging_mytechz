'use client'

const SECTION_COLORS = {
  skills: 'bg-blue-50 text-blue-700',
  experience: 'bg-purple-50 text-purple-700',
  summary: 'bg-amber-50 text-amber-700',
  education: 'bg-green-50 text-green-700',
}

export default function SuggestionsList({ suggestedAdditions = [], tips = [] }) {
  if (suggestedAdditions.length === 0 && tips.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Suggestions</h3>

      {suggestedAdditions.length > 0 && (
        <div className="space-y-2 mb-5">
          {suggestedAdditions.slice(0, 8).map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-gray-900">{item.keyword}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SECTION_COLORS[item.section] || 'bg-gray-100 text-gray-600'}`}>
                    {item.section}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Tips</h4>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-6m0-4h.01" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
