'use client'

import Link from 'next/link'
import {
  formatSalary,
  formatLocation,
  jobTypeLabel,
  workModeLabel,
  jobUrl,
  companyInitials,
} from '@/lib/jobs/format'

export default function ChatJobCard({ job, rank, onClick }) {
  if (!job) return null
  const company = job.company || {}
  const compName = company.name || 'Company'
  const sal = formatSalary(job)
  const loc = formatLocation(job)

  return (
    <Link
      href={jobUrl(job)}
      onClick={onClick}
      className="snap-start shrink-0 w-64 rounded-2xl bg-white border border-slate-200/80
                 hover:border-blue-400 hover:shadow-md transition relative p-3 flex flex-col gap-2"
    >
      <span
        className="absolute -top-2 -left-2 text-[10px] font-bold w-6 h-6 rounded-full
                   bg-blue-700 text-white shadow ring-2 ring-white flex items-center justify-center"
      >
        #{rank}
      </span>

      <div className="flex items-start gap-2.5">
        <div
          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold
                     bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs"
        >
          {company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo_url}
              alt={compName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span>{companyInitials(compName)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
            {job.title}
          </p>
          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
            {compName}
            {company.is_verified && (
              <svg
                className="w-3 h-3 text-blue-600 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2l2.5 2 3.2-.4 1 3 2.7 1.6-1.5 2.8.6 3.1-3 .8-1.7 2.7-2.8-1.5-3 .8-1.7-2.7-3-.8.6-3.1L1.3 8.2 4 6.6l1-3 3.2.4L10 2z" />
              </svg>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {loc && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {loc}
          </span>
        )}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
          {workModeLabel(job.work_mode)}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
          {jobTypeLabel(job.job_type)}
        </span>
      </div>

      {Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {sal && (
        <p className="text-xs font-semibold text-slate-800 mt-auto">{sal}</p>
      )}

      {job._reason && (
        <p className="text-[10px] italic text-slate-500 line-clamp-1">
          ✨ {job._reason}
        </p>
      )}

      {job._matchScore != null && (
        <span
          className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5
                     rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
        >
          {job._matchScore}%
        </span>
      )}
    </Link>
  )
}
