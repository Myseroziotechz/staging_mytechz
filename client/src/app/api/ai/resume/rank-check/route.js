export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { suggestKeywords, isGeminiConfigured } from '@/lib/ai/gemini'
import { analyzeResumeATS } from '@/lib/ai/ats-rule-engine'

// POST /api/ai/resume/rank-check — ATS score analysis
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { resumeText, resumeData, jobDescription, targetRole } = body
  if (!resumeText && !resumeData) {
    return NextResponse.json({ error: 'resumeText or resumeData is required' }, { status: 400 })
  }

  // Build plain text from resumeData if only structured data provided
  const plainText = resumeText || buildPlainText(resumeData)

  const start = Date.now()

  // Always run local engine for categoryScores + warnings
  const localResult = analyzeResumeATS({
    resumeText: plainText,
    jobDescription: jobDescription || '',
    targetRole: targetRole || '',
  })

  // Try Gemini for enhanced analysis
  let geminiResult = null
  if (isGeminiConfigured()) {
    try {
      const dataForGemini = resumeData || { rawText: plainText }
      geminiResult = await suggestKeywords(dataForGemini, jobDescription || '', targetRole || '')
    } catch (err) {
      // Gemini failed — fall back to local engine silently
      console.error('[rank-check] Gemini failed, using local fallback:', err.message)
    }
  }

  // Merge results
  let result
  if (geminiResult && typeof geminiResult.atsScore === 'number') {
    // Gemini succeeded — merge Gemini insights with local category scores + warnings
    result = {
      source: 'gemini',
      atsScore: geminiResult.atsScore,
      categoryScores: localResult.categoryScores,
      keywords: localResult.keywords,
      missingKeywords: (geminiResult.missingKeywords || []).map((kw, i) => {
        if (typeof kw === 'string') {
          return { keyword: kw, section: 'skills', suggestion: `Add "${kw}" to your resume`, priority: i < 5 ? 'high' : 'medium' }
        }
        return { ...kw, priority: kw.priority || (i < 5 ? 'high' : 'medium') }
      }),
      suggestedAdditions: geminiResult.suggestedAdditions || localResult.suggestedAdditions,
      tips: geminiResult.tips || localResult.tips,
      warnings: localResult.warnings,
    }
  } else {
    // Local engine only
    result = localResult
  }

  // Log to ai_generation_logs
  await supabase.from('ai_generation_logs').insert({
    user_id: user.id,
    resume_id: null,
    action_type: 'rank_check',
    input_summary: `Role: ${targetRole || 'general'}, JD: ${jobDescription ? 'yes' : 'no'}, Source: ${result.source}`,
    output_summary: JSON.stringify({ atsScore: result.atsScore, source: result.source }).slice(0, 500),
    model_used: result.source === 'gemini' ? 'gemini-2.0-flash' : 'local-engine',
    duration_ms: Date.now() - start,
    status: 'success',
  }).catch(() => {}) // non-critical

  return NextResponse.json({ result })
}

function buildPlainText(data) {
  if (!data) return ''
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
