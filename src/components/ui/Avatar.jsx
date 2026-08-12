'use client'

import { useEffect, useState } from 'react'

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  nav: 'w-9 h-9 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
}

function initials(name) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Shared account-avatar: shows the image if one resolves, otherwise a
 * gradient initials circle. `src` failures (broken/expired URL) fall back
 * to initials automatically. Resets its own error state when `src` changes
 * so a fixed broken URL doesn't get stuck showing initials forever.
 */
export default function Avatar({ src, name, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [src])

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md
  const showImage = src && !imgError

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 text-white font-semibold ${sizeClass} ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- external/user-uploaded URLs (Google + Supabase Storage), not a static local asset next/image can optimize without extra remote-pattern config for every avatar host.
        <img
          src={src}
          alt={name || 'User avatar'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials(name) || 'U'}</span>
      )}
    </span>
  )
}
