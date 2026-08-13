export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { generateResumeContent, isGeminiConfigured, MODEL } from '@/lib/ai/gemini'

// POST /api/ai/resume/generate — generate full resume from prompt
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  const { prompt, targetRole } = await req.json()
  if (!prompt || prompt.trim().length < 10) {
    return NextResponse.json({ error: 'Please provide a detailed description (at least 10 characters)' }, { status: 400 })
  }

  try {
    const resumeData = await generateResumeContent(prompt, targetRole)

    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'generate',
        input_prompt: prompt.slice(0, 500),
        output_content: resumeData,
        model_used: MODEL,
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ resumeData })
  } catch (err) {
    console.error('[api/ai/resume/generate] generateResumeContent failed:', err.message)
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'generate',
        input_prompt: prompt.slice(0, 500),
        model_used: MODEL,
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json({ error: 'Failed to generate resume content' }, { status: 500 })
  }
}
