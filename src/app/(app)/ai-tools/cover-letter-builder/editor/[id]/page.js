'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CoverLetterForm from '@/components/cover-letter-builder/CoverLetterForm'
import CoverLetterPreview from '@/components/cover-letter-builder/CoverLetterPreview'
import CoverLetterExportDropdown from '@/components/cover-letter-builder/CoverLetterExportDropdown'
import { exportAsPDF } from '@/lib/cover-letter/export'
import { buildExportFilenameBase } from '@/lib/filename'

export default function CoverLetterEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const previewRef = useRef(null)
  const saveTimerRef = useRef(null)
  const titleInputRef = useRef(null)

  const [coverLetter, setCoverLetter] = useState(null)
  const [template, setTemplate] = useState(null)
  const [senderInfo, setSenderInfo] = useState({})
  const [recipientInfo, setRecipientInfo] = useState({})
  const [letterContent, setLetterContent] = useState({})
  const [jobId, setJobId] = useState(null)

  const [title, setTitle] = useState('')
  const [renamingTitle, setRenamingTitle] = useState(false)

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileTab, setMobileTab] = useState('edit') // 'edit' | 'preview'

  const fetchCoverLetter = useCallback(async () => {
    try {
      const res = await fetch(`/api/cover-letters/${id}`)
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.coverLetter) {
        setCoverLetter(data.coverLetter)
        setTitle(data.coverLetter.title)
        setSenderInfo(data.coverLetter.sender_info || {})
        setRecipientInfo(data.coverLetter.recipient_info || {})
        setLetterContent(data.coverLetter.letter_content || {})
        setJobId(data.coverLetter.job_id || null)
        setTemplate(data.coverLetter.cover_letter_templates)
      } else {
        setError(data.error || 'Cover letter not found')
      }
    } catch {
      setError('Failed to load cover letter')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCoverLetter()
  }, [fetchCoverLetter])

  const saveCoverLetter = useCallback(async (updates) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/cover-letters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        setLastSaved(new Date())
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not save your changes.')
      }
    } catch {
      setError('Could not save your changes. Check your connection.')
    } finally {
      setSaving(false)
    }
  }, [id])

  // Edits to different fields (e.g. recipient.companyName, then
  // letter.greeting) can land within the same debounce window. A single
  // "last write wins" timer would drop earlier field's update when a later
  // one reschedules it, so pending changes are merged into one accumulator
  // and the timer always flushes everything accumulated so far.
  const pendingUpdatesRef = useRef({})

  function scheduleAutosave(updates) {
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const toSave = pendingUpdatesRef.current
      pendingUpdatesRef.current = {}
      saveCoverLetter(toSave)
    }, 1500)
  }

  function handleSenderChange(next) {
    setSenderInfo(next)
    scheduleAutosave({ sender_info: next })
  }
  function handleRecipientChange(next) {
    setRecipientInfo(next)
    scheduleAutosave({ recipient_info: next })
  }
  function handleLetterChange(next) {
    setLetterContent(next)
    scheduleAutosave({ letter_content: next })
  }
  function handleJobIdChange(next) {
    setJobId(next)
    scheduleAutosave({ job_id: next })
  }

  async function handleSaveNow() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    pendingUpdatesRef.current = {}
    await saveCoverLetter({
      title,
      sender_info: senderInfo,
      recipient_info: recipientInfo,
      letter_content: letterContent,
      job_id: jobId,
    })
  }

  async function commitTitle() {
    setRenamingTitle(false)
    const trimmed = title.trim()
    if (!trimmed) {
      setTitle(coverLetter?.title || 'Untitled Cover Letter')
      return
    }
    if (trimmed !== coverLetter?.title) {
      await saveCoverLetter({ title: trimmed })
      setCoverLetter((prev) => (prev ? { ...prev, title: trimmed } : prev))
    }
  }

  const renderData = { sender: senderInfo, recipient: recipientInfo, letter: letterContent }

  async function handleExport(format) {
    const el = previewRef.current
    if (!el && format !== 'docx') return

    const nameForFile = buildExportFilenameBase({
      userName: senderInfo?.fullName,
      fallbackTitle: title,
      kind: 'cover_letter',
    })

    try {
      if (format === 'pdf') {
        await exportAsPDF(el, `${nameForFile}.pdf`)
      } else if (format === 'print') {
        window.print()
      } else if (format === 'docx') {
        const { exportCoverLetterAsDOCX } = await import('@/lib/cover-letter/export')
        await exportCoverLetterAsDOCX(senderInfo, recipientInfo, letterContent, `${nameForFile}.docx`)
      }

      if (format !== 'print') {
        await fetch(`/api/cover-letters/${id}/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ format }),
        })
        setCoverLetter((prev) => (prev ? { ...prev, last_exported_at: new Date().toISOString(), last_export_format: format } : prev))
      }
    } catch (err) {
      setError(`Export failed: ${err.message}`)
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
          <p className="text-slate-500">Loading cover letter...</p>
        </div>
      </div>
    )
  }

  if (error && !coverLetter) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => router.push('/ai-tools/cover-letter-builder/my-letters')} className="text-blue-600 hover:text-blue-700">
          Go to My Cover Letters
        </button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Print styles — only the live preview is visible when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cl-print-area, #cl-print-area * { visibility: visible; }
          #cl-print-area { position: absolute; inset: 0; margin: 0; box-shadow: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/ai-tools/cover-letter-builder/my-letters')}
            className="text-slate-500 hover:text-slate-700 shrink-0"
            aria-label="Back to My Cover Letters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="min-w-0">
            {renamingTitle ? (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                  if (e.key === 'Escape') { setTitle(coverLetter?.title || ''); setRenamingTitle(false) }
                }}
                aria-label="Cover letter title"
                autoFocus
                className="text-sm font-semibold text-slate-900 border-b border-blue-400 focus:outline-none bg-transparent"
              />
            ) : (
              <button
                type="button"
                onClick={() => setRenamingTitle(true)}
                className="text-sm font-semibold text-slate-900 hover:text-blue-700 truncate max-w-[240px] text-left cursor-pointer"
                title="Click to rename"
              >
                {title}
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{template?.name || 'Custom'} template</span>
              {saving && <span className="text-blue-600">Saving...</span>}
              {!saving && lastSaved && (
                <span className="text-green-600">Saved {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveNow}
            disabled={saving}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            Save
          </button>
          <CoverLetterExportDropdown onExport={handleExport} />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-700 print:hidden">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Mobile Edit/Preview tabs */}
      <div className="flex lg:hidden border-b border-slate-200 bg-white shrink-0 print:hidden">
        {['edit', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
              mobileTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Editor */}
        <div className={`w-full lg:w-[420px] lg:shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50 p-4 print:hidden! ${
          mobileTab === 'edit' ? 'block' : 'hidden lg:block'
        }`}>
          <CoverLetterForm
            senderInfo={senderInfo}
            recipientInfo={recipientInfo}
            letterContent={letterContent}
            onSenderChange={handleSenderChange}
            onRecipientChange={handleRecipientChange}
            onLetterChange={handleLetterChange}
            jobId={jobId}
            onJobIdChange={handleJobIdChange}
            coverLetterId={id}
          />
        </div>

        {/* Live Preview — print:flex! forces this visible even when printing
            from a mobile viewport with the "Edit" tab active, since a
            `display:none` ancestor can't be overridden by the print
            stylesheet's `visibility:visible` on its children. */}
        <div className={`flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6 flex justify-center print:flex! print:p-0 print:bg-white print:overflow-visible ${
          mobileTab === 'preview' ? 'block' : 'hidden lg:flex'
        }`}>
          <div id="cl-print-area" className="w-full max-w-[800px]">
            <CoverLetterPreview
              ref={previewRef}
              template={template?.html_css_template}
              data={renderData}
              editable={true}
              onDataChange={(next) => {
                handleSenderChange(next.sender || senderInfo)
                handleRecipientChange(next.recipient || recipientInfo)
                handleLetterChange(next.letter || letterContent)
              }}
              className="rounded-lg print:rounded-none print:shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
