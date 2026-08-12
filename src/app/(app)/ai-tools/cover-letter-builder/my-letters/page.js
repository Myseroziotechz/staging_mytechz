'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CoverLetterCard from '@/components/cover-letter-builder/CoverLetterCard'

export default function MyCoverLettersPage() {
  const [coverLetters, setCoverLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchCoverLetters() }, [])

  async function fetchCoverLetters() {
    setError('')
    try {
      const res = await fetch('/api/cover-letters')
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setCoverLetters(data.coverLetters || [])
      } else {
        setError(data.error || 'Could not load your cover letters.')
      }
    } catch {
      setError('Could not load your cover letters. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const previous = coverLetters
    setCoverLetters((prev) => prev.filter((c) => c.id !== id))
    try {
      const res = await fetch(`/api/cover-letters/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setCoverLetters(previous)
        setError('Could not delete this cover letter. Please try again.')
      }
    } catch {
      setCoverLetters(previous)
      setError('Could not delete this cover letter. Please try again.')
    }
  }

  async function handleDuplicate(id) {
    const original = coverLetters.find((c) => c.id === id)
    if (!original) return
    setError('')
    try {
      const fullRes = await fetch(`/api/cover-letters/${id}`)
      const fullData = await fullRes.json().catch(() => ({}))
      if (!fullRes.ok) {
        setError(fullData.error || 'Could not duplicate this cover letter.')
        return
      }
      const res = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${original.title} (Copy)`,
          template_id: original.template_id,
          sender_info: fullData.coverLetter?.sender_info || {},
          recipient_info: fullData.coverLetter?.recipient_info || {},
          letter_content: fullData.coverLetter?.letter_content || {},
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        fetchCoverLetters()
      } else {
        setError(data.error || 'Could not duplicate this cover letter.')
      }
    } catch {
      setError('Could not duplicate this cover letter. Please try again.')
    }
  }

  async function handleRename(id, newTitle) {
    const previous = coverLetters
    setCoverLetters((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)))
    try {
      const res = await fetch(`/api/cover-letters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) {
        setCoverLetters(previous)
        setError('Could not rename this cover letter. Please try again.')
      }
    } catch {
      setCoverLetters(previous)
      setError('Could not rename this cover letter. Please try again.')
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
          <h1 className="text-2xl font-bold text-slate-900">My Cover Letters</h1>
          <p className="text-slate-500 text-sm mt-1">
            {coverLetters.length} cover letter{coverLetters.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link
          href="/ai-tools/cover-letter-builder/templates"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Cover Letter
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 ml-3" aria-label="Dismiss error">×</button>
        </div>
      )}

      {coverLetters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No cover letters yet</h2>
          <p className="text-slate-500 mb-6">Create your first cover letter using one of our professional templates.</p>
          <Link
            href="/ai-tools/cover-letter-builder/templates"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {coverLetters.map((coverLetter) => (
            <CoverLetterCard
              key={coverLetter.id}
              coverLetter={coverLetter}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  )
}
