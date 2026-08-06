'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'
import { Alert } from '@/app/(app)/profile/components/shared/Feedback'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default function DataPrivacySection() {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    setDownloadError(null)
    try {
      const res = await fetch('/api/settings/export-data')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Could not prepare your data export.')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'mytechz-data-export.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setDownloadError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <SectionCard title="Data & Privacy" icon={ICON} canEdit={false}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-700 mb-1">Download your data</p>
          <p className="text-xs text-gray-500 mb-3">
            Get a copy of your profile, settings, and resume metadata as a JSON file.
          </p>
          {downloadError && <Alert tone="error" className="mb-3">{downloadError}</Alert>}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {downloading ? 'Preparing…' : 'Download my data'}
          </button>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-1">How we use your data</p>
          <p className="text-xs text-gray-500 mb-4">
            Your profile and resume data are used to match you with relevant jobs and to let recruiters
            evaluate your application. We never sell your data to third parties. See our Privacy Policy for details.
          </p>

          <p className="text-sm font-medium text-red-700 mb-1">Delete account</p>
          <p className="text-xs text-gray-500 mb-3">
            Permanently deletes your account, profile, settings, and resumes. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Delete my account
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteAccountDialog onClose={() => setShowDeleteDialog(false)} router={router} />
      )}
    </SectionCard>
  )
}

function DeleteAccountDialog({ onClose, router }) {
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const canDelete = confirmText === 'DELETE'

  async function handleDelete() {
    if (!canDelete) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/settings/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: confirmText }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Could not delete your account.')

      await fetch('/auth/sign-out', { method: 'POST', redirect: 'manual' })
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-base font-bold text-gray-900">Delete your account?</h3>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete your account, profile, settings, and all saved resumes.
          This action <strong>cannot be undone</strong>.
        </p>

        {error && <Alert tone="error" className="mt-4">{error}</Alert>}

        <label className="block mt-4 text-xs font-medium text-gray-700">
          Type <span className="font-mono font-bold">DELETE</span> to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={deleting}
          className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
          autoFocus
        />

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {deleting ? 'Deleting…' : 'Permanently delete my account'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
