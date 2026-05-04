import 'server-only'

const ABOUT = `**MyTechZ** is a curated tech-careers portal for India. Here's how it works:

• **Four feeds** — Private jobs, Government jobs, Internships, and AI-curated picks. Pick a tab in the navbar.
• **Verified employers** — every recruiter is whitelisted by our admin team before they can post, so listings are real.
• **One-tap apply** — your profile + resume auto-fill the application; track everything under My Applications.
• **AI assistant (me!)** — ask "best react jobs in Bangalore" or "internships with stipend > 25k" and I'll rank matches for you.

Start by completing your profile and uploading a resume — that's how I personalize what I show you.`

export async function aboutBranch() {
  return {
    reply: ABOUT,
    jobs: [],
    suggestions: ['Show best jobs for me', 'How do I apply?', 'Find internships'],
  }
}
