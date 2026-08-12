'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FileUpload from '@/components/resume-builder/FileUpload'
import ResumeAnalysisProgress from './ResumeAnalysisProgress'

export default function OnboardingScreen() {
  const router = useRouter()
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [synced, setSynced] = useState(null)

  async function handleFileSelected(file) {
    if (!file) return
    setFileName(file.name)
    setStatus('uploading')
    setError('')
    setSynced(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/ai/resume/sync-profile', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus('error')
        setError(data.error || 'Could not analyze this resume right now. Please try again.')
        return
      }

      setStatus('done')
      setSynced(data.synced || null)
    } catch {
      setStatus('error')
      setError('Something went wrong uploading your resume. Please check your connection and try again.')
    }
  }

  const totalSynced = synced
    ? synced.skillsAdded + synced.educationAdded + synced.projectsAdded + synced.certificationsAdded
    : 0

  return (
    <div className="max-w-2xl mx-auto text-center py-6">
      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Let's build your job match profile</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        We'll analyze your resume and profile to find jobs that actually fit your skills and experience — ranked by real fit, not keywords.
      </p>

      {status === 'done' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-left mb-6">
          <p className="text-sm font-semibold text-emerald-900 mb-1">Resume analyzed.</p>
          <p className="text-sm text-emerald-700">
            {totalSynced > 0
              ? `Added ${synced.skillsAdded} skill${synced.skillsAdded === 1 ? '' : 's'}, ${synced.educationAdded} education, ${synced.projectsAdded} project, ${synced.certificationsAdded} certification entr${synced.certificationsAdded === 1 ? 'y' : 'ies'} to your profile.`
              : 'No new details found beyond what was already on your profile.'}
          </p>
          <button
            onClick={() => router.refresh()}
            className="mt-4 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md"
          >
            See My Matches
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
          <FileUpload onFileSelected={handleFileSelected} onError={(msg) => { setStatus('error'); setError(msg) }} disabled={status === 'uploading'} />
          <div className="mt-4">
            <ResumeAnalysisProgress status={status} fileName={fileName} />
          </div>
          {status === 'error' && error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      <p className="text-sm text-slate-500">
        Prefer to enter details yourself?{' '}
        <Link href="/profile" className="font-semibold text-violet-700 hover:text-violet-800">
          Complete your profile manually
        </Link>
      </p>
    </div>
  )
}
