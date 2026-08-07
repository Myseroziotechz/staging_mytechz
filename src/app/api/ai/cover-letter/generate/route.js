export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { generateCoverLetterContent, isGeminiConfigured } from '@/lib/ai/gemini'

// POST /api/ai/cover-letter/generate — generate a full cover letter draft
// from the sender's profile + job context. Never persists anything itself —
// the client shows the result for review/confirmation before it overwrites
// any existing letter content.
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

  const { senderProfile, jobContext, jobDescription } = body
  if (!senderProfile || typeof senderProfile !== 'object') {
    return NextResponse.json({ error: 'senderProfile is required' }, { status: 400 })
  }
  if (jobDescription && jobDescription.length > 8000) {
    return NextResponse.json({ error: 'Job description is too long (max 8000 characters).' }, { status: 400 })
  }

  const start = Date.now()
  try {
    const draft = await generateCoverLetterContent(senderProfile, jobContext || {}, jobDescription || '')

    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      action_type: 'cover_letter_generate',
      input_prompt: JSON.stringify({ jobContext, jobDescription: (jobDescription || '').slice(0, 500) }),
      output_content: draft,
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'success',
    })

    return NextResponse.json({ draft })
  } catch (err) {
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      action_type: 'cover_letter_generate',
      input_prompt: JSON.stringify({ jobContext }),
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'error',
      error_message: err.message?.slice(0, 500),
    })
    return NextResponse.json({ error: 'Failed to generate cover letter content' }, { status: 500 })
  }
}
