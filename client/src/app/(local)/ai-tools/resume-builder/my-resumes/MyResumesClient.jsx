'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserResumes, deleteResume, duplicateResume } from '@/lib/resume/queries'

export default function MyResumesClient() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserResumes().then((r) => { setResumes(r); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this resume?')) return
    await deleteResume(id)
    setResumes((r) => r.filter((x) => x.id !== id))
  }

  async function handleDuplicate(id) {
    const dup = await duplicateResume(id)
    setResumes((r) => [dup, ...r])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your saved resumes</p>
          </div>
          <Link
            href="/ai-tools/resume-builder/templates"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Resume
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No resumes yet</h2>
            <p className="text-sm text-slate-500 mb-6">Create your first resume to get started.</p>
            <Link
              href="/ai-tools/resume-builder/templates"
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <div key={r.id} className="bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{r.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Template: <span className="capitalize">{r.template_slug}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    r.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-4">
                  Updated {new Date(r.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                <div className="flex gap-2">
                  <Link
                    href={`/ai-tools/resume-builder/editor?template=${r.template_slug}&resumeId=${r.id}`}
                    className="flex-1 text-center py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicate(r.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
