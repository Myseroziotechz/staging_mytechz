export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { parseResumeWithGemini, isGeminiConfigured } from '@/lib/ai/gemini'

// POST /api/ai/resume/parse — upload file text → extract structured data
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const fileType = file.name.split('.').pop()?.toLowerCase()
  if (!['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
    return NextResponse.json({ error: 'Supported formats: PDF, DOCX, DOC, TXT' }, { status: 400 })
  }

  const start = Date.now()
  try {
    let text = ''
    const buffer = Buffer.from(await file.arrayBuffer())

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

    // Try Gemini for structured parsing, fall back to raw text if it fails
    let resumeData = null
    let model = 'local'

    if (isGeminiConfigured()) {
      try {
        resumeData = await parseResumeWithGemini(text.slice(0, 8000))
        model = 'gemini-2.0-flash'
      } catch (geminiErr) {
        console.error('[resume/parse] Gemini failed, returning raw text:', geminiErr.message)
        // Fall through — return raw text below
      }
    }

    // If Gemini didn't work, return the raw extracted text
    if (!resumeData) {
      resumeData = { rawText: text }
    }

    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'parse',
        input_summary: `File: ${file.name} (${text.length} chars)`,
        output_summary: JSON.stringify(resumeData).slice(0, 500),
        model_used: model,
        duration_ms: Date.now() - start,
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ resumeData })
  } catch (err) {
    console.error('[resume/parse] Error:', err.message)
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'parse',
        input_summary: `File: ${file.name}`,
        model_used: 'unknown',
        duration_ms: Date.now() - start,
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json({ error: err.message || 'Failed to parse resume file' }, { status: 500 })
  }
}
