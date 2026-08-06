'use client'

import { useState } from 'react'
import FileUpload from '@/components/resume-builder/FileUpload'

const TABS = [
  { key: 'upload', label: 'Upload File' },
  { key: 'paste', label: 'Paste Text' },
]

export default function ResumeInput({ onAnalyze, loading = false }) {
  const [tab, setTab] = useState('upload')
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [touched, setTouched] = useState(false)

  const hasResume = tab === 'upload' ? !!file : resumeText.trim().length > 20
  const hasContext = !!jobDescription.trim() || !!targetRole.trim()
  const canSubmit = !loading && hasResume && hasContext

  function handleFileSelected(selected) {
    setFileError('')
    setFile(selected)
  }

  function handleFileError(message) {
    setFile(null)
    setFileError(message)
  }

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit) return
    onAnalyze({
      mode: tab,
      file: tab === 'upload' ? file : null,
      resumeText: tab === 'paste' ? resumeText : '',
      jobDescription,
      targetRole,
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
      {/* Tab toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* File upload or text input */}
      {tab === 'upload' ? (
        <FileUpload onFileSelected={handleFileSelected} onError={handleFileError} disabled={loading} />
      ) : (
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your full resume text here..."
          rows={8}
          disabled={loading}
          className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y disabled:opacity-50"
        />
      )}
      {fileError && (
        <p className="text-xs font-medium text-red-600">{fileError}</p>
      )}
      {touched && !hasResume && (
        <p className="text-xs font-medium text-red-600">
          {tab === 'upload' ? 'Please upload a resume file.' : 'Please paste at least 20 characters of resume text.'}
        </p>
      )}

      {/* Job Description / Target Role — at least one is required */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description to compare against..."
            rows={4}
            disabled={loading}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Target Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Software Engineer, Data Scientist"
            disabled={loading}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <p className="mt-2 text-[11px] text-gray-400">
            Provide a job description, a target role, or both — we&apos;ll tailor the analysis accordingly.
          </p>
        </div>
      </div>
      {touched && !hasContext && (
        <p className="text-xs font-medium text-red-600">
          Please provide a job description or a target role.
        </p>
      )}

      {/* Submit — stays clickable (except while loading) so a click always
          surfaces which required field is missing, instead of doing nothing. */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Analysing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Analyse Resume
          </>
        )}
      </button>
    </div>
  )
}
