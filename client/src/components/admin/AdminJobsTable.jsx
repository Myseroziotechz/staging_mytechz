'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  adminUpdateJobStatusAction,
  adminToggleFeatureAction,
  adminDeleteJobAction,
} from '@/app/admin/jobs/actions'
import ExportMenu from '@/components/common/ExportMenu'

const STATUS_TONE = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  draft: 'bg-blue-50 text-blue-700 border-blue-200',
}

const CATEGORY_TONE = {
  private: 'bg-blue-50 text-blue-700',
  government: 'bg-amber-50 text-amber-700',
  internship: 'bg-emerald-50 text-emerald-700',
  ai: 'bg-purple-50 text-purple-700',
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

const FILTER_DEFS = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: '', label: 'Any' },
      { value: 'pending_approval', label: 'Pending review' },
      { value: 'active', label: 'Active' },
      { value: 'closed', label: 'Closed' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    options: [
      { value: '', label: 'Any' },
      { value: 'private', label: 'Private' },
      { value: 'government', label: 'Government' },
      { value: 'internship', label: 'Internship' },
      { value: 'ai', label: 'AI pick' },
    ],
  },
]

export default function AdminJobsTable({ jobs }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const sp = useSearchParams()

  function setFilter(key, value) {
    const next = new URLSearchParams(sp.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`/admin/jobs?${next.toString()}`)
  }

  function setQuery(value) {
    const next = new URLSearchParams(sp.toString())
    if (value) next.set('q', value)
    else next.delete('q')
    router.replace(`/admin/jobs?${next.toString()}`)
  }

  function dispatch(fn) {
    startTransition(async () => {
      const res = await fn()
      if (!res?.ok) alert(res?.error || 'Failed')
      else router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Search title
          </label>
          <input
            type="text"
            defaultValue={sp.get('q') || ''}
            onBlur={(e) => setQuery(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setQuery(e.target.value.trim())
            }}
            placeholder="React developer…"
            className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
          />
        </div>
        {FILTER_DEFS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {f.label}
            </label>
            <select
              value={sp.get(f.key) || ''}
              onChange={(e) => setFilter(f.key, e.target.value)}
              className="text-sm rounded-lg border border-slate-200 px-3 py-2 bg-white"
            >
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={() => router.replace('/admin/jobs')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
        >
          Reset
        </button>
        <div className="ml-auto">
          <ExportMenu scope="jobs" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Posted</th>
                <th className="px-4 py-3 font-semibold text-right">Apps</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No jobs match these filters.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/jobs/${job.category}/${job.slug}`}
                        target="_blank"
                        className="font-semibold text-slate-900 hover:text-blue-700 line-clamp-1"
                      >
                        {job.title}
                        {job.is_featured && (
                          <span className="ml-2 text-[10px] font-bold text-amber-700">
                            ★ Featured
                          </span>
                        )}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">
                        {job.company?.name || '—'}
                        {job.location_city ? ` · ${job.location_city}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_TONE[job.category] || 'bg-slate-100 text-slate-600'}`}
                      >
                        {job.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_TONE[job.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                      >
                        {(job.status || '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {fmtDate(job.posted_at)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 font-medium">
                      {job.applications_count ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status === 'pending_approval' && (
                          <>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                dispatch(() =>
                                  adminUpdateJobStatusAction({
                                    jobId: job.id,
                                    status: 'active',
                                  })
                                )
                              }
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                dispatch(() =>
                                  adminUpdateJobStatusAction({
                                    jobId: job.id,
                                    status: 'rejected',
                                  })
                                )
                              }
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {job.status === 'active' && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              dispatch(() =>
                                adminToggleFeatureAction({
                                  jobId: job.id,
                                  isFeatured: !job.is_featured,
                                })
                              )
                            }
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border disabled:opacity-50 ${
                              job.is_featured
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {job.is_featured ? '★ Featured' : '☆ Feature'}
                          </button>
                        )}
                        {job.status !== 'closed' && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => {
                              if (!confirm('Close this job?')) return
                              dispatch(() =>
                                adminDeleteJobAction({ jobId: job.id })
                              )
                            }}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {jobs.length > 0 && (
          <div className="px-4 py-2 text-[11px] text-slate-400 text-right border-t border-slate-100">
            Showing {jobs.length} jobs (max 200)
          </div>
        )}
      </div>
    </div>
  )
}
