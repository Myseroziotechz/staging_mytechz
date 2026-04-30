'use client'

import Link from 'next/link'
import {
  formatSalary, formatLocation, formatExperience, formatPostedAgo,
  formatDeadline, jobTypeLabel, workModeLabel, jobUrl, companyInitials,
} from '@/lib/jobs/format'

const ICON = {
  bookmark: (filled) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.5A1.5 1.5 0 016.5 3h11A1.5 1.5 0 0119 4.5V21l-7-4-7 4V4.5z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 4h14M5 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
    </svg>
  ),
  pin: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  ),
  home: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
    </svg>
  ),
  sparkle: (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2zM19 16l1 2.4 2.4 1-2.4 1L19 23l-1-2.6L15.6 19.4 18 18.4 19 16z" />
    </svg>
  ),
}

function MetaPill({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span>{children}</span>
    </span>
  )
}

export default function JobCard({
  job,
  variant = 'default',         // 'default' | 'compact' | 'featured' | 'recruiter' | 'admin' | 'mini'
  isSaved = false,
  isApplied = false,
  matchScore = null,           // 0-100
  onSaveToggle,                // optional handler; if absent, link to detail page
  onApprove,
  onReject,
  onEdit,
  onClose,
}) {
  if (!job) return null

  const href     = jobUrl(job)
  const salary   = formatSalary(job)
  const loc      = formatLocation(job)
  const exp      = formatExperience(job)
  const posted   = formatPostedAgo(job.posted_at)
  const deadline = formatDeadline(job.application_deadline)
  const isNew = typeof posted === 'string' && (posted === 'Just now' || /^\d+[mh] ago$/.test(posted) || /^[12]d ago$/.test(posted))

  const company  = job.company || {}
  const compName = company.name || job.company_name || 'Company'
  const compLogo = company.logo_url

  const isMini    = variant === 'mini'
  const isCompact = variant === 'compact' || isMini
  const isFeatured = variant === 'featured' || job.is_featured

  const padding = isMini ? 'p-3' : isCompact ? 'p-4' : 'p-5 sm:p-6'
  const radius  = isMini ? 'rounded-xl' : 'rounded-2xl'

  return (
    <article
      className={[
        'job-card group relative',
        radius, padding,
        'flex flex-col gap-3',
        isFeatured ? 'ring-2 ring-amber-300/60' : '',
      ].join(' ')}
    >
      {/* shimmer/gradient layers handled in CSS via ::before/::after */}

      {/* Top: logo + title + bookmark */}
      <header className="relative z-[2] flex items-start gap-3">
        <div className={[
          'shrink-0 rounded-xl flex items-center justify-center font-bold',
          isMini ? 'w-9 h-9 text-sm' : 'w-11 h-11 sm:w-12 sm:h-12 text-base',
          'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 ring-1 ring-white/60',
        ].join(' ')}>
          {compLogo
            ? /* eslint-disable-next-line @next/next/no-img-element */
              <img src={compLogo} alt={compName} className="w-full h-full object-cover rounded-xl" />
            : <span>{companyInitials(compName)}</span>}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={href}
            className={[
              'block font-semibold text-slate-900 hover:text-blue-700 transition-colors leading-snug',
              isMini ? 'text-sm line-clamp-1' : isCompact ? 'text-base line-clamp-2' : 'text-base sm:text-lg line-clamp-2',
            ].join(' ')}
          >
            {job.title}
          </Link>
          <div className={[
            'mt-0.5 flex items-center gap-1.5 text-slate-500',
            isMini ? 'text-[11px]' : 'text-xs sm:text-sm',
          ].join(' ')}>
            <span className="truncate">{compName}</span>
            {company.is_verified && (
              <span title="Verified employer" className="inline-flex">
                <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.5 2 3.2-.4 1 3 2.7 1.6-1.5 2.8.6 3.1-3 .8-1.7 2.7-2.8-1.5-3 .8-1.7-2.7-3-.8.6-3.1L1.3 8.2 4 6.6l1-3 3.2.4L10 2z"/></svg>
              </span>
            )}
            {loc && <><span className="text-slate-300">·</span><span className="truncate">{loc}</span></>}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5">
          {isFeatured && !isMini && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Featured</span>
          )}
          {!isMini && isNew && deadline?.expired !== true && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">New</span>
          )}
          {!isMini && onSaveToggle && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSaveToggle(job) }}
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
              className={[
                'p-1.5 rounded-lg transition',
                isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50',
              ].join(' ')}
            >
              {ICON.bookmark(isSaved)}
            </button>
          )}
        </div>
      </header>

      {/* Meta row */}
      {!isMini && (
        <div className="relative z-[2] flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <MetaPill icon={ICON.briefcase}>{jobTypeLabel(job.job_type)}</MetaPill>
          <MetaPill icon={ICON.home}>{workModeLabel(job.work_mode)}</MetaPill>
          <MetaPill icon={ICON.clock}>{exp}</MetaPill>
          {job.openings > 1 && (
            <MetaPill icon={ICON.pin}>{job.openings} posts</MetaPill>
          )}
        </div>
      )}

      {/* Skills */}
      {!isMini && Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="relative z-[2] flex flex-wrap gap-1.5">
          {job.skills.slice(0, isCompact ? 3 : 5).map((s) => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100/80 text-slate-600 border border-slate-200/60">{s}</span>
          ))}
          {job.skills.length > (isCompact ? 3 : 5) && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">+{job.skills.length - (isCompact ? 3 : 5)} more</span>
          )}
        </div>
      )}

      {/* Bottom: salary + deadline + match */}
      <div className="relative z-[2] flex flex-wrap items-center justify-between gap-2">
        {salary ? (
          <div className={['font-semibold text-slate-900', isMini ? 'text-xs' : 'text-sm'].join(' ')}>{salary}</div>
        ) : <div />}
        <div className="flex items-center gap-2 text-xs">
          {posted && <span className="text-slate-400">{posted}</span>}
          {deadline && (
            <span className={[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border',
              deadline.urgent ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100',
            ].join(' ')}>
              {ICON.clock}{deadline.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isMini && (
        <div className="relative z-[2] mt-1 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {variant === 'admin' ? (
              <>
                <button onClick={(e) => { e.preventDefault(); onApprove?.(job) }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-[0.98]">Approve</button>
                <button onClick={(e) => { e.preventDefault(); onReject?.(job) }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 transition active:scale-[0.98]">Reject</button>
              </>
            ) : variant === 'recruiter' ? (
              <>
                <button onClick={(e) => { e.preventDefault(); onEdit?.(job) }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition active:scale-[0.98]">Edit</button>
                <button onClick={(e) => { e.preventDefault(); onClose?.(job) }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">Close</button>
                <span className="text-xs text-slate-500">{job.applications_count || 0} applicants</span>
              </>
            ) : (
              <Link
                href={isApplied ? `${href}?applied=1` : `${href}/apply`}
                className={[
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition active:scale-[0.98]',
                  isApplied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm shadow-blue-700/20',
                ].join(' ')}
              >
                {isApplied ? 'Applied ✓' : 'Apply Now'}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {matchScore != null && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {ICON.sparkle}{Math.round(matchScore)}% match
              </span>
            )}
            <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition">
              View details {ICON.arrow}
            </Link>
          </div>
        </div>
      )}

      {/* Whole-card click overlay (compact / mini) */}
      {(isMini || isCompact) && (
        <Link href={href} aria-label={`View ${job.title}`} className="absolute inset-0 z-[1] rounded-[inherit]" />
      )}
    </article>
  )
}

export function JobCardSkeleton({ variant = 'default' }) {
  const padding = variant === 'mini' ? 'p-3' : variant === 'compact' ? 'p-4' : 'p-5 sm:p-6'
  return (
    <div className={`job-card ${padding} rounded-2xl flex flex-col gap-3`}>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-xl job-card-skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded job-card-skeleton" />
          <div className="h-3 w-1/2 rounded job-card-skeleton" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-3 w-16 rounded job-card-skeleton" />
        <div className="h-3 w-16 rounded job-card-skeleton" />
        <div className="h-3 w-16 rounded job-card-skeleton" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-full job-card-skeleton" />
        <div className="h-5 w-14 rounded-full job-card-skeleton" />
        <div className="h-5 w-14 rounded-full job-card-skeleton" />
      </div>
    </div>
  )
}
