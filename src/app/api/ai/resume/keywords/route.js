export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { suggestKeywords, isGeminiConfigured } from '@/lib/ai/gemini'

// POST /api/ai/resume/keywords — suggest ATS keywords
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  const { resumeData, jobDescription, targetRole, resumeId } = await req.json()
  if (!resumeData) {
    return NextResponse.json({ error: 'resumeData is required' }, { status: 400 })
  }

  const start = Date.now()
  try {
    const suggestions = await suggestKeywords(resumeData, jobDescription, targetRole)

    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      resume_id: resumeId || null,
      action_type: 'suggest_keywords',
      input_summary: `Target: ${targetRole || 'general'}`,
      output_summary: JSON.stringify(suggestions).slice(0, 500),
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'success',
    })

    return NextResponse.json({ suggestions })
  } catch (err) {
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      resume_id: resumeId || null,
      action_type: 'suggest_keywords',
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'error',
      error_message: err.message?.slice(0, 500),
    })
    return NextResponse.json({ error: 'Failed to suggest keywords' }, { status: 500 })
  }
}
