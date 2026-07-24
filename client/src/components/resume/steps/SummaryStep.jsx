'use client'

export default function SummaryStep({ data, onChange }) {
  const basics = data.basics || {}

  function updateSummary(value) {
    onChange({ ...data, basics: { ...basics, summary: value } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Professional Summary</h3>
        <p className="text-sm text-slate-500">Write a compelling 3-4 sentence summary that highlights your experience and value proposition.</p>
      </div>

      <div>
        <textarea
          value={basics.summary || ''}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Results-driven software engineer with 6+ years of experience building scalable web applications..."
          rows={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none leading-relaxed"
        />
        <p className="mt-1 text-xs text-slate-400">{(basics.summary || '').length} characters</p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for a Great Summary</h4>
        <ul className="space-y-1.5 text-sm text-blue-800">
          <li className="flex gap-2"><span className="text-blue-500">&#8226;</span>Start with your professional identity and years of experience</li>
          <li className="flex gap-2"><span className="text-blue-500">&#8226;</span>Mention 2-3 key skills or areas of expertise</li>
          <li className="flex gap-2"><span className="text-blue-500">&#8226;</span>Include a quantifiable achievement if possible</li>
          <li className="flex gap-2"><span className="text-blue-500">&#8226;</span>Keep it under 4 sentences for maximum impact</li>
        </ul>
      </div>

      {/* Review checklist */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Resume Checklist</h4>
        <div className="space-y-2">
          {[
            { label: 'Contact information filled', check: basics.name && basics.email },
            { label: 'At least one work experience', check: (data.work || []).length > 0 },
            { label: 'Education added', check: (data.education || []).length > 0 },
            { label: 'Skills listed', check: (data.skills || []).length > 0 },
            { label: 'Professional summary written', check: !!basics.summary?.trim() },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.check ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.check ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                )}
              </div>
              <span className={`text-sm ${item.check ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
