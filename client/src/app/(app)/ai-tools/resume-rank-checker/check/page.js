'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ResumeInput from '@/components/rank-checker/ResumeInput'
import MissingKeywords from '@/components/rank-checker/MissingKeywords'
import SuggestionsList from '@/components/rank-checker/SuggestionsList'
import WarningsPanel from '@/components/rank-checker/WarningsPanel'
import FormattingChecklist from '@/components/rank-checker/FormattingChecklist'
import ParsedPreview from '@/components/rank-checker/ParsedPreview'
import ScanHistory from '@/components/rank-checker/ScanHistory'

// Lazy-load Recharts components (heavy) — only loaded after analysis
const ScoreGauge = dynamic(() => import('@/components/rank-checker/ScoreGauge'), { ssr: false })
const CategoryBarChart = dynamic(() => import('@/components/rank-checker/CategoryBarChart'), { ssr: false })
const KeywordPieChart = dynamic(() => import('@/components/rank-checker/KeywordPieChart'), { ssr: false })
const KeywordFrequencyChart = dynamic(() => import('@/components/rank-checker/KeywordFrequencyChart'), { ssr: false })

export default function ResumeRankCheckerCheckPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [resumeText, setResumeText] = useState('')

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState({
    frequency: false,
    preview: false,
    warnings: false,
    suggestions: true,
  })

  function toggleSection(key) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleAnalyze({ mode, file, resumeText: inputText, jobDescription, targetRole }) {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let text = inputText

      // If file uploaded, parse it first
      if (mode === 'upload' && file) {
        setProgress('Parsing resume...')
        text = await parseFile(file)
        if (!text || text.trim().length < 20) {
          throw new Error('Could not extract text from the uploaded file. Try pasting your resume text instead.')
        }
      }

      setResumeText(text || '')
      setProgress('Analysing ATS compatibility...')

      const res = await fetch('/api/ai/resume/rank-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text, jobDescription, targetRole }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Analysis failed (${res.status})`)
      }

      const data = await res.json()
      setResult(data.result)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resume Rank Checker</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Upload your resume and get an instant ATS compatibility score with actionable improvement tips.
        </p>
      </div>

      {/* Input */}
      <ResumeInput onAnalyze={handleAnalyze} loading={loading} />

      {/* Scan History — shows before results */}
      {!result && !loading && <ScanHistory />}

      {/* Progress */}
      {loading && progress && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm font-medium text-blue-700">{progress}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Source badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              result.source === 'gemini' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {result.source === 'gemini' ? 'AI-Powered Analysis' : 'Rule-Based Analysis'}
            </span>
          </div>

          {/* Row 1: Score + Categories */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ScoreGauge score={result.atsScore} source={result.source} />
            <CategoryBarChart categoryScores={result.categoryScores} />
          </div>

          {/* Row 2: Keywords + Missing */}
          <div className="grid sm:grid-cols-2 gap-4">
            <KeywordPieChart keywords={result.keywords} />
            <MissingKeywords missingKeywords={result.missingKeywords} />
          </div>

          {/* Row 3: Formatting Checklist */}
          {result.formattingChecklist?.length > 0 && (
            <FormattingChecklist checklist={result.formattingChecklist} />
          )}

          {/* Row 4: Keyword Frequency (collapsible) */}
          {Object.keys(result.keywordFrequency || {}).length > 0 && (
            <CollapsibleSection
              title="Keyword Frequency Analysis"
              subtitle="Compare keyword counts between your resume and the job description"
              expanded={expandedSections.frequency}
              onToggle={() => toggleSection('frequency')}
            >
              <KeywordFrequencyChart keywordFrequency={result.keywordFrequency} />
            </CollapsibleSection>
          )}

          {/* Row 5: ATS Parsing Preview (collapsible) */}
          {resumeText && (
            <CollapsibleSection
              title="ATS Parsing Preview"
              subtitle="See exactly what text ATS systems extract from your resume"
              expanded={expandedSections.preview}
              onToggle={() => toggleSection('preview')}
            >
              <ParsedPreview resumeText={resumeText} keywords={result.keywords} />
            </CollapsibleSection>
          )}

          {/* Row 6: Warnings (collapsible) */}
          <CollapsibleSection
            title={`Issues & Fixes ${result.warnings?.length ? `(${result.warnings.length})` : ''}`}
            subtitle="Formatting and structural issues detected"
            expanded={expandedSections.warnings}
            onToggle={() => toggleSection('warnings')}
            defaultBadge={result.warnings?.length === 0 ? 'All Clear' : result.warnings?.filter((w) => w.level === 'critical').length > 0 ? 'Has Critical' : 'Has Warnings'}
            badgeTone={result.warnings?.length === 0 ? 'green' : result.warnings?.filter((w) => w.level === 'critical').length > 0 ? 'red' : 'amber'}
          >
            <WarningsPanel warnings={result.warnings} />
          </CollapsibleSection>

          {/* Row 7: Suggestions (always expanded by default) */}
          <CollapsibleSection
            title="Suggestions & Tips"
            subtitle="Actionable steps to improve your score"
            expanded={expandedSections.suggestions}
            onToggle={() => toggleSection('suggestions')}
          >
            <SuggestionsList suggestedAdditions={result.suggestedAdditions} tips={result.tips} />
          </CollapsibleSection>
        </div>
      )}
    </div>
  )
}

