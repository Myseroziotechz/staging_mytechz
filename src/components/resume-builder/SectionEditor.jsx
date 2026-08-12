'use client'

import { useState } from 'react'
import AIAssistButton from './AIAssistButton'

export default function SectionEditor({ sectionType, data, onChange, resumeId }) {
  switch (sectionType) {
    case 'contact':
      return <ContactEditor data={data} onChange={onChange} />
    case 'summary':
      return <SummaryEditor data={data} onChange={onChange} resumeId={resumeId} />
    case 'experience':
      return <ExperienceEditor data={data} onChange={onChange} resumeId={resumeId} />
    case 'education':
      return <EducationEditor data={data} onChange={onChange} />
    case 'skills':
      return <SkillsEditor data={data} onChange={onChange} resumeId={resumeId} />
    case 'certifications':
      return <CertificationsEditor data={data} onChange={onChange} />
    case 'projects':
      return <ProjectsEditor data={data} onChange={onChange} />
    case 'languages':
      return <LanguagesEditor data={data} onChange={onChange} />
    default:
      return <p className="text-sm text-slate-500">Unknown section: {sectionType}</p>
  }
}

function FieldInput({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  )
}

function ContactEditor({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-3">
      <FieldInput label="Full Name" value={data.fullName} onChange={(v) => update('fullName', v)} placeholder="John Doe" />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Email" value={data.email} onChange={(v) => update('email', v)} placeholder="john@example.com" type="email" />
        <FieldInput label="Phone" value={data.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" />
      </div>
      <FieldInput label="Location" value={data.location} onChange={(v) => update('location', v)} placeholder="Mumbai, India" />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="LinkedIn" value={data.linkedin} onChange={(v) => update('linkedin', v)} placeholder="linkedin.com/in/johndoe" />
        <FieldInput label="GitHub / Portfolio" value={data.github} onChange={(v) => update('github', v)} placeholder="github.com/johndoe" />
      </div>
    </div>
  )
}

function SummaryEditor({ data = '', onChange, resumeId }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="resume-summary" className="text-xs font-medium text-slate-600">Professional Summary</label>
        <AIAssistButton
          sectionType="summary"
          content={data}
          resumeId={resumeId}
          onRewritten={(r) => onChange(r.summary || r)}
        />
      </div>
      <textarea
        id="resume-summary"
        value={data || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Brief 2-3 sentence professional summary..."
        rows={4}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
      />
    </div>
  )
}

function ExperienceEditor({ data = [], onChange, resumeId }) {
  const update = (idx, key, val) => {
    const updated = [...data]
    updated[idx] = { ...updated[idx], [key]: val }
    onChange(updated)
  }

  const addEntry = () => onChange([...data, { title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }])

  const removeEntry = (idx) => onChange(data.filter((_, i) => i !== idx))

  const updateBullet = (entryIdx, bulletIdx, val) => {
    const updated = [...data]
    const bullets = [...(updated[entryIdx].bullets || [])]
    bullets[bulletIdx] = val
    updated[entryIdx] = { ...updated[entryIdx], bullets }
    onChange(updated)
  }

  const addBullet = (entryIdx) => {
    const updated = [...data]
    updated[entryIdx] = { ...updated[entryIdx], bullets: [...(updated[entryIdx].bullets || []), ''] }
    onChange(updated)
  }

  const removeBullet = (entryIdx, bulletIdx) => {
    const updated = [...data]
    updated[entryIdx] = { ...updated[entryIdx], bullets: updated[entryIdx].bullets.filter((_, i) => i !== bulletIdx) }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {data.map((exp, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Experience {idx + 1}</span>
            <div className="flex items-center gap-2">
              <AIAssistButton
                sectionType="experience"
                content={exp}
                resumeId={resumeId}
                onRewritten={(r) => {
                  if (r.bullets) update(idx, 'bullets', r.bullets)
                }}
              />
              {data.length > 1 && (
                <button onClick={() => removeEntry(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Job Title" value={exp.title} onChange={(v) => update(idx, 'title', v)} placeholder="Software Engineer" />
            <FieldInput label="Company" value={exp.company} onChange={(v) => update(idx, 'company', v)} placeholder="TCS" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FieldInput label="Location" value={exp.location} onChange={(v) => update(idx, 'location', v)} placeholder="Mumbai" />
            <FieldInput label="Start Date" value={exp.startDate} onChange={(v) => update(idx, 'startDate', v)} placeholder="Jan 2022" />
            <FieldInput label="End Date" value={exp.endDate} onChange={(v) => update(idx, 'endDate', v)} placeholder="Present" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-600 mb-1 block">Bullet Points</div>
            {(exp.bullets || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-2 mb-2">
                <span className="text-slate-400 mt-2 text-xs">•</span>
                <textarea
                  value={bullet}
                  onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                  placeholder="Describe an achievement or responsibility..."
                  rows={2}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
                {exp.bullets?.length > 1 && (
                  <button onClick={() => removeBullet(idx, bIdx)} className="text-xs text-red-400 hover:text-red-600 mt-2">×</button>
                )}
              </div>
            ))}
            <button onClick={() => addBullet(idx)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              + Add bullet point
            </button>
          </div>
        </div>
      ))}
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
        + Add Experience
      </button>
    </div>
  )
}

function EducationEditor({ data = [], onChange }) {
  const update = (idx, key, val) => {
    const updated = [...data]
    updated[idx] = { ...updated[idx], [key]: val }
    onChange(updated)
  }

  const addEntry = () => onChange([...data, { degree: '', institution: '', location: '', year: '' }])
  const removeEntry = (idx) => onChange(data.filter((_, i) => i !== idx))

  return (
    <div className="space-y-4">
      {data.map((edu, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Education {idx + 1}</span>
            {data.length > 1 && (
              <button onClick={() => removeEntry(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            )}
          </div>
          <FieldInput label="Degree" value={edu.degree} onChange={(v) => update(idx, 'degree', v)} placeholder="B.Tech Computer Science" />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Institution" value={edu.institution} onChange={(v) => update(idx, 'institution', v)} placeholder="IIT Bombay" />
            <FieldInput label="Year" value={edu.year} onChange={(v) => update(idx, 'year', v)} placeholder="2024" />
          </div>
          <FieldInput label="Location" value={edu.location} onChange={(v) => update(idx, 'location', v)} placeholder="Mumbai, India" />
        </div>
      ))}
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
        + Add Education
      </button>
    </div>
  )
}

function SkillsEditor({ data = [], onChange, resumeId }) {
  const [newSkill, setNewSkill] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange([...data, newSkill.trim()])
      setNewSkill('')
    }
  }

  const addSuggestedSkill = (skill) => {
    if (!data.includes(skill)) {
      onChange([...data, skill])
    }
    setSuggestions((prev) => prev.filter((s) => s !== skill))
  }

  const removeSkill = (idx) => onChange(data.filter((_, i) => i !== idx))

  const handleAIRewrite = (r) => {
    if (r.skills) onChange(r.skills)
    // After AI rewrite, fetch related keyword suggestions
    fetchSuggestions(r.skills || data)
  }

  async function fetchSuggestions(currentSkills) {
    setLoadingSuggestions(true)
    try {
      const res = await fetch('/api/ai/resume/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: { skills: currentSkills },
          resumeId,
        }),
      })
      const result = await res.json()
      if (res.ok && result.suggestions?.missingKeywords) {
        // Filter out skills already present
        const newSuggestions = result.suggestions.missingKeywords.filter(
          (kw) => !currentSkills.some((s) => s.toLowerCase() === kw.toLowerCase())
        )
        setSuggestions(newSuggestions.slice(0, 10))
      }
    } catch {
      // Silent fail
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-slate-600">Skills</div>
        <AIAssistButton
          sectionType="skills"
          content={data}
          resumeId={resumeId}
          onRewritten={handleAIRewrite}
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {data.map((skill, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
            {skill}
            <button onClick={() => removeSkill(idx)} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          placeholder="Type a skill and press Enter..."
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
        <button onClick={addSkill} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add
        </button>
      </div>

      {/* AI Suggested Keywords */}
      {loadingSuggestions && (
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Finding related keywords...
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Suggested keywords (click to add)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => addSuggestedSkill(s)}
                className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-colors border border-amber-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CertificationsEditor({ data = [], onChange }) {
  const update = (idx, key, val) => {
    const updated = [...data]
    updated[idx] = { ...updated[idx], [key]: val }
    onChange(updated)
  }

  const addEntry = () => onChange([...data, { name: '', issuer: '', year: '' }])
  const removeEntry = (idx) => onChange(data.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      {data.map((cert, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certification {idx + 1}</span>
            <button onClick={() => removeEntry(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
          <FieldInput label="Name" value={cert.name} onChange={(v) => update(idx, 'name', v)} placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-2">
            <FieldInput label="Issuer" value={cert.issuer} onChange={(v) => update(idx, 'issuer', v)} placeholder="Amazon" />
            <FieldInput label="Year" value={cert.year} onChange={(v) => update(idx, 'year', v)} placeholder="2024" />
          </div>
        </div>
      ))}
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
        + Add Certification
      </button>
    </div>
  )
}

function ProjectsEditor({ data = [], onChange }) {
  const update = (idx, key, val) => {
    const updated = [...data]
    updated[idx] = { ...updated[idx], [key]: val }
    onChange(updated)
  }

  const addEntry = () => onChange([...data, { name: '', description: '', techStack: [], date: '' }])
  const removeEntry = (idx) => onChange(data.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      {data.map((proj, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Project {idx + 1}</span>
            <button onClick={() => removeEntry(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
          <FieldInput label="Name" value={proj.name} onChange={(v) => update(idx, 'name', v)} placeholder="E-commerce Platform" />
          <div>
            <label htmlFor={`resume-project-desc-${idx}`} className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              id={`resume-project-desc-${idx}`}
              value={proj.description || ''}
              onChange={(e) => update(idx, 'description', e.target.value)}
              placeholder="Brief description of the project..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
            />
          </div>
          <FieldInput label="Date" value={proj.date} onChange={(v) => update(idx, 'date', v)} placeholder="2024" />
        </div>
      ))}
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
        + Add Project
      </button>
    </div>
  )
}

function LanguagesEditor({ data = [], onChange }) {
  const update = (idx, key, val) => {
    const updated = [...data]
    updated[idx] = { ...updated[idx], [key]: val }
    onChange(updated)
  }

  const addEntry = () => onChange([...data, { name: '', proficiency: '' }])
  const removeEntry = (idx) => onChange(data.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      {data.map((lang, idx) => (
        <div key={idx} className="flex items-end gap-2">
          <div className="flex-1">
            <FieldInput label="Language" value={lang.name} onChange={(v) => update(idx, 'name', v)} placeholder="Hindi" />
          </div>
          <div className="flex-1">
            <FieldInput label="Proficiency" value={lang.proficiency} onChange={(v) => update(idx, 'proficiency', v)} placeholder="Native" />
          </div>
          <button onClick={() => removeEntry(idx)} className="text-xs text-red-500 hover:text-red-700 pb-2">×</button>
        </div>
      ))}
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
        + Add Language
      </button>
    </div>
  )
}
