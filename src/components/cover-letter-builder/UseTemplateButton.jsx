'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Creates a new cover letter draft from a template and redirects straight to
 * its editor — there's no separate "create" staging page (unlike the resume
 * builder) since a cover letter only needs a template choice to get started;
 * everything else (including AI generation) happens inside the editor.
 */
const VARIANTS = {
  default: 'w-full px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 disabled:hover:translate-y-0',
  compact: 'ml-auto px-4 py-2 rounded-lg text-sm',
}

export default function UseTemplateButton({ templateId, templateName, variant = 'default', className = '' }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    if (creating) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId, title: `${templateName} Cover Letter` }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.id) {
        router.push(`/ai-tools/cover-letter-builder/editor/${data.id}`)
      } else if (res.status === 401) {
        router.push('/login?returnTo=/ai-tools/cover-letter-builder/templates')
      } else {
        setError(data.error || 'Could not create cover letter. Please try again.')
        setCreating(false)
      }
    } catch {
      setError('Could not create cover letter. Please try again.')
      setCreating(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={creating}
        className={`inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${VARIANTS[variant]} ${className}`}
      >
        {creating ? 'Creating…' : variant === 'compact' ? 'Use Template' : 'Use This Template'}
        {!creating && (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}
