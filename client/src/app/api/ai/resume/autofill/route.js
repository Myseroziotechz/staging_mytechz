export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { templateAutofill, parseResumeWithGemini, isGeminiConfigured } from '@/lib/ai/gemini'

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

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  if (!templateId) return NextResponse.json({ error: 'templateId is required' }, { status: 400 })

  // Fetch template
  const { data: template } = await supabase
    .from('resume_templates')
    .select('required_fields, default_sections')
    .eq('id', templateId)
    .single()

  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  const start = Date.now()
  try {
    // Extract text from file
    const fileType = file.name.split('.').pop()?.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (fileType === 'pdf') {
      const { PDFParse } = await import('pdf-parse')
      const parser = new PDFParse({ data: buffer })
      const parsed = await parser.getText()
      text = parsed.text
    } else if (fileType === 'docx' || fileType === 'doc') {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else {
      text = buffer.toString('utf-8')
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Could not extract enough text from the file' }, { status: 400 })
    }

    // Parse resume then auto-fill for template
    const parsed = await parseResumeWithGemini(text.slice(0, 8000))
    const resumeData = await templateAutofill(parsed, template.required_fields, template.default_sections)

    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      action_type: 'autofill',
      input_summary: `File: ${file.name}, Template: ${templateId}`,
      output_summary: JSON.stringify(resumeData).slice(0, 500),
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'success',
    })

    return NextResponse.json({ resumeData })
  } catch (err) {
    await supabase.from('ai_generation_logs').insert({
      user_id: user.id,
      action_type: 'autofill',
      input_summary: `File: ${file.name}, Template: ${templateId}`,
      model_used: 'gemini-2.0-flash',
      duration_ms: Date.now() - start,
      status: 'error',
      error_message: err.message?.slice(0, 500),
    })
    console.error('[autofill] Error:', err.message, err.stack?.slice(0, 500))
    return NextResponse.json({ error: `Failed to auto-fill resume: ${err.message}` }, { status: 500 })
  }
}
