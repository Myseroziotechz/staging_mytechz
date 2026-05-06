'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  updateApplicationStatusAction,
  updateApplicationNotesAction,
  updateApplicationRatingAction,
} from '@/app/recruiter/applicants/actions'
import ExportMenu from '@/components/common/ExportMenu'

const STAGES = [
  { key: 'applied', label: 'Applied', tone: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'reviewing', label: 'Reviewing', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'interview', label: 'Interview', tone: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'offered', label: 'Offered', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'hired', label: 'Hired', tone: 'bg-green-100 text-green-800 border-green-300' },
  { key: 'rejected', label: 'Rejected', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
]

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || '–'
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d <= 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

function StarRow({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star`}
          className={`p-0.5 transition ${
            n <= (value || 0) ? 'text-amber-400' : 'text-slate-300'
          } hover:text-amber-500 disabled:opacity-50`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.95 6.95L22 10l-5.5 5.05L18 22 12 18.5 6 22l1.5-6.95L2 10l7.05-1.05L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

function ApplicantCard({ applicant, onOpen }) {
  const name = applicant.candidate?.full_name || applicant.candidate?.email || 'Anonymous'
  return (
    <button
      type="button"
      onClick={() => onOpen(applicant)}
      className="w-full text-left bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition"
    >
      <div className="flex items-start gap-2">
        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold flex items-center justify-center">
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-[11px] text-slate-500 truncate">
            {applicant.job?.title || applicant.job_title || 'Job'}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <StarRow value={applicant.rating} disabled />
        <span>{fmtDate(applicant.applied_at)}</span>
      </div>
    </button>
  )
}

function ApplicantDrawer({ applicant, onClose, onUpdated }) {
  const [pending, startTransition] = useTransition()
  const [notes, setNotes] = useState(applicant?.recruiter_notes || '')
  const [rating, setRating] = useState(applicant?.rating || 0)
  const [status, setStatus] = useState(applicant?.status || 'applied')
  const [savedHint, setSavedHint] = useState(null)

  if (!applicant) return null
  const name =
    applicant.candidate?.full_name || applicant.candidate?.email || 'Anonymous'
  const email = applicant.candidate?.email
  const phone = applicant.candidate?.phone
  const jobTitle = applicant.job?.title || applicant.job_title

  function flash(text) {
    setSavedHint(text)
    setTimeout(() => setSavedHint(null), 1500)
  }

  function handleStatus(next) {
    setStatus(next)
    startTransition(async () => {
      const res = await updateApplicationStatusAction({
        applicationId: applicant.id,
        status: next,
      })
      if (res.ok) {
        flash('Status updated')
        onUpdated?.({ ...applicant, status: next, last_status_at: new Date().toISOString() })
      } else flash(res.error || 'Failed')
    })
  }

  function handleSaveNotes() {
    startTransition(async () => {
      const res = await updateApplicationNotesAction({
        applicationId: applicant.id,
        notes,
      })
      if (res.ok) {
        flash('Notes saved')
        onUpdated?.({ ...applicant, recruiter_notes: notes })
      } else flash(res.error || 'Failed')
    })
  }

  function handleRate(n) {
    setRating(n)
    startTransition(async () => {
      const res = await updateApplicationRatingAction({
        applicationId: applicant.id,
        rating: n,
      })
      if (res.ok) {
        flash('Rated')
        onUpdated?.({ ...applicant, rating: n })
      } else flash(res.error || 'Failed')
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        role="dialog"
        aria-label="Applicant details"
      >
        <header className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-bold flex items-center justify-center">
              {initials(name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
              <p className="text-[11px] text-slate-500 truncate">For {jobTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Contact */}
          <section className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</h3>
            {email && (
              <a href={`mailto:${email}`} className="block text-sm text-blue-700 hover:underline truncate">
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="block text-sm text-slate-700">
                {phone}
              </a>
            )}
            {!email && !phone && (
              <p className="text-sm text-slate-400 italic">Not shared</p>
            )}
          </section>

          {/* Status */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {STAGES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleStatus(s.key)}
                  disabled={pending}
                  className={`text-[11px] font-semibold px-2 py-1.5 rounded-lg border transition ${
                    status === s.key ? s.tone : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  } disabled:opacity-50`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Rating */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</h3>
            <StarRow value={rating} onChange={handleRate} disabled={pending} />
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Private notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview impressions, follow-ups, red flags…"
              rows={5}
              maxLength={2000}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{notes.length}/2000</span>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={pending || notes === (applicant.recruiter_notes || '')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                Save notes
              </button>
            </div>
          </section>

          {/* Meta */}
          <section className="text-[11px] text-slate-400 space-y-0.5 pt-2 border-t border-slate-100">
            <p>Applied {fmtDate(applicant.applied_at)}</p>
            {applicant.last_status_at && (
              <p>Status changed {fmtDate(applicant.last_status_at)}</p>
            )}
            {applicant.job_url && (
              <a
                href={applicant.job_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline"
              >
                Original job link
              </a>
            )}
          </section>
        </div>

        {savedHint && (
          <div className="border-t bg-emerald-50 px-5 py-2 text-xs text-emerald-700">
            {savedHint}
          </div>
        )}
      </aside>
    </>
  )
}

export default function ApplicantPipeline({ applicants: initial, jobs }) {
  const [applicants, setApplicants] = useState(initial)
  const [jobFilter, setJobFilter] = useState('')
  const [openId, setOpenId] = useState(null)

  const filtered = useMemo(() => {
    if (!jobFilter) return applicants
    return applicants.filter((a) => a.job_id === jobFilter)
  }, [applicants, jobFilter])

  const grouped = useMemo(() => {
    const out = {}
    for (const s of STAGES) out[s.key] = []
    for (const a of filtered) {
      const key = STAGES.some((s) => s.key === a.status) ? a.status : 'applied'
      out[key].push(a)
    }
    return out
  }, [filtered])

  const open = applicants.find((a) => a.id === openId) || null

  function handleUpdated(updated) {
    setApplicants((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
    )
  }

  if (applicants.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" d="M3 7h18M3 12h18M3 17h12" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No applicants yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Once candidates apply to your jobs, they&apos;ll appear here in a pipeline. Tip:
          internal-apply jobs collect richer applicant data.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Filter + export bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {jobs.length > 1 && (
          <>
            <label className="text-xs text-slate-500">Filter by job:</label>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="text-sm rounded-lg border border-slate-200 px-3 py-1.5 bg-white"
            >
              <option value="">All jobs ({applicants.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </>
        )}
        <div className="ml-auto">
          <ExportMenu
            scope="my-applicants"
            extraParams={jobFilter ? { job_id: jobFilter } : undefined}
          />
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((s) => (
          <div key={s.key} className="bg-slate-50 rounded-xl p-3 min-h-[200px]">
            <header className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.tone}`}>
                {s.label}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {grouped[s.key].length}
              </span>
            </header>
            <div className="space-y-2">
              {grouped[s.key].map((a) => (
                <ApplicantCard key={a.id} applicant={a} onOpen={(x) => setOpenId(x.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ApplicantDrawer
        applicant={open}
        onClose={() => setOpenId(null)}
        onUpdated={handleUpdated}
      />
    </>
  )
}
