// ─────────────────────────────────────────────────────────────────────────────
// Sidebar navigation trees for after-login pages.
// `icon`        — key resolved in AppSidebar.jsx via inline SVG map.
// `defaultOpen` — section starts expanded on first render (regardless of active state).
// `position`    — 'bottom' items are pinned to the sidebar bottom zone.
// ─────────────────────────────────────────────────────────────────────────────

// Job seeker / candidate nav
export const APP_NAV = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Jobs',
    icon: 'briefcase',
    defaultOpen: true,
    children: [
      { label: 'Browse Jobs',     href: '/jobs',             icon: 'list' },
      { label: 'Private Jobs',    href: '/jobs/private',     icon: 'building' },
      { label: 'Govt Jobs',       href: '/jobs/government',  icon: 'shield' },
      { label: 'Internships',     href: '/jobs/internship',  icon: 'academic' },
      { label: 'AI-Matched',      href: '/jobs/ai',          icon: 'sparkles' },
      { label: 'My Applications', href: '/my-applications',  icon: 'document' },
      { label: 'Saved Jobs',      href: '/saved-jobs',       icon: 'bookmark' },
    ],
  },
  {
    label: 'Job Tools',
    icon: 'sparkles',
    defaultOpen: true,
    children: [
      { label: 'Resume Builder',      href: '/ai-tools/resume-builder/templates', icon: 'document' },
      { label: 'My Resumes',          href: '/ai-tools/resume-builder/my-resumes', icon: 'document' },
      { label: 'Cover Letter Builder', href: '/ai-tools/cover-letter-builder/templates', icon: 'document' },
      { label: 'My Cover Letters',    href: '/ai-tools/cover-letter-builder/my-letters', icon: 'document' },
      { label: 'Resume Rank Checker', href: '/ai-tools/resume-rank-checker/check', icon: 'search' },
      { label: 'Smart Job Search',    href: '/ai-tools/smart-job-search',    icon: 'list' },
    ],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'user',
  },
  // Bottom-pinned items
  {
    label: 'Contact',
    href: '/contact',
    icon: 'contact',
    position: 'bottom',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
    position: 'bottom',
  },
]

// Recruiter nav
export const RECRUITER_NAV = [
  { label: 'Home',            href: '/recruiter/dashboard',  icon: 'dashboard' },
  { label: 'Post a Job',      href: '/recruiter/post-job',   icon: 'document' },
  { label: 'Applicants',      href: '/recruiter/applicants', icon: 'users' },
  { label: 'My Profile',      href: '/recruiter/profile',    icon: 'user' },
  { label: 'Company Profile', href: '/recruiter/onboarding', icon: 'building' },
  // Bottom-pinned
  { label: 'Contact',  href: '/contact',  icon: 'contact',  position: 'bottom' },
  { label: 'Settings', href: '/settings', icon: 'settings', position: 'bottom' },
]

// Admin nav
export const ADMIN_NAV = [
  { label: 'Home',         href: '/admin/dashboard',  icon: 'dashboard' },
  { label: 'Post a Card',  href: '/admin/post-job',   icon: 'document' },
  { label: 'Jobs',         href: '/admin/jobs',       icon: 'briefcase' },
  { label: 'Admin Emails', href: '/admin/whitelist',  icon: 'mail' },
  { label: 'Users',        href: '/admin/users',      icon: 'users' },
  { label: 'Recruiters',   href: '/admin/recruiters', icon: 'building' },
  // Bottom-pinned
  { label: 'Contact',  href: '/contact',  icon: 'contact',  position: 'bottom' },
  { label: 'Settings', href: '/settings', icon: 'settings', position: 'bottom' },
]
