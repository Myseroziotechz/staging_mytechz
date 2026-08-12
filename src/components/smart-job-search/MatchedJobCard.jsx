'use client'

import JobCard from '@/components/jobs/JobCard'
import SkillGapPanel from './SkillGapPanel'
import WhyThisMatch from './WhyThisMatch'

/**
 * Wraps the existing JobCard (matchScore + cardExtras props, already
 * supported — see /jobs/ai) rather than forking its markup. Save, apply
 * link, and every other JobCard behavior come for free, unchanged.
 */
export default function MatchedJobCard({ job, initialSaved }) {
  const match = job._match
  return (
    <JobCard
      job={job}
      matchScore={match?.percent ?? null}
      accent={match?.percent >= 80 ? 'blue' : null}
      initialSaved={initialSaved}
      cardExtras={
        match && (
          <div className="space-y-2.5">
            <SkillGapPanel matched={match.matchedSkills} missing={match.missingSkills} />
            <WhyThisMatch match={match} />
          </div>
        )
      }
    />
  )
}
