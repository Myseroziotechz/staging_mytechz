'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Clarity from '@microsoft/clarity'

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

export default function ClarityInit() {
  const pathname = usePathname()

  useEffect(() => {
    if (!PROJECT_ID) return
    Clarity.init(PROJECT_ID)
  }, [])

  // Track SPA page navigation so session recordings show the correct page
  useEffect(() => {
    if (!PROJECT_ID) return
    Clarity.setTag('page', pathname)
  }, [pathname])

  return null
}
