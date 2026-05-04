import 'server-only'
import { chatJSON, isLLMConfigured } from '../llm'
import { formatUserContext } from '../context'

const SYSTEM = `You are MyTechZ's resume coach. Using USER_CONTEXT, give the user
3 concrete, specific suggestions to improve their resume for the kind of roles
they're targeting. Be warm and direct. Keep total response under 120 words.
If the user has no resume yet, encourage them to upload one and explain what
parsed_skills enables (better job matching). Use bullet points.`

export async function resumeBranch(_supabase, { message, userCtx }) {
  if (!userCtx) {
    return {
      reply:
        "Sign in and upload your resume so I can give personal advice. Without it I can only give generic tips.",
      jobs: [],
      suggestions: ['What is MyTechZ?', 'Show jobs anyway'],
    }
  }
  if (!isLLMConfigured()) {
    const skills = userCtx.skills.join(', ') || 'none parsed'
    return {
      reply: `Here's what I see on your resume:\n• Skills: ${skills}\n• Experience: ${userCtx.experienceYears ?? 'unknown'} yrs\n\nUpload a fresh resume from your profile to refresh — better parsing means better matches.`,
      jobs: [],
      suggestions: ['Show best jobs for me', 'How do I apply?'],
    }
  }
  try {
    const reply = await chatJSON({
      system: SYSTEM,
      user: `USER_CONTEXT:\n${formatUserContext(userCtx)}\n\nUser message: ${message}`,
      max: 350,
      smart: true,
    })
    return {
      reply: reply || 'Try adding measurable impact and a clean skills section near the top.',
      jobs: [],
      suggestions: ['Show jobs that fit me', 'How do I apply?'],
    }
  } catch {
    return {
      reply: 'Try adding measurable impact (numbers!) and a skills section pinned near the top.',
      jobs: [],
      suggestions: ['Show jobs that fit me'],
    }
  }
}
