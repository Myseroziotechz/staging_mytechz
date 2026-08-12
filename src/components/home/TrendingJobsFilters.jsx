'use client'

import JobCard from '@/components/jobs/JobCard'

export default function TrendingJobsFilters({ jobs }) {
  return (
    <div className="job-card-stagger no-scrollbar flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 pb-2">
      {jobs.slice(0, 6).map((job) => (
        <div key={job.id} className="shrink-0 sm:shrink w-[88vw] sm:w-auto snap-center">
          <JobCard job={job} variant="compact" />
        </div>
      ))}
    </div>
  )
}
