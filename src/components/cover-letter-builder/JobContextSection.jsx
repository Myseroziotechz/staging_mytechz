'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

function hasExistingContent(letterContent) {
  return Boolean(
    letterContent?.opening?.trim() ||
    letterContent?.closing?.trim() ||
    letterContent?.body?.some((p) => p?.trim())
  )
}

export default function JobContextSection({
  letterContent = {}, onLetterChange,
  recipientInfo = {}, onRecipientChange,
  senderInfo,
  jobId, onJobIdChange,
}) {
  const [jobOptions, setJobOptions] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [keywordDraft, setKeywordDraft] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [pendingDraft, setPendingDraft] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadJobs() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoadingJobs(false); return }

      // saved_jobs has no job_id column (only denormalized title/company) —
      // only job_applications links back to an internal jobs row.
      const [{ data: saved }, { data: applied }] = await Promise.all([
        supabase.from('saved_jobs').select('job_title, company_name').eq('user_id', user.id).limit(25),
        supabase.from('job_applications').select('job_id, job_title, company_name').eq('user_id', user.id).limit(25),
      ])
      if (cancelled) return

      const seen = new Set()
      const combined = [...(applied || []), ...(saved || []).map((j) => ({ ...j, job_id: null }))].filter((j) => {
        const key = `${j.job_title}__${j.company_name}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      setJobOptions(combined)
      setLoadingJobs(false)
    }
    loadJobs()
    return () => { cancelled = true }
  }, [])

  function selectJob(idx) {
    if (idx === '') {
      onJobIdChange?.(null)
      return
    }
    const job = jobOptions[Number(idx)]
    if (!job) return
    onRecipientChange({ ...recipientInfo, jobTitle: job.job_title || recipientInfo.jobTitle, companyName: job.company_name || recipientInfo.companyName })
    onJobIdChange?.(job.job_id || null)
  }

  function addKeyword() {
    const kw = keywordDraft.trim()
    if (!kw) return
    const existing = letterContent.keySkills || []
    if (!existing.includes(kw)) {
      onLetterChange({ ...letterContent, keySkills: [...existing, kw] })
    }
    setKeywordDraft('')
  }

  function removeKeyword(kw) {
    onLetterChange({ ...letterContent, keySkills: (letterContent.keySkills || []).filter((k) => k !== kw) })
  }

  async function handleGenerate() {
    if (generating) return
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/ai/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderProfile: senderInfo,
          jobContext: { jobTitle: recipientInfo.jobTitle, companyName: recipientInfo.companyName, keySkills: letterContent.keySkills },
          jobDescription: letterContent.jobDescription || '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.draft) {
        setGenError(data.error || 'Could not generate a draft. Please try again.')
        return
      }
      if (hasExistingContent(letterContent)) {
        // Never silently overwrite existing content — hold the draft for explicit confirmation.
        setPendingDraft(data.draft)
      } else {
        applyDraft(data.draft)
      }
    } catch {
      setGenError('Could not generate a draft. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  function applyDraft(draft) {
    onLetterChange({
      ...letterContent,
      greeting: draft.greeting || letterContent.greeting,
      opening: draft.opening || '',
      body: draft.body?.length ? draft.body : letterContent.body,
      closing: draft.closing || '',
      signOff: draft.signOff || letterContent.signOff,
    })
    setPendingDraft(null)
  }

  return (
    <div className="space-y-4">
      {!loadingJobs && jobOptions.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Use a Saved or Applied Job</label>
          <select
            value={jobOptions.findIndex((j) => j.job_id && j.job_id === jobId)}
            onChange={(e) => selectJob(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">Select a job (optional)</option>
            {jobOptions.map((job, idx) => (
              <option key={`${job.job_title}-${idx}`} value={idx}>
                {job.job_title} @ {job.company_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Job Description</label>
        <textarea
          value={letterContent.jobDescription || ''}
          onChange={(e) => onLetterChange({ ...letterContent, jobDescription: e.target.value })}
          placeholder="Paste the job description to tailor your letter..."
          rows={5}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Key Skills / Keywords to Highlight</label>
        <div className="flex gap-2 mb-2">
          <input
            value={keywordDraft}
            onChange={(e) => setKeywordDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
            placeholder="e.g. React, Team Leadership"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button type="button" onClick={addKeyword} className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer">Add</button>
        </div>
        {(letterContent.keySkills || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {letterContent.keySkills.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} aria-label={`Remove ${kw}`} className="text-blue-400 hover:text-red-500 cursor-pointer">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              {hasExistingContent(letterContent) ? 'Improve with AI' : 'Generate Draft with AI'}
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 mt-1.5">Uses your info above, the target role, and the job description to draft a tailored letter.</p>
        {genError && <p className="text-xs text-red-600 mt-2">{genError}</p>}
      </div>

      {pendingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-900">Replace your current letter content?</h3>
            <p className="mt-2 text-sm text-slate-600">
              You already have content in this letter. Generating a new AI draft will replace your greeting, opening, body paragraphs, and closing. This cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => applyDraft(pendingDraft)}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Replace Content
              </button>
              <button
                type="button"
                onClick={() => setPendingDraft(null)}
                className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
