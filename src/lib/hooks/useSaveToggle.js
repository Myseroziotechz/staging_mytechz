'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toggleSavedJob } from '@/app/(app)/saved-jobs/actions'

// Shared save/unsave logic for the bookmark button on job cards and the job
// detail page — one place for the optimistic flip, the auth redirect, and
// the duplicate-safe server round trip, so neither caller reimplements it.
export function useSaveToggle({ jobUrl, jobTitle, companyName, initialSaved = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const [saved, setSaved] = useState(initialSaved)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState(null)

  // A card can re-render with a different `initialSaved` (e.g. filters
  // change the job list, or a revalidated server fetch updates it) — keep
  // local state in sync when that happens without a user click involved.
  useEffect(() => setSaved(initialSaved), [initialSaved])

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(t)
  }, [error])

  const toggle = () => {
    if (pending) return
    setError(null)
    const next = !saved
    setSaved(next) // optimistic — reflects instantly per the UX requirement
    startTransition(async () => {
      const fd = new FormData()
      fd.set('jobUrl', jobUrl)
      fd.set('jobTitle', jobTitle)
      if (companyName) fd.set('companyName', companyName)

      const result = await toggleSavedJob(null, fd)

      if (result?.requiresAuth) {
        setSaved(!next)
        router.push(`/login?returnTo=${encodeURIComponent(pathname)}`)
        return
      }
      if (result?.error) {
        setSaved(!next)
        setError(result.error)
        return
      }
      if (typeof result?.saved === 'boolean') setSaved(result.saved)
    })
  }

  return { saved, pending, error, toggle }
}
