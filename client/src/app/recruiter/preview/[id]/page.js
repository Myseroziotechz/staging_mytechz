import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireRecruiterOnboarded } from '@/lib/auth/recruiter-auth'
import { getJobForOwner } from '@/lib/jobs/queries'
import JobCard from '@/components/jobs/JobCard'
import {
  formatSalary,
  formatLocation,
  formatExperience,
  formatPostedAgo,
  formatDeadline,
  jobTypeLabel,
  workModeLabel,
} from '@/lib/jobs/format'

export const metadata = {
  title: 'Job preview — MyTechZ Recruiter',
  robots: { index: false, follow: false },
}

const STATUS_BADGE = {
  pending_approval: { label: 'Pending admin approval', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  active:           { label: 'Live',                   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:         { label: 'Rejected',               cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  closed:           { label: 'Closed',                 cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  draft:            { label: 'Draft',                  cls: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export default async function RecruiterJobPreviewPage({ params }) {
  await requireRecruiterOnboarded()

  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const job = await getJobForOwner(id, user.id)
  if (!job) notFound()

  const badge = STATUS_BADGE[job.status] || STATUS_BADGE.draft
  const salary = formatSalary(job)
  const loc = formatLocation(job)
  const exp = formatExperience(job)
  const posted = formatPostedAgo(job.posted_at)
  const deadline = formatDeadline(job.application_deadline)
  const compName = job.company?.name || 'Your company'
  const govMeta = job.government_meta || {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-1">
        <Link href="/recruiter/dashboard" className="hover:text-blue-700">Dashboard</Link>
        <span>›</span>
        <span className="text-slate-700">Job preview</span>
      </nav>

      {/* Status banner */}
      <div className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap ${badge.cls}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="text-sm font-semibold">{badge.label}</span>
          {job.status === 'pending_approval' && (
            <span className="text-xs opacity-75">— an admin will review and approve this before it goes public.</span>
          )}
          {job.status === 'rejected' && (
            <span className="text-xs opacity-75">— contact support if you believe this was an error.</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {job.status !== 'closed' && job.status !== 'rejected' && (
            <Link
              href={`/recruiter/edit-job/${job.id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/70 border border-current hover:bg-white transition"
            >
              Edit job
            </Link>
          )}
          <Link
            href="/recruiter/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/70 border border-current hover:bg-white transition"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Card preview (exactly what public users see) */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Card preview</h2>
        <JobCard job={job} variant="default" />
      </section>

      {/* Full details */}
      <section className="job-glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{compName}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.cls}`}>{badge.label}</span>
        </div>

        {/* Meta grid */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <MetaItem label="Type" value={jobTypeLabel(job.job_type)} />
          <MetaItem label="Mode" value={workModeLabel(job.work_mode)} />
          <MetaItem label="Location" value={loc || '—'} />
          <MetaItem label="Experience" value={exp || '—'} />
          <MetaItem label="Openings" value={job.openings ?? '—'} />
          {salary && <MetaItem label="Salary" value={salary} />}
          {posted && <MetaItem label="Posted" value={posted} />}
          {deadline && <MetaItem label="Deadline" value={deadline.text} />}
          {job.department && <MetaItem label="Department" value={job.department} />}
          {job.industry && <MetaItem label="Industry" value={job.industry} />}
        </dl>

        {/* Government meta */}
        {job.category === 'government' && (
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm space-y-1">
            <p className="font-semibold text-amber-800 mb-2">Government notification details</p>
            {govMeta.notification_url && <p>Notification: <a href={govMeta.notification_url} target="_blank" rel="noreferrer" className="text-blue-700 underline truncate">{govMeta.notification_url}</a></p>}
            {govMeta.department && <p>Department: {govMeta.department}</p>}
            {govMeta.vacancies && <p>Vacancies: {govMeta.vacancies}</p>}
            {govMeta.age_max && <p>Age limit: {govMeta.age_max}</p>}
            {govMeta.application_fee != null && <p>Application fee: ₹{govMeta.application_fee}</p>}
            {govMeta.exam_date && <p>Exam date: {new Date(govMeta.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>
        )}

        {/* Skills */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Description</p>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">{job.description}</div>
          </div>
        )}

        {/* Apply config */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-1">Apply mode: <span className="capitalize font-normal">{job.apply_mode}</span></p>
          {job.apply_mode === 'external' && job.apply_url && <p className="text-blue-700 truncate">{job.apply_url}</p>}
          {job.apply_mode === 'email' && job.apply_email && <p className="text-blue-700">{job.apply_email}</p>}
          {job.apply_mode === 'phone' && job.apply_phone && <p className="text-blue-700">{job.apply_phone}</p>}
          {job.apply_mode === 'internal' && <p className="text-slate-500">Candidates apply through MyTechZ.</p>}
        </div>
      </section>
    </div>
  )
}

function MetaItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  )
}
