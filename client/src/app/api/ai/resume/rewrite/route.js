export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { rewriteSection, isGeminiConfigured } from '@/lib/ai/gemini'

// POST /api/ai/resume/rewrite — rewrite a section with AI
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  const { sectionType, content, context, resumeId } = await req.json()
  if (!sectionType || !content) {
    return NextResponse.json({ error: 'sectionType and content are required' }, { status: 400 })
  }

  const start = Date.now()
  try {
    const rewritten = await rewriteSection(sectionType, content, context)

    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      resume_id: resumeId || null,
      action_type: 'rewrite',
      input_summary: `Section: ${sectionType}`,
      output_summary: JSON.stringify(rewritten).slice(0, 500),
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'success',
    })

    return NextResponse.json({ rewritten })
  } catch (err) {
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      resume_id: resumeId || null,
      action_type: 'rewrite',
      input_summary: `Section: ${sectionType}`,
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'error',
      error_message: err.message?.slice(0, 500),
    })
    return NextResponse.json({ error: 'Failed to rewrite section' }, { status: 500 })
  }
}
