'use client'

const LEVEL_CONFIG = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500',
    text: 'text-red-800',
    fix: 'text-red-600',
    label: 'Critical',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-500',
    text: 'text-amber-800',
    fix: 'text-amber-600',
    label: 'Warning',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500',
    text: 'text-blue-800',
    fix: 'text-blue-600',
    label: 'Info',
  },
}

const LEVEL_ORDER = { critical: 0, warning: 1, info: 2 }

export default function WarningsPanel({ warnings = [] }) {
  if (warnings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Issues</h3>
        <p className="text-sm text-green-600 font-medium">No issues found. Your resume is well-formatted!</p>
      </div>
    )
  }

  const sorted = [...warnings].sort(
    (a, b) => (LEVEL_ORDER[a.level] ?? 2) - (LEVEL_ORDER[b.level] ?? 2)
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Issues & Fixes</h3>
      <div className="space-y-2">
        {sorted.map((w, i) => {
          const cfg = LEVEL_CONFIG[w.level] || LEVEL_CONFIG.info
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
              <svg className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.icon}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {w.level === 'critical' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                ) : w.level === 'warning' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                )}
              </svg>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${cfg.text}`}>{w.message}</p>
                {w.fix && <p className={`text-xs mt-0.5 ${cfg.fix}`}>{w.fix}</p>}
              </div>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
