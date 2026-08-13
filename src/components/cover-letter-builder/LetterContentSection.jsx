'use client'

import CoverLetterAIRewriteButton from './CoverLetterAIRewriteButton'

function FieldInput({ label, value, onChange, placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder = '', rows = 3, aiSectionType, aiContext }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-slate-600">{label}</label>
        {aiSectionType && (
          <CoverLetterAIRewriteButton sectionType={aiSectionType} content={value} context={aiContext} onRewritten={onChange} />
        )}
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
      />
    </div>
  )
}

/**
 * Builds the short context string sent alongside a section's raw text to
 * /api/ai/cover-letter/rewrite, so the rewrite is grounded in what job/company
 * this letter is actually for instead of blindly rewriting text in isolation.
 * Kept compact (title/company/skills + a short JD excerpt) rather than the
 * full letter/job description, per "don't send unnecessary information."
 */
function buildAiContext(recipientInfo = {}, letterContent = {}) {
  const parts = []
  if (recipientInfo.jobTitle || recipientInfo.companyName) {
    parts.push(`Applying for: ${[recipientInfo.jobTitle, recipientInfo.companyName].filter(Boolean).join(' at ')}`)
  }
  if (letterContent.keySkills?.length) {
    parts.push(`Key skills to highlight: ${letterContent.keySkills.join(', ')}`)
  }
  if (letterContent.jobDescription?.trim()) {
    parts.push(`Job description excerpt: ${letterContent.jobDescription.trim().slice(0, 600)}`)
  }
  return parts.join('\n')
}

export default function LetterContentSection({ data = {}, onChange, recipientInfo = {} }) {
  const body = data.body?.length ? data.body : ['']
  const aiContext = buildAiContext(recipientInfo, data)

  const update = (key, val) => onChange({ ...data, [key]: val })

  function updateParagraph(idx, val) {
    const next = [...body]
    next[idx] = val
    update('body', next)
  }

  function addParagraph() {
    update('body', [...body, ''])
  }

  function removeParagraph(idx) {
    const next = body.filter((_, i) => i !== idx)
    update('body', next.length ? next : [''])
  }

  function moveParagraph(idx, direction) {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= body.length) return
    const next = [...body]
    ;[next[idx], next[targetIdx]] = [next[targetIdx], next[idx]]
    update('body', next)
  }

  return (
    <div className="space-y-4">
      <FieldInput label="Greeting / Salutation" value={data.greeting} onChange={(v) => update('greeting', v)} placeholder="Dear Hiring Manager," />

      <TextAreaField
        label="Opening Paragraph"
        value={data.opening}
        onChange={(v) => update('opening', v)}
        placeholder="State the role you're applying for and a brief hook..."
        aiSectionType="opening"
        aiContext={aiContext}
      />

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Body Paragraphs</label>
          <button
            type="button"
            onClick={addParagraph}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Paragraph
          </button>
        </div>
        <div className="space-y-3">
          {body.map((para, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">Paragraph {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <CoverLetterAIRewriteButton
                    sectionType="body"
                    content={para}
                    context={aiContext}
                    onRewritten={(v) => updateParagraph(idx, v)}
                  />
                  <button
                    type="button"
                    onClick={() => moveParagraph(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move paragraph up"
                    className="w-6 h-6 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 flex items-center justify-center cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveParagraph(idx, 1)}
                    disabled={idx === body.length - 1}
                    aria-label="Move paragraph down"
                    className="w-6 h-6 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 flex items-center justify-center cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    disabled={body.length === 1}
                    aria-label="Remove paragraph"
                    className="w-6 h-6 rounded hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed text-red-500 flex items-center justify-center cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <textarea
                value={para}
                onChange={(e) => updateParagraph(idx, e.target.value)}
                placeholder="Describe relevant experience, achievements, or fit for the role..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      <TextAreaField
        label="Closing Paragraph"
        value={data.closing}
        onChange={(v) => update('closing', v)}
        placeholder="Thank the reader and include a call to action..."
        aiSectionType="closing"
        aiContext={aiContext}
      />

      <FieldInput label="Sign-off" value={data.signOff} onChange={(v) => update('signOff', v)} placeholder="Sincerely," />
    </div>
  )
}
