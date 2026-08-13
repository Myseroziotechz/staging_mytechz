import Link from 'next/link'

function titleCase(s) {
  if (!s) return s
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Shows the candidate exactly what they're being matched against — every
 * field here is real data already aggregated by buildCandidateProfile()
 * from /profile's own tables (skills, education, projects, certifications,
 * experience). Shown in onboarding AND pinned at the top of the dashboard.
 */
export default function CandidateProfilePreview({ candidateProfile, compact = false }) {
  const {
    skills = [], domain, experienceYears, educationCount = 0,
    projectsCount = 0, certificationsCount = 0, highestEducation,
  } = candidateProfile || {}

  return (
    <div className={compact ? '' : 'bg-white rounded-2xl border border-slate-200 p-5 sm:p-6'}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Your Smart Match Profile</h3>
          <Link href="/profile" className="text-xs font-semibold text-violet-700 hover:text-violet-800">
            Edit profile →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        {domain && (
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Career domain</div>
            <div className="font-semibold text-slate-900">{titleCase(domain)}</div>
          </div>
        )}
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Experience</div>
          <div className="font-semibold text-slate-900">
            {experienceYears == null ? 'Not set' : experienceYears === 0 ? 'Fresher' : `${experienceYears} yrs`}
          </div>
        </div>
        {highestEducation && (
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Education</div>
            <div className="font-semibold text-slate-900">{highestEducation}</div>
          </div>
        )}
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Projects</div>
          <div className="font-semibold text-slate-900">{projectsCount}</div>
        </div>
        {certificationsCount > 0 && (
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Certifications</div>
            <div className="font-semibold text-slate-900">{certificationsCount}</div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Top skills</div>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 12).map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills.length < 6 && (
        <p className="mt-4 text-xs text-slate-500">
          Add a few more skills on <Link href="/profile" className="text-violet-700 hover:underline">your profile</Link> for stronger matches.
        </p>
      )}

      {educationCount === 0 && (
        <p className="mt-1 text-xs text-slate-400">No education entries yet.</p>
      )}
    </div>
  )
}
