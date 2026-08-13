export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { templateAutofill, parseResumeWithGemini, isGeminiConfigured, MODEL } from '@/lib/ai/gemini'
import { validateResumeFile, extractResumeText } from '@/lib/ai/resume-text'

// POST /api/ai/resume/autofill — template-aware auto-fill from uploaded resume
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  const formData = await req.formData()
  const file = formData.get('file')
  const templateId = formData.get('templateId')

  const fileError = validateResumeFile(file)
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })
  if (!templateId) return NextResponse.json({ error: 'templateId is required' }, { status: 400 })

  // Fetch template
  const { data: template } = await supabase
    .from('resume_templates')
    .select('required_fields, default_sections')
    .eq('id', templateId)
    .single()

  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  try {
    const text = await extractResumeText(file)

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Could not extract enough text from the file' }, { status: 400 })
    }

    // Parse resume then auto-fill for template
    const parsed = await parseResumeWithGemini(text.slice(0, 8000))
    const resumeData = await templateAutofill(parsed, template.required_fields, template.default_sections)

    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'autofill',
        input_prompt: `File: ${file.name}, Template: ${templateId}`,
        output_content: resumeData,
        model_used: MODEL,
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ resumeData })
  } catch (err) {
    console.error('[autofill] Error:', err.message, err.stack?.slice(0, 500))
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'autofill',
        input_prompt: `File: ${file.name}, Template: ${templateId}`,
        model_used: MODEL,
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json({ error: `Failed to auto-fill resume: ${err.message}` }, { status: 500 })
  }
}
