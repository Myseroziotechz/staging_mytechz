import 'server-only'
import { normalizeSkillSet } from './skill-aliases'
import { ROLE_KEYWORDS_MAP } from '@/lib/ai/ats-rule-engine'

/**
 * Aggregates the candidate's REAL profile data — no separate "candidate
 * profile" table. Everything here is read from tables that already power
 * the working /profile UI (plus, read-only, the resume builder's
 * `user_resumes.resume_data` as a bonus skill signal for anyone who's built
 * a resume but hasn't filled in the normalized skills/education tables).
 */
export async function buildCandidateProfile(supabase, userId) {
  const [profileRes, settingsRes, educationRes, projectsRes, internshipsRes, certsRes, resumeRes] =
    await Promise.all([
      supabase.from('user_profiles')
        .select('full_name, location, headline, skills, total_experience_years')
        .eq('id', userId).maybeSingle(),
      supabase.from('user_settings')
        .select('preferred_roles, preferred_locations, work_mode, employment_type')
        .eq('user_id', userId).maybeSingle(),
      supabase.from('education').select('*').eq('user_id', userId),
      supabase.from('projects').select('*').eq('user_id', userId),
      supabase.from('internships').select('*').eq('user_id', userId),
      supabase.from('certifications').select('*').eq('user_id', userId),
      supabase.from('user_resumes')
        .select('resume_data, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1),
    ])

  const profile = profileRes.data || {}
  const settings = settingsRes.data || {}
  const education = educationRes.data || []
  const projects = projectsRes.data || []
  const internships = internshipsRes.data || []
  const certifications = certsRes.data || []
  const resumeData = resumeRes.data?.[0]?.resume_data || {}

  // Skills: user_profiles.skills ∪ projects.skills_used ∪ latest resume's
  // parsed skills/tech-stacks — every real, populated source, normalized+deduped.
  const rawSkills = [
    ...(profile.skills || []),
    ...projects.flatMap((p) => p.skills_used || []),
    ...(Array.isArray(resumeData.skills) ? resumeData.skills : []),
    ...(Array.isArray(resumeData.projects)
      ? resumeData.projects.flatMap((p) => p.techStack || [])
      : []),
  ]
  const skills = normalizeSkillSet(rawSkills)

  // Domain: best-overlap role from ROLE_KEYWORDS_MAP against normalized skills.
  let domain = null
  let bestOverlap = 0
  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS_MAP)) {
    const kwSet = normalizeSkillSet(keywords)
    const overlap = skills.filter((s) => kwSet.includes(s)).length
    if (overlap > bestOverlap) {
      bestOverlap = overlap
      domain = role
    }
  }

  const experienceYears = profile.total_experience_years != null
    ? Number(profile.total_experience_years)
    : null

  const candidateProfile = {
    userId,
    name: profile.full_name || null,
    location: profile.location || null,
    headline: profile.headline || null,
    skills,
    experienceYears,
    domain,
    domainOverlapCount: bestOverlap,
    preferredRoles: settings.preferred_roles || [],
    preferredLocations: settings.preferred_locations || [],
    workMode: settings.work_mode || null,
    employmentType: settings.employment_type || null,
    educationCount: education.length,
    projectsCount: projects.length,
    internshipsCount: internships.length,
    certificationsCount: certifications.length,
    highestEducation: pickHighestEducation(education),
  }

  // Enough signal to produce a non-degenerate score: either a real handful
  // of skills, or at least one skill plus an explicit experience number.
  candidateProfile.hasEnoughData =
    skills.length >= 3 || (skills.length >= 1 && experienceYears != null)

  return candidateProfile
}

function pickHighestEducation(rows) {
  if (!rows.length) return null
  const sorted = [...rows].sort(
    (a, b) => (b.end_year || b.start_year || 0) - (a.end_year || a.start_year || 0),
  )
  return sorted[0]?.degree || null
}
