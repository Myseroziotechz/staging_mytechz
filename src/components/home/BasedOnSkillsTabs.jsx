'use client'

import { useMemo, useState } from 'react'
import JobCard from '@/components/jobs/JobCard'

export const SKILL_GROUPS = [
  {
    name: 'Business Skills',
    match: ['business', 'sales', 'marketing', 'finance', 'accounting', 'product management', 'strategy', 'operations', 'crm', 'negotiation'],
  },
  {
    name: 'Software Development',
    match: ['javascript', 'python', 'java', 'react', 'node', 'typescript', 'c++', 'c#', 'php', 'golang', 'full stack', 'backend', 'frontend', 'software'],
  },
  {
    name: 'Data Science / AI',
    match: ['machine learning', 'data science', 'artificial intelligence', 'ai', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'data analysis', 'sql', 'data engineering'],
  },
  {
    name: 'Design',
    match: ['ui', 'ux', 'figma', 'design', 'adobe', 'graphic', 'prototyping'],
  },
  {
    name: 'DevOps / Cloud',
    match: ['aws', 'azure', 'gcp', 'devops', 'docker', 'kubernetes', 'ci/cd', 'cloud'],
  },
  {
    name: 'Cybersecurity',
    match: ['security', 'cybersecurity', 'penetration testing', 'network security'],
  },
]

const SHORT_KEYWORDS = new Set(['ai', 'ui', 'ux'])

function skillMatchesKeyword(skill, keyword) {
  if (SHORT_KEYWORDS.has(keyword)) return new RegExp(`\\b${keyword}\\b`).test(skill)
  return skill.includes(keyword)
}

function matchesGroup(job, group) {
  const skills = (job.skills || []).map((s) => String(s).toLowerCase())
  return group.match.some((keyword) => skills.some((s) => skillMatchesKeyword(s, keyword)))
}

export default function BasedOnSkillsTabs({ jobs }) {
  const groupsWithJobs = useMemo(
    () => SKILL_GROUPS.map((g) => ({ ...g, jobs: jobs.filter((j) => matchesGroup(j, g)) })).filter((g) => g.jobs.length > 0),
    [jobs]
  )

  const [active, setActive] = useState(groupsWithJobs[0]?.name)
  const activeGroup = groupsWithJobs.find((g) => g.name === active) || groupsWithJobs[0]

  if (!activeGroup) return null

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {groupsWithJobs.map((g) => (
          <button
            key={g.name}
            type="button"
            onClick={() => setActive(g.name)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border ${
              activeGroup.name === g.name
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="job-card-stagger no-scrollbar flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 pb-2">
        {activeGroup.jobs.slice(0, 6).map((job) => (
          <div key={job.id} className="shrink-0 sm:shrink w-[88vw] sm:w-auto snap-center">
            <JobCard job={job} variant="compact" />
          </div>
        ))}
      </div>
    </>
  )
}
