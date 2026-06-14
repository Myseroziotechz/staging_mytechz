'use client'

import { useState } from 'react'
import AppNavbar from './AppNavbar'
import AppSidebar from './AppSidebar'

export default function AppShell({ user, navItems, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <AppNavbar user={user} onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AppSidebar
          navItems={navItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-60 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
