'use client'

import { useState } from 'react'

/**
 * Same UI/behaviour as the resume builder's AIAssistButton, pointed at the
 * cover-letter rewrite endpoint instead — kept as its own small component
 * rather than making AIAssistButton take a configurable URL, since that
 * component is resume-specific in its prop names (`resumeId`) too and
 * changing it risks the existing resume editor.
 */
export default function CoverLetterAIRewriteButton({ sectionType, content, context, onRewritten }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRewrite() {
    if (loading || !content?.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/cover-letter/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionType, content, context }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.rewritten) {
        onRewritten(data.rewritten)
      } else {
        setError(data.error || 'Could not rewrite this section.')
      }
    } catch {
      setError('Could not rewrite this section.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleRewrite}
        disabled={loading || !content?.trim()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Rewrite this paragraph with AI"
      >
        {loading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Rewriting...
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Improve with AI
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  )
}
