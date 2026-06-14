// ─────────────────────────────────────────────────────────────────────────────
// Sidebar navigation trees for after-login pages.
// `icon` keys are resolved in AppSidebar.jsx using inline SVGs.
// ─────────────────────────────────────────────────────────────────────────────

// Job seeker nav
export const APP_NAV = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Jobs',
    icon: 'briefcase',
    children: [
      { label: 'Browse Jobs',      href: '/jobs',              icon: 'list' },
      { label: 'Private Jobs',     href: '/jobs/private',      icon: 'building' },
      { label: 'Govt Jobs',        href: '/jobs/government',   icon: 'shield' },
      { label: 'Internships',      href: '/jobs/internship',   icon: 'academic' },
      { label: 'AI-Matched',       href: '/jobs/ai',           icon: 'sparkles' },
      { label: 'My Applications',  href: '/my-applications',   icon: 'document' },
      { label: 'Saved Jobs',       href: '/saved-jobs',        icon: 'bookmark' },
    ],
  },
  {
    label: 'AI Tools',
    icon: 'sparkles',
    children: [
      { label: 'Smart Job Search', href: '/ai-tools/smart-job-search', icon: 'search' },
    ],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'user',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
  },
]

// Recruiter nav
export const RECRUITER_NAV = [
  { label: 'Dashboard',       href: '/recruiter/dashboard',   icon: 'dashboard' },
  { label: 'Post a Job',      href: '/recruiter/post-job',    icon: 'document' },
  { label: 'Applicants',      href: '/recruiter/applicants',  icon: 'users' },
  { label: 'Company Profile', href: '/recruiter/onboarding',  icon: 'building' },
  { label: 'Settings',        href: '/settings',              icon: 'settings' },
]

// Admin nav
export const ADMIN_NAV = [
  { label: 'Dashboard',    href: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Post a Card',  href: '/admin/post-job',  icon: 'document' },
  { label: 'Jobs',         href: '/admin/jobs',      icon: 'briefcase' },
  { label: 'Admin Emails', href: '/admin/whitelist', icon: 'mail' },
  { label: 'Users',        href: '/admin/users',     icon: 'users' },
  { label: 'Settings',     href: '/settings',        icon: 'settings' },
]
