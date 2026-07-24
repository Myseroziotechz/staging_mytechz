'use client'

import { EMPTY_PROJECT, EMPTY_CERTIFICATE, EMPTY_LANGUAGE, FLUENCY_LEVELS } from '@/lib/resume/schema'

export default function ProjectsStep({ data, onChange }) {
  const projects = data.projects || []
  const certificates = data.certificates || []
  const languages = data.languages || []

  // Projects
  function updateProject(index, field, value) {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, projects: updated })
  }
  function updateProjectHighlight(pIndex, hIndex, value) {
    const updated = [...projects]
    const highlights = [...(updated[pIndex].highlights || [])]
    highlights[hIndex] = value
    updated[pIndex] = { ...updated[pIndex], highlights }
    onChange({ ...data, projects: updated })
  }
  function addProjectHighlight(pIndex) {
    const updated = [...projects]
    updated[pIndex] = { ...updated[pIndex], highlights: [...(updated[pIndex].highlights || []), ''] }
    onChange({ ...data, projects: updated })
  }
  function removeProjectHighlight(pIndex, hIndex) {
    const updated = [...projects]
    updated[pIndex] = { ...updated[pIndex], highlights: updated[pIndex].highlights.filter((_, i) => i !== hIndex) }
    onChange({ ...data, projects: updated })
  }
  function addProject() { onChange({ ...data, projects: [...projects, { ...EMPTY_PROJECT, highlights: [''] }] }) }
  function removeProject(i) { onChange({ ...data, projects: projects.filter((_, j) => j !== i) }) }

  // Certificates
  function updateCert(index, field, value) {
    const updated = [...certificates]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, certificates: updated })
  }
  function addCert() { onChange({ ...data, certificates: [...certificates, { ...EMPTY_CERTIFICATE }] }) }
  function removeCert(i) { onChange({ ...data, certificates: certificates.filter((_, j) => j !== i) }) }

  // Languages
  function updateLang(index, field, value) {
    const updated = [...languages]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, languages: updated })
  }
  function addLang() { onChange({ ...data, languages: [...languages, { ...EMPTY_LANGUAGE }] }) }
  function removeLang(i) { onChange({ ...data, languages: languages.filter((_, j) => j !== i) }) }

  return (
    <div className="space-y-8">
      {/* Projects */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Projects</h3>
        <p className="text-sm text-slate-500 mb-4">Showcase notable projects.</p>

        {projects.map((p, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-slate-700">Project {i + 1}</h4>
              <button type="button" onClick={() => removeProject(i)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input value={p.name || ''} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="My Awesome Project" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input value={p.url || ''} onChange={(e) => updateProject(i, 'url', e.target.value)} placeholder="https://github.com/..." className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={p.description || ''} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="Brief description of the project" rows={2} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Highlights</label>
                <button type="button" onClick={() => addProjectHighlight(i)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">+ Add</button>
              </div>
              {(p.highlights || []).map((h, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <input value={h} onChange={(e) => updateProjectHighlight(i, j, e.target.value)} placeholder="Key achievement or feature" className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  <button type="button" onClick={() => removeProjectHighlight(i, j)} className="px-2 text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addProject} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">+ Add Project</button>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Certifications</h3>
        <p className="text-sm text-slate-500 mb-4">Add any certifications you hold.</p>

        {certificates.map((c, i) => (
          <div key={i} className="flex flex-wrap gap-3 mb-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
              <input value={c.name || ''} onChange={(e) => updateCert(i, 'name', e.target.value)} placeholder="AWS Solutions Architect" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">Issuer</label>
              <input value={c.issuer || ''} onChange={(e) => updateCert(i, 'issuer', e.target.value)} placeholder="Amazon" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="w-[140px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="month" value={c.date || ''} onChange={(e) => updateCert(i, 'date', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="button" onClick={() => removeCert(i)} className="px-2 py-2 text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        <button type="button" onClick={addCert} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">+ Add Certification</button>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Languages</h3>
        <p className="text-sm text-slate-500 mb-4">List languages you speak.</p>

        {languages.map((l, i) => (
          <div key={i} className="flex gap-3 mb-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
              <input value={l.language || ''} onChange={(e) => updateLang(i, 'language', e.target.value)} placeholder="English" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Fluency</label>
              <select value={l.fluency || ''} onChange={(e) => updateLang(i, 'fluency', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                {FLUENCY_LEVELS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => removeLang(i)} className="px-2 py-2 text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        <button type="button" onClick={addLang} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">+ Add Language</button>
      </div>
    </div>
  )
}
