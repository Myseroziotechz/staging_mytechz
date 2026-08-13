export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { rewriteCoverLetterSection, isGeminiConfigured, MODEL } from '@/lib/ai/gemini'

// POST /api/ai/cover-letter/rewrite — rewrite one section (opening / a body
// paragraph / closing) with AI.
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { sectionType, content, context } = body
  if (!sectionType || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'sectionType and non-empty content are required' }, { status: 400 })
  }
  if (content.length > 4000) {
    return NextResponse.json({ error: 'Content is too long (max 4000 characters).' }, { status: 400 })
  }

  try {
    const rewritten = await rewriteCoverLetterSection(sectionType, content, context || '')

    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'cover_letter_rewrite',
        input_prompt: content.slice(0, 500),
        output_content: { text: rewritten },
        model_used: MODEL,
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ rewritten })
  } catch (err) {
    // Was previously invisible: this log insert used `duration_ms`, a column
    // that doesn't exist on ai_generation_logs, so every past failure here
    // silently failed to log — there was no way to see the real error short
    // of reproducing the exact Gemini request by hand.
    console.error('[api/ai/cover-letter/rewrite] rewriteCoverLetterSection failed:', err.message)
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'cover_letter_rewrite',
        input_prompt: content.slice(0, 500),
        model_used: MODEL,
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json({ error: 'Failed to rewrite section' }, { status: 500 })
  }
}
