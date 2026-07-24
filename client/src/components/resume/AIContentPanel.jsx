'use client'

import { useState } from 'react'

export default function AIContentPanel({ resumeData, onApply }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [freeText, setFreeText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  async function callAI(action, context) {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, context }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setResult(data)
    } catch (err) {
      setResult({ error: err.message })
    }
    setLoading(false)
  }

  function generateSummary() {
    callAI('summary', {
      name: resumeData?.basics?.name,
      label: resumeData?.basics?.label,
      skills: resumeData?.skills,
      work: resumeData?.work?.slice(0, 3),
    })
  }

  function improveBullets() {
    const allHighlights = (resumeData?.work || []).flatMap((w) =>
      (w.highlights || []).filter(Boolean).map((h) => ({ bullet: h, role: w.position, company: w.name }))
    )
    if (!allHighlights.length) {
      setResult({ error: 'No bullet points found. Add work experience first.' })
      return
    }
    callAI('improve-bullets', { bullets: allHighlights.slice(0, 6) })
  }

  function parseText() {
    if (!freeText.trim()) return
    callAI('parse-text', { text: freeText, targetRole })
  }

  function checkATS() {
    if (!jobDescription.trim()) return
    callAI('ats-score', { resume: resumeData, jobDescription })
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-900">AI Assistant</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {[
          { key: 'summary', label: 'Summary' },
          { key: 'bullets', label: 'Bullets' },
          { key: 'describe', label: 'Describe Me' },
          { key: 'ats', label: 'ATS Score' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setResult(null) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === t.key ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'summary' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Generate a professional summary from your resume data.</p>
          <button onClick={generateSummary} disabled={loading} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Summary'}
          </button>
          {result?.summary && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-slate-700 mb-2">{result.summary}</p>
              <button
                onClick={() => onApply?.({ type: 'summary', value: result.summary })}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800"
              >
                Apply to Resume
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bullets' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Improve your experience bullet points using STAR method.</p>
          <button onClick={improveBullets} disabled={loading} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Improving...' : 'Improve Bullet Points'}
          </button>
          {result?.improved?.length > 0 && (
            <div className="mt-3 space-y-2">
              {result.improved.map((b, i) => (
                <div key={i} className="p-2 bg-green-50 rounded-lg border border-green-100 text-sm text-slate-700">
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'describe' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Describe yourself in a paragraph and let AI structure it into resume sections.</p>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role (e.g., Senior React Developer)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="I've worked at Google for 3 years as a software engineer, built microservices..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button onClick={parseText} disabled={loading || !freeText.trim()} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Parsing...' : 'Parse & Structure'}
          </button>
          {result && !result.error && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-slate-500 mb-2">Extracted data ready to apply</p>
              <button
                onClick={() => onApply?.({ type: 'merge', value: result })}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800"
              >
                Apply to Resume
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ats' && (
        <div>
          <p className="text-xs text-slate-500 mb-3">Paste a job description to check your resume&apos;s ATS compatibility.</p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button onClick={checkATS} disabled={loading || !jobDescription.trim()} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Checking...' : 'Check ATS Score'}
          </button>
          {result?.score !== undefined && (
            <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200 space-y-3">
              <div className="text-center">
                <div className={`text-3xl font-bold ${result.score >= 75 ? 'text-green-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {result.score}/100
                </div>
                <p className="text-xs text-slate-500">ATS Match Score</p>
              </div>
              {result.breakdown && Object.keys(result.breakdown).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(result.breakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 capitalize w-20 shrink-0">{k}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${v >= 75 ? 'bg-green-500' : v >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${v}%` }}
                        />
                      </div>
                      <span className="text-slate-600 font-medium w-7 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.missing_keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">Missing keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.missing_keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.suggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">Suggestions:</p>
                  <ul className="space-y-1">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-amber-500 shrink-0">&#9888;</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {result?.error && (
        <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{result.error}</span>
        </div>
      )}
    </div>
  )
}
