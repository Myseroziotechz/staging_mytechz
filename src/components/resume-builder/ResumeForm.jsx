'use client'

import { useState } from 'react'
import SectionEditor from './SectionEditor'

const SECTION_LABELS = {
  contact: 'Contact Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  projects: 'Projects',
  languages: 'Languages',
}

const DEFAULT_SECTION_ORDER = ['contact', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'languages']

export default function ResumeForm({ resumeData, onChange, sections, resumeId }) {
  const [expandedSections, setExpandedSections] = useState(
    new Set(sections || DEFAULT_SECTION_ORDER)
  )

  const sectionOrder = sections || DEFAULT_SECTION_ORDER

  function toggleSection(section) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  function handleSectionChange(section, value) {
    onChange({ ...resumeData, [section]: value })
  }

  return (
    <div className="space-y-3">
      {sectionOrder.map((section) => (
        <div key={section} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-800">
              {SECTION_LABELS[section] || section}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.has(section) ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.has(section) && (
            <div className="px-4 pb-4 pt-1">
              <SectionEditor
                sectionType={section}
                data={resumeData?.[section]}
                onChange={(value) => handleSectionChange(section, value)}
                resumeId={resumeId}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
