import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { buildCandidateProfile } from './candidate-profile'
import { deriveJobRequirements } from './job-requirements'
import { scoreJobMatch } from './engine'

/** Returns a single job's match result for the signed-in user, or null (anonymous / not enough profile data). */
export async function buildMatchForJob(job) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const candidateProfile = await buildCandidateProfile(supabase, user.id)
  if (!candidateProfile.hasEnoughData) return null

  const jobRequirements = deriveJobRequirements(job)
  return scoreJobMatch(job, candidateProfile, jobRequirements)
}
