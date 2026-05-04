import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { buildUserContext } from '@/lib/ai/context'
import { detectIntent } from '@/lib/ai/intent'
import { rateLimit } from '@/lib/ai/rate-limit'
import { ensureSession, persistTurn } from '@/lib/ai/session'
import { searchJobsBranch } from '@/lib/ai/branches/search-jobs'
import { howToApplyBranch } from '@/lib/ai/branches/how-to-apply'
import { aboutBranch } from '@/lib/ai/branches/about'
import { resumeBranch } from '@/lib/ai/branches/resume'
import { generalBranch } from '@/lib/ai/branches/general'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_LEN = 1000

const BRANCHES = {
  search_jobs: searchJobsBranch,
  how_to_apply: howToApplyBranch,
  about_mytechz: aboutBranch,
  resume_advice: resumeBranch,
  general: generalBranch,
}

export async function POST(req) {
  const t0 = Date.now()
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return NextResponse.json({ reply: 'Server not ready.' }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const body = await req.json().catch(() => ({}))
  const message = (body.message || '').toString()
  const incomingSession = body.sessionId || null

  if (!message.trim())
    return NextResponse.json({ reply: 'Ask me anything.' })
  if (message.length > MAX_LEN)
    return NextResponse.json(
      { reply: 'Please keep it under 1000 characters.' },
      { status: 400 }
    )

  const ipKey =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anon'
  const limited = await rateLimit(user?.id || `ip:${ipKey}`)
  if (limited)
    return NextResponse.json(
      { reply: 'Too many requests — try again in a minute.' },
      { status: 429 }
    )

  const sessionId = await ensureSession(supabase, user, incomingSession, message)
  const userCtx = user ? await buildUserContext(supabase, user.id) : null

  const intent = detectIntent(message)
  const branch = BRANCHES[intent] || generalBranch

  let out
  try {
    out = await branch(supabase, { message, userCtx })
  } catch (e) {
    console.warn('[ai] branch failed', intent, e?.message)
    out = {
      reply:
        "I hit an error answering that. Try rephrasing, or ask me 'best jobs for me'.",
      jobs: [],
      suggestions: ['Best jobs for me', 'What is MyTechZ?'],
    }
  }

  const meta = { ...(out.meta || {}), latency_ms: Date.now() - t0, intent }
  await persistTurn(supabase, sessionId, message, { ...out, meta }, intent)

  return NextResponse.json({
    sessionId,
    intent,
    reply: out.reply,
    jobs: out.jobs || [],
    suggestions: out.suggestions || [],
  })
}
