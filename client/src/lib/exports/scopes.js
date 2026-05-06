import 'server-only'
import { getAllJobsForAdmin, getAllApplicationsForAdmin } from '@/lib/admin/queries'
import { getRecruiterApplicants } from '@/lib/applicants/queries'
import { createClient } from '@/lib/supabase-server'

const HARD_CAP = 10_000

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Each scope: { allow(role), fetch({ user, sp }), columns, title }
export const SCOPES = {
  // Admin: all jobs.
  jobs: {
    allow: (role) => role === 'admin',
    title: 'Jobs',
    async fetch({ sp }) {
      const { jobs } = await getAllJobsForAdmin({
        status: sp.get('status') || null,
        category: sp.get('category') || null,
        q: sp.get('q') || null,
        date_from: sp.get('date_from') || null,
        date_to: sp.get('date_to') || null,
      })
      return jobs.slice(0, HARD_CAP)
    },
    columns: [
      { key: 'title', label: 'Title', width: 3 },
      { key: 'company', label: 'Company', width: 2, get: (j) => j.company?.name || '—' },
      { key: 'category', label: 'Category', width: 1.2 },
      { key: 'job_type', label: 'Type', width: 1.2 },
      { key: 'work_mode', label: 'Mode', width: 1 },
      { key: 'location_city', label: 'City', width: 1.5 },
      { key: 'status', label: 'Status', width: 1.2 },
      { key: 'posted_at', label: 'Posted', width: 1.2, get: (j) => fmtDate(j.posted_at) },
      { key: 'applications_count', label: 'Apps', width: 0.8 },
    ],
  },

  // Admin: all applications across the platform.
  applications: {
    allow: (role) => role === 'admin',
    title: 'Applications',
    async fetch({ sp }) {
      const { applications } = await getAllApplicationsForAdmin({
        status: sp.get('status') || null,
        job_id: sp.get('job_id') || null,
        date_from: sp.get('date_from') || null,
        date_to: sp.get('date_to') || null,
      })
      return applications.slice(0, HARD_CAP)
    },
    columns: [
      {
        key: 'candidate',
        label: 'Candidate',
        width: 2,
        get: (a) => a.candidate?.full_name || a.candidate?.email || 'Anonymous',
      },
      { key: 'email', label: 'Email', width: 2.4, get: (a) => a.candidate?.email || '' },
      { key: 'phone', label: 'Phone', width: 1.5, get: (a) => a.candidate?.phone || '' },
      { key: 'job_title', label: 'Job', width: 2.5, get: (a) => a.job?.title || a.job_title || '—' },
      { key: 'company_name', label: 'Company', width: 1.6 },
      { key: 'status', label: 'Status', width: 1 },
      { key: 'rating', label: 'Rating', width: 0.8 },
      { key: 'applied_at', label: 'Applied', width: 1.2, get: (a) => fmtDate(a.applied_at) },
      {
        key: 'last_status_at',
        label: 'Updated',
        width: 1.2,
        get: (a) => fmtDate(a.last_status_at),
      },
    ],
  },

  // Recruiter: only their own applicants.
  'my-applicants': {
    allow: (role) => role === 'recruiter' || role === 'admin',
    title: 'My Applicants',
    async fetch({ user, sp }) {
      const { applicants } = await getRecruiterApplicants(user.id, {
        jobId: sp.get('job_id') || null,
      })
      return applicants.slice(0, HARD_CAP)
    },
    columns: [
      {
        key: 'candidate',
        label: 'Candidate',
        width: 2,
        get: (a) => a.candidate?.full_name || a.candidate?.email || 'Anonymous',
      },
      { key: 'email', label: 'Email', width: 2.4, get: (a) => a.candidate?.email || '' },
      { key: 'phone', label: 'Phone', width: 1.5, get: (a) => a.candidate?.phone || '' },
      { key: 'job_title', label: 'Job', width: 2.5, get: (a) => a.job?.title || a.job_title || '—' },
      { key: 'status', label: 'Status', width: 1 },
      { key: 'rating', label: 'Rating', width: 0.8 },
      { key: 'applied_at', label: 'Applied', width: 1.2, get: (a) => fmtDate(a.applied_at) },
      {
        key: 'last_status_at',
        label: 'Updated',
        width: 1.2,
        get: (a) => fmtDate(a.last_status_at),
      },
      { key: 'recruiter_notes', label: 'Notes', width: 2.5 },
    ],
  },

  // Admin: all users.
  users: {
    allow: (role) => role === 'admin',
    title: 'Users',
    async fetch() {
      const supabase = await createClient()
      const { data } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, phone, role, is_active, created_at, last_login_at')
        .order('created_at', { ascending: false })
        .limit(HARD_CAP)
      return data || []
    },
    columns: [
      { key: 'full_name', label: 'Name', width: 2 },
      { key: 'email', label: 'Email', width: 2.5 },
      { key: 'phone', label: 'Phone', width: 1.5 },
      { key: 'role', label: 'Role', width: 1 },
      { key: 'is_active', label: 'Active', width: 0.8, get: (u) => (u.is_active ? 'Yes' : 'No') },
      { key: 'created_at', label: 'Joined', width: 1.2, get: (u) => fmtDate(u.created_at) },
      {
        key: 'last_login_at',
        label: 'Last login',
        width: 1.2,
        get: (u) => fmtDate(u.last_login_at),
      },
    ],
  },
}
