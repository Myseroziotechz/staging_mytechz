'use client'

import { EMPTY_WORK } from '@/lib/resume/schema'

export default function ExperienceStep({ data, onChange }) {
  const work = data.work || []

  function updateWork(index, field, value) {
    const updated = [...work]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, work: updated })
  }

  function updateHighlight(workIndex, hlIndex, value) {
    const updated = [...work]
    const highlights = [...(updated[workIndex].highlights || [])]
    highlights[hlIndex] = value
    updated[workIndex] = { ...updated[workIndex], highlights }
    onChange({ ...data, work: updated })
  }

  function addHighlight(workIndex) {
    const updated = [...work]
    updated[workIndex] = { ...updated[workIndex], highlights: [...(updated[workIndex].highlights || []), ''] }
    onChange({ ...data, work: updated })
  }

  function removeHighlight(workIndex, hlIndex) {
    const updated = [...work]
    updated[workIndex] = {
      ...updated[workIndex],
      highlights: updated[workIndex].highlights.filter((_, i) => i !== hlIndex),
    }
    onChange({ ...data, work: updated })
  }

  function addWork() {
    onChange({ ...data, work: [...work, { ...EMPTY_WORK }] })
  }

  function removeWork(index) {
    onChange({ ...data, work: work.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Work Experience</h3>
        <p className="text-sm text-slate-500">Add your professional experience, most recent first.</p>
      </div>

      {work.map((w, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-slate-700">Position {i + 1}</h4>
            <button
              type="button"
              onClick={() => removeWork(i)}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
              <input
                value={w.position || ''}
                onChange={(e) => updateWork(i, 'position', e.target.value)}
                placeholder="Senior Software Engineer"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
              <input
                value={w.name || ''}
                onChange={(e) => updateWork(i, 'name', e.target.value)}
                placeholder="TechCorp India"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
              <input
                type="month"
                value={w.startDate || ''}
                onChange={(e) => updateWork(i, 'startDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <div className="flex items-center gap-3">
                <input
                  type="month"
                  value={w.endDate || ''}
                  onChange={(e) => updateWork(i, 'endDate', e.target.value)}
                  disabled={w.current}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-100 disabled:text-slate-400"
                />
                <label className="flex items-center gap-1.5 text-sm text-slate-600 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={w.current || false}
                    onChange={(e) => updateWork(i, 'current', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Current
                </label>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Key Achievements</label>
              <button
                type="button"
                onClick={() => addHighlight(i)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                + Add Point
              </button>
            </div>
            {(w.highlights || []).map((h, j) => (
              <div key={j} className="flex gap-2 mb-2">
                <input
                  value={h}
                  onChange={(e) => updateHighlight(i, j, e.target.value)}
                  placeholder="Achieved X by doing Y, resulting in Z"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i, j)}
                  className="px-2 text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addWork}
        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Work Experience
      </button>
    </div>
  )
}
