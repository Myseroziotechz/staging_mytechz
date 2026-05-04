import 'server-only'
import { chatJSON, isLLMConfigured } from '../llm'
import { formatUserContext } from '../context'

const SYSTEM = `You are the MyTechZ AI assistant — friendly, concise, and helpful.
You help with career questions, interview prep, and navigating the MyTechZ job
portal. Use USER_CONTEXT to personalize when relevant. Keep replies under 100
words. If the user clearly wants to see jobs, suggest they ask "best jobs for
me". Never invent job listings — direct them to ask for a search instead.`

export async function generalBranch(_supabase, { message, userCtx }) {
  if (!isLLMConfigured()) {
    return {
      reply: userCtx
        ? `Hi ${userCtx.name?.split(' ')[0] || 'there'} — ask me "best jobs for me" or "how do I apply?".`
        : "Hi! Sign in for personalized help, or ask me about jobs and how MyTechZ works.",
      jobs: [],
      suggestions: ['Best jobs for me', 'How do I apply?', 'What is MyTechZ?'],
    }
  }
  try {
    const reply = await chatJSON({
      system: SYSTEM,
      user: `USER_CONTEXT:\n${formatUserContext(userCtx)}\n\nUser: ${message}`,
      max: 280,
    })
    return {
      reply: reply || "I'm here — ask me about jobs, internships, or how MyTechZ works.",
      jobs: [],
      suggestions: ['Best jobs for me', 'How do I apply?', 'What is MyTechZ?'],
    }
  } catch {
    return {
      reply: "I'm here — ask me about jobs, internships, or how MyTechZ works.",
      jobs: [],
      suggestions: ['Best jobs for me', 'How do I apply?'],
    }
  }
}
