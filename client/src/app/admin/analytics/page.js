'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const JobsTrendChart = dynamic(() => import('@/components/admin/JobsTrendChart'), { ssr: false })
const ApplicationsTrendChart = dynamic(() => import('@/components/admin/ApplicationsTrendChart'), { ssr: false })
const CategoryPieChart = dynamic(() => import('@/components/admin/CategoryPieChart'), { ssr: false })
const StatusPieChart = dynamic(() => import('@/components/admin/StatusPieChart'), { ssr: false })

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState(null)
  const [jobsTrend, setJobsTrend] = useState(null)
  const [appsTrend, setAppsTrend] = useState(null)
  const [categoryDist, setCategoryDist] = useState(null)
  const [appStatus, setAppStatus] = useState(null)
  const [topJobs, setTopJobs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const types = ['overview', 'jobs-trend', 'applications-trend', 'category-distribution', 'application-status', 'top-jobs']
        const results = await Promise.all(
          types.map((type) =>
            fetch(`/api/admin/analytics?type=${type}`).then((r) => {
              if (!r.ok) throw new Error(`Failed: ${type}`)
              return r.json()
            })
          )
        )
        setOverview(results[0])
        setJobsTrend(results[1])
        setAppsTrend(results[2])
        setCategoryDist(results[3])
        setAppStatus(results[4])
        setTopJobs(results[5])
      } catch (err) {
        setError(err.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">Admin Panel</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Platform metrics and trends.</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          ← Dashboard
        </Link>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="ml-3 text-sm text-gray-500">Loading analytics...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && overview && (
        <>
          {/* KPI Cards */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Total Users" value={overview.totalUsers} tone="blue" />
            <KpiCard label="Active Jobs" value={overview.activeJobs} tone="emerald" />
            <KpiCard label="Total Applications" value={overview.totalApplications} tone="purple" />
            <KpiCard label="Resumes Analyzed" value={overview.resumesAnalyzed} tone="amber" />
          </section>
          <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard label="New Users (30d)" value={overview.monthUsers} tone="blue" />
            <KpiCard label="Apps This Week" value={overview.weekApplications} tone="purple" />
            <KpiCard label="Total Jobs" value={overview.totalJobs} tone="emerald" />
          </section>

          {/* Charts Row 1: Trends */}
          <div className="grid sm:grid-cols-2 gap-4">
            {jobsTrend && <JobsTrendChart data={jobsTrend.weeks} />}
            {appsTrend && <ApplicationsTrendChart data={appsTrend.weeks} />}
          </div>

          {/* Charts Row 2: Distributions */}
          <div className="grid sm:grid-cols-2 gap-4">
            {categoryDist && <CategoryPieChart data={categoryDist.distribution} />}
            {appStatus && <StatusPieChart data={appStatus.breakdown} />}
          </div>

          {/* Top Jobs Table */}
          {topJobs?.jobs?.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Top Performing Jobs</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Sorted by application count</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Title</th>
                      <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Category</th>
                      <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase text-right">Views</th>
                      <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase text-right">Applications</th>
                      <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topJobs.jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">{job.title}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${CATEGORY_BADGE[job.category] || 'bg-gray-100 text-gray-600'}`}>
                            {job.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-gray-600">{(job.views_count || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 text-right tabular-nums font-semibold text-gray-900">{(job.applications_count || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{job.posted_at ? new Date(job.posted_at).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────────

const KPI_TONE = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
}

function KpiCard({ label, value, tone = 'blue' }) {
  return (
    <div className={`rounded-2xl border p-4 ${KPI_TONE[tone]}`}>
      <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-bold">{(value ?? 0).toLocaleString()}</p>
    </div>
  )
}

const CATEGORY_BADGE = {
  private: 'bg-blue-100 text-blue-700',
  government: 'bg-amber-100 text-amber-700',
  internship: 'bg-emerald-100 text-emerald-700',
  ai: 'bg-purple-100 text-purple-700',
}
