'use client'

import AboutSection from './components/AboutSection'
import EducationSection from './components/EducationSection'
import ProjectsSection from './components/ProjectsSection'
import InternshipsSection from './components/InternshipsSection'
import SkillsSection from './components/SkillsSection'
import LanguagesSection from './components/LanguagesSection'

/**
 * Orchestrates the profile sections. Each one owns its own fetch, view/edit
 * state and save, so entering edit mode in one section leaves the others in
 * view mode.
 *
 * The old always-open "Personal Info / Professional" form lived here and wrote
 * `user_profiles.skills` from a comma-separated input — the same column
 * SkillsSection manages. Saving one silently discarded the other's changes, so
 * personal details now live in AboutSection and skills have a single owner.
 */
export default function ProfileForm({ userId, profile }) {
  return (
    <div className="space-y-5">
      <AboutSection userId={userId} initialProfile={profile} />
      <EducationSection userId={userId} />
      <SkillsSection userId={userId} />
      <ProjectsSection userId={userId} />
      <InternshipsSection userId={userId} />
      <LanguagesSection userId={userId} />
    </div>
  )
}
