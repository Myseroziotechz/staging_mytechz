'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ResumeForm from '@/components/resume-builder/ResumeForm'
import ResumePreview from '@/components/resume-builder/ResumePreview'
import ExportDropdown from '@/components/resume-builder/ExportDropdown'
import { exportAsPDF, exportAsDOCX, exportAsPNG, exportAsJPG, exportAsSVG } from '@/lib/resume/export'

export default function EditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const previewRef = useRef(null)
  const saveTimerRef = useRef(null)

  const [resume, setResume] = useState(null)
  const [template, setTemplate] = useState(null)
  const [resumeData, setResumeData] = useState({})
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchResume = useCallback(async () => {
    try {
      const res = await fetch(`/api/resumes/${id}`)
      const data = await res.json()
      if (res.ok && data.resume) {
        setResume(data.resume)
        setResumeData(data.resume.resume_data || {})
        setTemplate(data.resume.resume_templates)
      } else {
        setError('Resume not found')
      }
    } catch {
      setError('Failed to load resume')
    } finally {
      setLoading(false)
    }
  }, [id])

  // Fetch resume on mount
  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  // Auto-save with debounce
  const saveResume = useCallback(async (data) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_data: data }),
      })
      if (res.ok) {
        setLastSaved(new Date())
      }
    } catch {
      // Silent fail on auto-save
    } finally {
      setSaving(false)
    }
  }, [id])

  function handleDataChange(newData) {
    setResumeData(newData)
    // Debounced auto-save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveResume(newData), 1500)
  }

  // Export handler
  async function handleExport(format) {
    const el = previewRef.current
    if (!el && format !== 'docx') return

    const title = resume?.title || 'resume'
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}`

    try {
      switch (format) {
        case 'pdf': await exportAsPDF(el, `${filename}.pdf`); break
        case 'docx': await exportAsDOCX(resumeData, `${filename}.docx`, template?.default_sections); break
        case 'png': await exportAsPNG(el, `${filename}.png`); break
        case 'jpg': await exportAsJPG(el, `${filename}.jpg`); break
        case 'svg': await exportAsSVG(el, `${filename}.svg`); break
      }

      // Log export
      await fetch(`/api/resumes/${id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      })
    } catch (err) {
      setError(`Export failed: ${err.message}`)
    }
  }

  // ATS Keywords
  const [showKeywords, setShowKeywords] = useState(false)
  const [keywords, setKeywords] = useState(null)
  const [keywordsLoading, setKeywordsLoading] = useState(false)
  const [jobDesc, setJobDesc] = useState('')

  async function handleSuggestKeywords() {
    setKeywordsLoading(true)
    try {
      const res = await fetch('/api/ai/resume/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription: jobDesc, resumeId: id }),
      })
      const data = await res.json()
      if (res.ok) setKeywords(data.suggestions)
    } catch {
      // Silent fail
    } finally {
      setKeywordsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error && !resume) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => router.push('/ai-tools/resume-builder/my-resumes')} className="text-blue-600 hover:text-blue-700">
          Go to My Resumes
        </button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/ai-tools/resume-builder/my-resumes')}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">{resume?.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{template?.name} template</span>
              {saving && <span className="text-blue-600">Saving...</span>}
              {!saving && lastSaved && (
                <span className="text-green-600">Saved {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeywords(!showKeywords)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            ATS Keywords
          </button>
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-700">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form Editor */}
        <div className="w-[420px] shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 p-4">
          <ResumeForm
            resumeData={resumeData}
            onChange={handleDataChange}
            sections={template?.default_sections}
            resumeId={id}
          />
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6 flex justify-center">
          <div className="w-full max-w-[800px]">
            <ResumePreview
              ref={previewRef}
              template={template?.html_css_template}
              resumeData={resumeData}
              editable={true}
              onDataChange={handleDataChange}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Keywords Panel */}
        {showKeywords && (
          <div className="w-[320px] shrink-0 border-l border-slate-200 overflow-y-auto bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">ATS Keywords</h3>
              <button onClick={() => setShowKeywords(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="editor-job-desc" className="text-xs font-medium text-slate-600 mb-1 block">Paste Job Description (optional)</label>
                <textarea
                  id="editor-job-desc"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description to get targeted suggestions..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <button
                onClick={handleSuggestKeywords}
                disabled={keywordsLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {keywordsLoading ? 'Analysing...' : 'Analyse Keywords'}
              </button>

              {keywords && (
                <div className="space-y-4">
                  {keywords.atsScore !== undefined && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{keywords.atsScore}%</div>
                      <div className="text-xs text-blue-600">ATS Match Score</div>
                    </div>
                  )}

                  {keywords.missingKeywords?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 mb-2">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.missingKeywords.map((kw, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {keywords.tips?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 mb-2">Tips</h4>
                      <ul className="space-y-1.5">
                        {keywords.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
