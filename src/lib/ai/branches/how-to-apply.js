import 'server-only'

const STEPS_INTERNAL = [
  '1. Open the job and click **Apply Now**.',
  '2. Sign in (or sign up — takes 30 seconds).',
  '3. We auto-fill your profile + resume into a short application form.',
  '4. Review, then submit. You get a confirmation email immediately.',
  '5. Track every application under **My Applications** in the navbar.',
]

const STEPS_EXTERNAL = [
  '1. Open the job and click **Apply Now**.',
  '2. You\'ll be redirected to the company\'s own careers page.',
  '3. Complete their form there. We log the click so it shows in **My Applications**.',
  '4. Tip: keep our tab open — bookmark similar jobs while you\'re here.',
]

const STEPS_GOV = [
  '1. Government jobs link to the official notification PDF.',
  '2. Read the eligibility section first (age, qualification, fee).',
  '3. Apply on the official portal listed in the notification.',
  '4. Save the registration number — you\'ll need it for status checks.',
]

export async function howToApplyBranch(_supabase, { message }) {
  const t = (message || '').toLowerCase()
  let steps = STEPS_INTERNAL
  let lead = 'Most MyTechZ jobs use our one-tap apply:'
  if (/\b(govt|government|psu|sarkari)\b/.test(t)) {
    steps = STEPS_GOV
    lead = 'For government roles:'
  } else if (/\b(external|company site|their site|redirect)\b/.test(t)) {
    steps = STEPS_EXTERNAL
    lead = 'For jobs that link out to the company:'
  }
  return {
    reply: `${lead}\n\n${steps.join('\n')}`,
    jobs: [],
    suggestions: ['Show me jobs to apply for', 'How do I save jobs?', 'What is MyTechZ?'],
  }
}
