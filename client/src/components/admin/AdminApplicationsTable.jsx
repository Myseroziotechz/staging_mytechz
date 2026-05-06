'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ExportMenu from '@/components/common/ExportMenu'

const STATUS_TONE = {
  applied: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewing: 'bg-amber-50 text-amber-700 border-amber-200',
  interview: 'bg-purple-50 text-purple-700 border-purple-200',
  offered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  hired: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || '–'
  )
}

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'applied', label: 'Applied' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminApplicationsTable({ applications }) {
  const router = useRouter()
  const sp = useSearchParams()

  function setFilter(key, value) {
    const next = new URLSearchParams(sp.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`/admin/applications?${next.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Status
          </label>
          <select
            value={sp.get('status') || ''}
            onChange={(e) => setFilter('status', e.target.value)}
            className="text-sm rounded-lg border border-slate-200 px-3 py-2 bg-white"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            From
          </label>
          <input
            type="date"
            defaultValue={sp.get('date_from') || ''}
            onBlur={(e) => setFilter('date_from', e.target.value)}
            className="text-sm rounded-lg border border-slate-200 px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            To
          </label>
          <input
            type="date"
            defaultValue={sp.get('date_to') || ''}
            onBlur={(e) => setFilter('date_to', e.target.value)}
            className="text-sm rounded-lg border border-slate-200 px-3 py-2 bg-white"
          />
        </div>
        <button
          type="button"
          onClick={() => router.replace('/admin/applications')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
        >
          Reset
        </button>
        <span className="ml-auto text-xs text-slate-500">
          {applications.length} result{applications.length === 1 ? '' : 's'}
        </span>
        <ExportMenu scope="applications" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Candidate</th>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Applied</th>
                <th className="px-4 py-3 font-semibold">Last update</th>
                <th className="px-4 py-3 font-semibold text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No applications match these filters.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const cand = app.candidate || {}
                  const candName = cand.full_name || cand.email || 'Anonymous'
                  return (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {initials(candName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {candName}
                            </p>
                            {cand.email && (
                              <p className="text-xs text-slate-500 truncate">
                                {cand.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        {app.job?.slug && app.job?.category ? (
                          <Link
                            href={`/jobs/${app.job.category}/${app.job.slug}`}
                            target="_blank"
                            className="text-sm text-blue-700 hover:underline line-clamp-1"
                          >
                            {app.job?.title || app.job_title}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-700 line-clamp-1">
                            {app.job_title || '—'}
                          </span>
                        )}
                        <p className="text-xs text-slate-500 truncate">
                          {app.company_name || ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_TONE[app.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {app.status || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {fmtDate(app.applied_at)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {fmtDate(app.last_status_at)}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-500">
                        {app.rating
                          ? '★'.repeat(app.rating) + '☆'.repeat(5 - app.rating)
                          : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
