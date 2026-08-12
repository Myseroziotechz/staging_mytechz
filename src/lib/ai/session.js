import 'server-only'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function ensureSession(supabase, user, incomingId, firstMessage) {
  if (incomingId && UUID_RE.test(incomingId)) {
    const { data } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', incomingId)
      .maybeSingle()
    if (data?.id) return data.id
  }
  const title = (firstMessage || 'New chat').slice(0, 80)
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: user?.id || null, title })
    .select('id')
    .single()
  if (error || !data?.id) return null
  return data.id
}

export async function persistTurn(
  supabase,
  sessionId,
  userMessage,
  branchOut,
  intent
) {
  if (!sessionId) return
  try {
    await supabase.from('chat_messages').insert([
      { session_id: sessionId, role: 'user', content: userMessage, intent },
      {
        session_id: sessionId,
        role: 'assistant',
        content: branchOut.reply || '',
        intent,
        job_ids: (branchOut.jobs || []).map((j) => j.id).filter(Boolean),
        meta: branchOut.meta || null,
      },
    ])
  } catch {}
}
