'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ResumeCard({ resume, onDelete, onDuplicate }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const templateName = resume.resume_templates?.name || 'Custom'
  const updatedAt = new Date(resume.updated_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-slate-900 mb-1">{resume.title}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">{templateName}</span>
            <span>Last edited {updatedAt}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          resume.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {resume.status === 'completed' ? 'Completed' : 'Draft'}
        </span>
      </div>

      {resume.last_exported_at && (
        <p className="text-xs text-slate-400 mb-3">
          Last exported as {resume.last_export_format?.toUpperCase()} on{' '}
          {new Date(resume.last_exported_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Link
          href={`/ai-tools/resume-builder/editor/${resume.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Edit
        </Link>

        <button
          onClick={() => onDuplicate(resume.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5A1.125 1.125 0 014 20.625V7.125C4 6.504 4.504 6 5.125 6H8.25m7.5 0v3.375c0 .621.504 1.125 1.125 1.125H20.25M15.75 6V3.375c0-.621-.504-1.125-1.125-1.125h-5.25" />
          </svg>
          Duplicate
        </button>

        {showConfirm ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-red-600">Delete?</span>
            <button onClick={() => { onDelete(resume.id); setShowConfirm(false) }} className="text-xs font-medium text-red-600 hover:text-red-700">Yes</button>
            <button onClick={() => setShowConfirm(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700">No</button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
