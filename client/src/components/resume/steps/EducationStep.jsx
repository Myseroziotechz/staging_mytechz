'use client'

import { EMPTY_EDUCATION, STUDY_TYPES } from '@/lib/resume/schema'

export default function EducationStep({ data, onChange }) {
  const education = data.education || []

  function updateEdu(index, field, value) {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, education: updated })
  }

  function addEdu() {
    onChange({ ...data, education: [...education, { ...EMPTY_EDUCATION }] })
  }

  function removeEdu(index) {
    onChange({ ...data, education: education.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Education</h3>
        <p className="text-sm text-slate-500">Add your educational background.</p>
      </div>

      {education.map((e, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-slate-700">Education {i + 1}</h4>
            <button type="button" onClick={() => removeEdu(i)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institution *</label>
              <input
                value={e.institution || ''}
                onChange={(ev) => updateEdu(i, 'institution', ev.target.value)}
                placeholder="IIT Delhi"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Field of Study *</label>
              <input
                value={e.area || ''}
                onChange={(ev) => updateEdu(i, 'area', ev.target.value)}
                placeholder="Computer Science"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree Type</label>
              <select
                value={e.studyType || ''}
                onChange={(ev) => updateEdu(i, 'studyType', ev.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select...</option>
                {STUDY_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="month"
                value={e.startDate || ''}
                onChange={(ev) => updateEdu(i, 'startDate', ev.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="month"
                value={e.endDate || ''}
                onChange={(ev) => updateEdu(i, 'endDate', ev.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Score / GPA</label>
            <input
              value={e.score || ''}
              onChange={(ev) => updateEdu(i, 'score', ev.target.value)}
              placeholder="8.7 CGPA"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEdu}
        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Education
      </button>
    </div>
  )
}
