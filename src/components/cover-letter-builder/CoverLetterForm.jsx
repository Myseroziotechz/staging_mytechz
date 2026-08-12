'use client'

import { useState } from 'react'
import SenderSection from './SenderSection'
import RecipientSection from './RecipientSection'
import LetterContentSection from './LetterContentSection'
import JobContextSection from './JobContextSection'

const SECTIONS = [
  { key: 'sender', label: 'Your Information' },
  { key: 'recipient', label: 'Recipient & Company' },
  { key: 'letter', label: 'Letter Content' },
  { key: 'job', label: 'Job Context' },
]

/**
 * Composes the four cover-letter sections behind the same collapsible-panel
 * pattern the resume builder's ResumeForm.jsx uses.
 */
export default function CoverLetterForm({
  senderInfo, recipientInfo, letterContent,
  onSenderChange, onRecipientChange, onLetterChange,
  jobId, onJobIdChange,
  coverLetterId,
}) {
  const [expanded, setExpanded] = useState(new Set(['sender', 'recipient', 'letter', 'job']))

  function toggle(key) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {SECTIONS.map((section) => (
        <div key={section.key} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => toggle(section.key)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-800">{section.label}</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expanded.has(section.key) ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expanded.has(section.key) && (
            <div className="px-4 pb-4 pt-1">
              {section.key === 'sender' && (
                <SenderSection data={senderInfo} onChange={onSenderChange} />
              )}
              {section.key === 'recipient' && (
                <RecipientSection data={recipientInfo} onChange={onRecipientChange} />
              )}
              {section.key === 'letter' && (
                <LetterContentSection data={letterContent} onChange={onLetterChange} coverLetterId={coverLetterId} />
              )}
              {section.key === 'job' && (
                <JobContextSection
                  letterContent={letterContent}
                  onLetterChange={onLetterChange}
                  recipientInfo={recipientInfo}
                  onRecipientChange={onRecipientChange}
                  senderInfo={senderInfo}
                  jobId={jobId}
                  onJobIdChange={onJobIdChange}
                  coverLetterId={coverLetterId}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
