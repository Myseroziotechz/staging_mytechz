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
    return NextResponse.json({ error: 'A resume file or pasted resume text is required' }, { status: 400 })
  }
  if (!jobDescription?.trim() && !targetRole?.trim()) {
    return NextResponse.json({ error: 'Provide a job description or a target role to analyse against' }, { status: 400 })
  }

  // Build plain text from resumeData if only structured data provided
  const plainText = resumeText || buildPlainText(resumeData)
  if (!plainText || plainText.trim().length < 20) {
    return NextResponse.json({ error: 'Resume text is too short to analyse' }, { status: 400 })
  }

  try {
    // Always run local engine for categoryScores + warnings + new fields
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

    // Merge results — ensure consistent structure for both paths
    let result
    if (geminiResult && typeof geminiResult.atsScore === 'number') {
      // Gemini succeeded — merge Gemini insights with local category scores + warnings
      result = {
        source: 'gemini',
        atsScore: geminiResult.atsScore,
        categoryScores: localResult.categoryScores,
        keywords: localResult.keywords, // includes hardSkills, softSkills from local engine
        keywordFrequency: localResult.keywordFrequency,
        missingKeywords: (geminiResult.missingKeywords || []).map((kw, i) => {
          if (typeof kw === 'string') {
            return { keyword: kw, section: 'skills', skillType: 'hard', suggestion: `Add "${kw}" to your resume`, priority: i < 5 ? 'high' : 'medium' }
          }
          return { ...kw, skillType: kw.skillType || 'hard', priority: kw.priority || (i < 5 ? 'high' : 'medium') }
        }),
        suggestedAdditions: geminiResult.suggestedAdditions || localResult.suggestedAdditions,
        formattingChecklist: localResult.formattingChecklist,
        tips: geminiResult.tips || localResult.tips,
        warnings: localResult.warnings,
      }
    } else {
      // Local engine only — already has consistent structure
      result = localResult
    }

    // Log to ai_generation_logs — non-critical, must never fail the request.
    // output_content is jsonb: store structured data (not a stringified blob)
    // so rank-history can read it back reliably instead of regex-parsing text.
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        resume_id: null,
        action_type: 'rank_check',
        input_prompt: `Role: ${targetRole || 'general'}, JD: ${jobDescription ? 'yes' : 'no'}`,
        output_content: {
          atsScore: result.atsScore,
          source: result.source,
          targetRole: targetRole || null,
          jobDescription: jobDescription ? jobDescription.slice(0, 500) : null,
        },
        model_used: result.source === 'gemini' ? 'gemini-2.0-flash' : 'local-engine',
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ result })
  } catch (err) {
    // Log the real error server-side only — never forward internal exception
    // messages to the client.
    console.error('[rank-check] Error:', err)
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        resume_id: null,
        action_type: 'rank_check',
        input_prompt: `Role: ${targetRole || 'general'}, JD: ${jobDescription ? 'yes' : 'no'}`,
        model_used: 'unknown',
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json({ error: 'Analysis failed. Please try again in a moment.' }, { status: 500 })
  }
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