// ── Collapsible Section ─────────────────────────────────────────────────────────

function CollapsibleSection({ title, subtitle, expanded, onToggle, children, defaultBadge, badgeTone }) {
  const toneColors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {defaultBadge && !expanded && (
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${toneColors[badgeTone] || toneColors.green}`}>
                {defaultBadge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && <div className="px-0">{children}</div>}
    </div>
  )
}

// ── File parsing (client-side) ──────────────────────────────────────────────────

async function parseFile(file) {
  const type = file.type || file.name?.split('.').pop()?.toLowerCase()

  // Plain text
  if (type === 'text/plain' || type === 'txt') {
    return await file.text()
  }

  // For PDF and DOCX, send to parse endpoint
  if (type === 'application/pdf' || type === 'pdf' ||
      type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type === 'docx' ||
      type === 'application/msword' || type === 'doc') {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/ai/resume/parse', { method: 'POST', body: formData })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `Failed to parse file (${res.status})`)
    }
    const data = await res.json()
    // The parse endpoint returns structured data; build plain text from it
    return buildTextFromParsed(data.resumeData || data)
  }

  // Fallback: try reading as text
  return await file.text()
}

function buildTextFromParsed(data) {
  if (typeof data === 'string') return data
  const parts = []
  if (data.contact) {
    const c = data.contact
    parts.push([c.fullName, c.email, c.phone, c.location].filter(Boolean).join(' | '))
  }
  if (data.summary) parts.push(`Summary\n${data.summary}`)
  if (data.experience?.length) {
    parts.push('Experience')
    for (const e of data.experience) {
      parts.push(`${e.title || ''} at ${e.company || ''} (${e.startDate || ''} - ${e.endDate || ''})`)
      if (e.bullets?.length) parts.push(e.bullets.map((b) => `- ${b}`).join('\n'))
    }
  }
  if (data.education?.length) {
    parts.push('Education')
    for (const e of data.education) parts.push(`${e.degree || ''}, ${e.institution || ''} (${e.year || ''})`)
  }
  if (data.skills?.length) parts.push(`Skills\n${data.skills.join(', ')}`)
  if (data.certifications?.length) {
    parts.push('Certifications')
    for (const c of data.certifications) parts.push(`${c.name || ''} - ${c.issuer || ''}`)
  }
  if (data.projects?.length) {
    parts.push('Projects')
    for (const p of data.projects) parts.push(`${p.name || ''}: ${p.description || ''}`)
  }
  return parts.join('\n\n')
}
