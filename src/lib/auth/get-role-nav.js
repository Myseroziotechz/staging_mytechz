import { APP_NAV, RECRUITER_NAV, ADMIN_NAV } from '@/config/navigation'

/**
 * Returns the correct sidebar nav config and home href for a given role.
 * Used by (app)/layout.js, (smart)/layout.js, admin/layout.js, recruiter/layout.js.
 */
export function getNavForRole(role) {
  if (role === 'admin') {
    return { nav: ADMIN_NAV, homeHref: '/admin/dashboard' }
  }
  if (role === 'recruiter') {
    return { nav: RECRUITER_NAV, homeHref: '/recruiter/dashboard' }
  }
  return { nav: APP_NAV, homeHref: '/dashboard' }
}
