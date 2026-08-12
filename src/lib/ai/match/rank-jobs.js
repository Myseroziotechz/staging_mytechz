import 'server-only'
import { getJobs } from '@/lib/jobs/queries'
import { buildCandidateProfile } from './candidate-profile'
import { deriveJobRequirements } from './job-requirements'
import { scoreJobMatch } from './engine'

/**
 * Pure orchestration, no HTTP framing — called directly from the
 * `/ai-tools/smart-job-search` Server Component, the same pattern
 * `/jobs/ai/page.js` already uses for its own scoring (getJobs + score +
 * sort, all server-side, no client round trip).
 */
export async function rankJobsForCandidate(supabase, userId, { page = 1, perPage = 24, filters = {} } = {}) {
  const candidateProfile = await buildCandidateProfile(supabase, userId)
  if (!candidateProfile.hasEnoughData) {
    return { candidateProfile, jobs: [], gated: true, total: 0, error: null }
  }

  const { jobs: pool, error } = await getJobs({
    ...filters,
    sort: 'newest',
    per_page: 48, // scoring pool capped at getJobs' own max — same bound already used by the chat matching pipeline
    page: 1,
  })

  const scored = pool
    .map((job) => {
      const jobRequirements = deriveJobRequirements(job)
      const match = scoreJobMatch(job, candidateProfile, jobRequirements)
      return { ...job, _match: match }
    })
    .sort((a, b) => b._match.percent - a._match.percent)

  const from = (page - 1) * perPage
  const jobs = scored.slice(from, from + perPage)

  return { candidateProfile, jobs, gated: false, total: scored.length, error }
}
