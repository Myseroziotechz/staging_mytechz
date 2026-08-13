'use client'

import { useState, useEffect } from 'react'
import { companyInitials } from '@/lib/jobs/format'

const SIZE_CLASSES = {
  chat: 'w-9 h-9 rounded-lg text-xs',
  mini: 'w-9 h-9 rounded-xl text-sm',
  compact: 'w-11 h-11 rounded-xl text-base',
  default: 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-lg',
  detail: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-xl',
}

/**
 * The one company-logo fallback used everywhere a logo renders: the real
 * logo when it has a URL and loads successfully, otherwise a gradient
 * avatar with the company's initial(s) — never a broken-image icon.
 * Extracted from the pattern already used by JobCard.jsx (Private Jobs and
 * every other job-card surface), so this is the same design everywhere,
 * not a new one.
 */
export default function CompanyLogo({ logoUrl, name, size = 'default', className = '' }) {
  const [errored, setErrored] = useState(false)

  // Reset the error flag if the logo URL itself changes (e.g. a recycled
  // card in a virtualized/paginated list) instead of getting stuck showing
  // the fallback for a different, possibly-valid, logo.
  useEffect(() => {
    setErrored(false)
  }, [logoUrl])

  const showImage = Boolean(logoUrl) && !errored
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default

  return (
    <div
      className={[
        'shrink-0 overflow-hidden flex items-center justify-center font-bold',
        sizeClass,
        showImage
          ? 'bg-white ring-1 ring-slate-200/80'
          : 'bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700 ring-1 ring-white/60',
        className,
      ].join(' ')}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name || 'Company'}
          className="w-full h-full object-contain p-1.5"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden="true">{companyInitials(name)}</span>
      )}
    </div>
  )
}
