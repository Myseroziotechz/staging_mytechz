'use client'

export default function FormattingChecklist({ checklist = [] }) {
  if (checklist.length === 0) return null

  const passed = checklist.filter((c) => c.passed).length
  const total = checklist.length

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">ATS Formatting Check</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          passed === total ? 'bg-green-100 text-green-700' :
          passed >= total * 0.7 ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {passed}/{total} passed
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {checklist.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
              item.passed
                ? 'bg-green-50/50 border-green-200'
                : 'bg-red-50/50 border-red-200'
            }`}
          >
            {item.passed ? (
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`text-xs font-medium ${item.passed ? 'text-green-800' : 'text-red-800'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
