import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireRecruiterOnboarded } from '@/lib/auth/recruiter-auth'
import JobForm from '@/components/jobs/JobForm'
import { updateJobAction } from './actions'

export const metadata = {
  title: 'Edit Job — MyTechZ Recruiter',
  robots: { index: false, follow: false },
}

// Convert a DB jobs row back into the shape JobForm expects.
function dbToFormInitial(job) {
  const base = {
    category: job.category || 'private',
    title: job.title || '',
    summary: job.summary || '',
    description: job.description || '',
    job_type: job.job_type || 'full_time',
    work_mode: job.work_mode || 'onsite',
    location_city: job.location_city || '',
    location_state: job.location_state || '',
    location_country: job.location_country || 'India',
    is_multi_location: !!job.is_multi_location,
    locations: Array.isArray(job.locations) ? job.locations : [],
    skills: Array.isArray(job.skills) ? job.skills : [],
    experience_min: job.experience_min ?? 0,
    experience_max: job.experience_max ?? '',
    openings: job.openings ?? 1,
    // ISO date → yyyy-mm-dd for <input type="date">
    application_deadline: job.application_deadline
      ? job.application_deadline.slice(0, 10)
      : '',
    apply_mode: job.apply_mode || 'internal',
    apply_url: job.apply_url || '',
    apply_email: job.apply_email || '',
    apply_phone: job.apply_phone || '',
    salary_min: job.salary_min ?? '',
    salary_max: job.salary_max ?? '',
    salary_currency: job.salary_currency || 'INR',
    salary_period: job.salary_period || 'year',
    is_salary_disclosed: !!job.is_salary_disclosed,
    department: job.department || '',
    industry: job.industry || '',
    is_featured: false, // recruiters can't set this
    is_urgent: !!job.is_urgent,
    status: job.status || 'pending_approval',
    // Internship-specific (stored as salary_min/max with period='month')
    stipend_min: job.category === 'internship' ? (job.salary_min ?? '') : '',
    stipend_max: job.category === 'internship' ? (job.salary_max ?? '') : '',
    duration_months: '', // not a DB column — let recruiter re-enter
    ppo_chance: '',
    // Government-specific
    government_meta: {
      notification_url: job.government_meta?.notification_url || '',
      exam_date: job.government_meta?.exam_date
        ? job.government_meta.exam_date.slice(0, 10)
        : '',
      age_max: job.government_meta?.age_max ?? '',
      vacancies: job.government_meta?.vacancies ?? '',
      application_fee: job.government_meta?.application_fee ?? '',
      department: job.government_meta?.department || '',
    },
    // AI-specific
    curation_reason: '',
  }
  return base
}

export default async function EditJobPage({ params }) {
  await requireRecruiterOnboarded()

  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: job } = await supabase
    .from('jobs')
    .select(
      'id, title, summary, description, category, job_type, work_mode, ' +
      'location_city, location_state, location_country, locations, is_multi_location, ' +
      'salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed, ' +
      'experience_min, experience_max, openings, application_deadline, ' +
      'skills, department, industry, is_urgent, ' +
      'apply_mode, apply_url, apply_email, apply_phone, ' +
      'government_meta, status, posted_by'
    )
    .eq('id', id)
    .maybeSingle()

  if (!job) notFound()
  if (job.posted_by !== user.id) redirect('/recruiter/dashboard')
  if (job.status === 'closed') redirect('/recruiter/dashboard')

  const initial = dbToFormInitial(job)
  const boundAction = updateJobAction.bind(null, id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <nav className="text-xs text-slate-500 mb-5 flex flex-wrap items-center gap-1">
        <a href="/recruiter/dashboard" className="hover:text-blue-700">Dashboard</a>
        <span>›</span>
        <span className="text-slate-700">Edit job</span>
      </nav>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Editing an existing job.</strong> The public URL and slug stay the same. Your current approval status is preserved — edits do not reset it to pending.
      </div>

      <JobForm mode="recruiter" action={boundAction} initial={initial} editMode />
    </div>
  )
}
