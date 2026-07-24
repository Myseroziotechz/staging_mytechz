'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'

const JOB_ROLES = [
  'Software Engineer', 'Full Stack Developer', 'Data Analyst', 'ML Engineer',
  'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Business Analyst',
  'Digital Marketer', 'HR Manager', 'Finance Analyst', 'QA Engineer',
  'Cybersecurity Analyst', 'Cloud Architect',
]

export default function UploadWidget() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u)
      setAuthLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [])

  const handleFile = (f) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx?|txt)$/i)) {
      setError('Only PDF, DOCX, DOC, or TXT files are accepted.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10 MB.')
      return
    }
    setError('')
    setFile(f)
  }

  const handleSubmit = async () => {
    if (!file) { setError('Please select a resume file.'); return }
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('resume_file', file)
      form.append('job_roles', JSON.stringify(selectedRoles))
      const res = await fetch('/api/ats/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed.')
      router.push(`/ai-tools/resume-rank-checker/results/${data.analysis_id}`)
    } catch (err) {
      setError(err.message)
      setUploading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Sign in to check your resume</h3>
        <p className="text-sm text-slate-500 mb-5">Your results are saved to your account so you can track improvement over time.</p>
        <div className="flex gap-3 justify-center">
          <a href="/auth/login?next=/ai-tools/resume-rank-checker" className="bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-all text-sm">
            Sign In
          </a>
          <a href="/auth/register" className="bg-slate-100 text-slate-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all text-sm">
            Create Free Account
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      {/* Step 1: Job Roles */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Step 1 — Select target job roles <span className="font-normal text-slate-400">(optional but improves accuracy)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {JOB_ROLES.map(role => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                selectedRoles.includes(role)
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: File Upload */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Step 2 — Upload your resume</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-blue-500 bg-blue-50' : file ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB — click to change</p>
              </div>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-slate-600">Drop your resume here or <span className="text-blue-600">browse</span></p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, DOC, or TXT — max 10 MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={uploading || !file}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analysing your resume…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Check My ATS Score — Free
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-400">No data shared externally. Analysis runs on MyTechZ servers.</p>
    </div>
  )
}
