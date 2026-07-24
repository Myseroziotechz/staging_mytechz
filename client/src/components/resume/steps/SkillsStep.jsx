'use client'

import { useState } from 'react'
import { EMPTY_SKILL, SKILL_LEVELS } from '@/lib/resume/schema'

export default function SkillsStep({ data, onChange }) {
  const skills = data.skills || []

  function updateSkill(index, field, value) {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, skills: updated })
  }

  function addSkill() {
    onChange({ ...data, skills: [...skills, { ...EMPTY_SKILL, keywords: [] }] })
  }

  function removeSkill(index) {
    onChange({ ...data, skills: skills.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Skills</h3>
        <p className="text-sm text-slate-500">Group your skills by category (e.g., Frontend, Backend, Tools).</p>
      </div>

      {skills.map((s, i) => (
        <SkillGroup
          key={i}
          skill={s}
          index={i}
          onUpdate={updateSkill}
          onRemove={removeSkill}
        />
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Skill Group
      </button>
    </div>
  )
}

function SkillGroup({ skill, index, onUpdate, onRemove }) {
  const [keywordInput, setKeywordInput] = useState('')

  function addKeyword() {
    const trimmed = keywordInput.trim()
    if (!trimmed) return
    const keywords = [...(skill.keywords || []), trimmed]
    onUpdate(index, 'keywords', keywords)
    setKeywordInput('')
  }

  function removeKeyword(kIndex) {
    onUpdate(index, 'keywords', skill.keywords.filter((_, i) => i !== kIndex))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-700">Skill Group {index + 1}</h4>
        <button type="button" onClick={() => onRemove(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
          <input
            value={skill.name || ''}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="Frontend"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Proficiency Level</label>
          <select
            value={skill.level || ''}
            onChange={(e) => onUpdate(index, 'level', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select...</option>
            {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Keywords / Technologies</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(skill.keywords || []).map((k, j) => (
            <span key={j} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {k}
              <button type="button" onClick={() => removeKeyword(j)} className="hover:text-red-500">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type skill and press Enter"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
