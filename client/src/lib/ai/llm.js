import 'server-only'

const PROVIDER = process.env.AI_PROVIDER || 'groq'
const GROQ_KEY = process.env.GROQ_API_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const FAST_MODEL = process.env.AI_MODEL_FAST || 'llama-3.3-70b-versatile'
const SMART_MODEL = process.env.AI_MODEL_SMART || 'llama-3.3-70b-versatile'

export function isLLMConfigured() {
  if (PROVIDER === 'groq') return !!GROQ_KEY
  if (PROVIDER === 'anthropic') return !!ANTHROPIC_KEY
  return false
}

export async function chatJSON({ system, user, json = false, max = 500, smart = false }) {
  if (!isLLMConfigured()) throw new Error('LLM not configured')
  if (PROVIDER === 'groq') return groq({ system, user, json, max, smart })
  if (PROVIDER === 'anthropic') return anthropic({ system, user, json, max, smart })
  throw new Error(`unknown AI_PROVIDER: ${PROVIDER}`)
}

async function groq({ system, user, json, max, smart }) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: smart ? SMART_MODEL : FAST_MODEL,
      temperature: json ? 0.2 : 0.5,
      max_tokens: max,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Groq ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

async function anthropic({ system, user, json, max, smart }) {
  const model = smart ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: max,
      system: json
        ? `${system}\n\nReturn ONLY valid JSON. No prose, no code fences.`
        : system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.content?.[0]?.text?.trim() || ''
}

export function safeParseJSON(text, fallback = null) {
  if (!text) return fallback
  try {
    return JSON.parse(text)
  } catch {}
  const m = text.match(/\{[\s\S]*\}/)
  if (m) {
    try {
      return JSON.parse(m[0])
    } catch {}
  }
  return fallback
}
