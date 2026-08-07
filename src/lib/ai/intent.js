import 'server-only'

const RULES = [
  {
    intent: 'how_to_apply',
    re: /\b(how (do|to|can) (i|you|we) apply|apply (to|for)|application process|after (i|you) apply|how does apply)\b/i,
  },
  {
    intent: 'about_mytechz',
    re: /\b(what is mytechz|who are you|how does (this|mytechz) work|about (mytechz|this site)|why (should i|trust))\b/i,
  },
  {
    intent: 'resume_advice',
    re: /\b(resume|cv|profile)\b.*\b(improve|better|good|fit|edit|advice|review|tips)\b/i,
  },
  {
    intent: 'search_jobs',
    re: /\b(jobs?|internship|opening|role|position|opportunities|hiring|vacancy|vacancies|career|gig)\b/i,
  },
  {
    intent: 'search_jobs',
    re: /\b(best|find|show|recommend|suggest|match|looking for|search)\b.*\b(work|job|role|opening|opportunit)/i,
  },
]

export function detectIntent(message) {
  const t = (message || '').trim()
  if (!t) return 'general'
  for (const r of RULES) if (r.re.test(t)) return r.intent
  return 'general'
}
