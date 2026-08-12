const BADGE_STYLES = {
  new: 'bg-green-100 text-green-700',
  improvement: 'bg-blue-100 text-blue-700',
  fix: 'bg-yellow-100 text-yellow-700',
}

export default function ChangelogEntry({ title, date, version, items }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        {version && (
          <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {version}
          </span>
        )}
      </div>

      <time className="text-sm text-slate-500" dateTime={date}>
        {new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>

      <div className="mt-5 space-y-6">
        {Object.entries(
          items.reduce((acc, item) => {
            const key = item.type || 'improvement'
            if (!acc[key]) acc[key] = []
            acc[key].push(item.text)
            return acc
          }, {})
        ).map(([type, texts]) => (
          <div key={type}>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${BADGE_STYLES[type] || BADGE_STYLES.improvement}`}>
              {type === 'new' ? 'New' : type === 'fix' ? 'Bug Fix' : 'Improvement'}
            </span>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {texts.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-slate-400 shrink-0">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}
