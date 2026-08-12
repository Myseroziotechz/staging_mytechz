'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ResumeCard from '@/components/resume-builder/ResumeCard'

export default function MyResumesPage() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchResumes() }, [])

  async function fetchResumes() {
    try {
      const res = await fetch('/api/resumes')
      const data = await res.json()
      if (res.ok) setResumes(data.resumes || [])
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
      if (res.ok) setResumes((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // Silent fail
    }
  }

  async function handleDuplicate(id) {
    const original = resumes.find((r) => r.id === id)
    if (!original) return

    try {
      // Fetch full resume data
      const fullRes = await fetch(`/api/resumes/${id}`)
      const fullData = await fullRes.json()
      if (!fullRes.ok) return

      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${original.title} (Copy)`,
          template_id: original.template_id,
          resume_data: fullData.resume?.resume_data || {},
        }),
      })
      if (res.ok) fetchResumes()
    } catch {
      // Silent fail
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link
          href="/ai-tools/resume-builder/templates"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No resumes yet</h2>
          <p className="text-slate-500 mb-6">Create your first resume using one of our professional templates.</p>
          <Link
            href="/ai-tools/resume-builder/templates"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
