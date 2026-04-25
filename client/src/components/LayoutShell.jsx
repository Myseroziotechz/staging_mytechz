'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DashboardSidebar from '@/components/DashboardSidebar'

// Routes where navbar + footer + sidebar are all hidden.
const BARE_ROUTES = ['/login']

export default function LayoutShell({ children }) {
  const pathname = usePathname()
  const isBare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + '/')
  )

  if (isBare) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <Navbar />
      <DashboardSidebar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </>
  )
}
