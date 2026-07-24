'use client'

import { useState, useRef } from 'react'

export default function ResumeUploader({ onParsed }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/resume/parse', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`)
      }

      // Count filled sections for feedback
      const sections = []
      if (data.basics?.name)         sections.push('personal info')
      if (data.work?.length)         sections.push(`${data.work.length} job${data.work.length > 1 ? 's' : ''}`)
      if (data.education?.length)    sections.push(`${data.education.length} education`)
      if (data.skills?.length)       sections.push(`${data.skills.length} skill groups`)
      if (data.projects?.length)     sections.push(`${data.projects.length} project${data.projects.length > 1 ? 's' : ''}`)
      if (data.certificates?.length) sections.push(`${data.certificates.length} cert${data.certificates.length > 1 ? 's' : ''}`)

      if (!sections.length) {
        throw new Error('No data could be extracted. The file may be image-based or scanned.')
      }

      setSuccess(`Extracted: ${sections.join(', ')}`)
      onParsed?.(data)
    } catch (err) {
      setError(err.message)
    }
    setUploading(false)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          uploading
            ? 'border-blue-400 bg-blue-50/60 cursor-default'
            : dragging
            ? 'border-blue-500 bg-blue-50 cursor-copy'
            : 'border-slate-300 bg-white/50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm text-blue-700 font-semibold">Parsing your resume...</p>
              <p className="text-xs text-blue-500 mt-0.5">Extracting details with AI</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-green-700">Resume parsed successfully!</p>
            <p className="text-xs text-green-600">{success}</p>
            <p className="text-xs text-slate-400 mt-1">Form has been auto-filled — review each step</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Drop your resume here or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs text-slate-400">PDF or DOCX — AI will extract all details automatically</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
