import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getJobBySlug } from '@/lib/jobs/queries'
import { applyHref, formatLocation } from '@/lib/jobs/format'
import { createClient } from '@/lib/supabase-server'

const VALID = ['private', 'government']

export async function generateMetadata({ params }) {
  const { category, jobSlug } = await params
  if (!VALID.includes(category)) return { title: 'Apply — not found' }
  const job = await getJobBySlug(category, jobSlug)
  if (!job) return { title: 'Apply — not found', robots: { index: false } }
  return {
    title: `Apply — ${job.title} at ${job.company?.name || ''} | MyTechz`,
    description: `Submit your application for the ${job.title} role.`,
    robots: { index: false, follow: true },
  }
}

export default async function JobApplyPage({ params }) {
  const { category, jobSlug } = await params
  if (!VALID.includes(category)) notFound()

  // Auth gate — must be logged in to apply (or follow an external apply link).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const returnTo = `/jobs/${category}/${jobSlug}/apply`
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }

  const job = await getJobBySlug(category, jobSlug)
  if (!job) notFound()

  const externalHref = applyHref(job)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>›</span>
          <Link href="/jobs" className="hover:text-blue-700">Jobs</Link>
          <span>›</span>
          <Link href={`/jobs/${job.category}/${job.slug}`} className="hover:text-blue-700 truncate">{job.title}</Link>
          <span>›</span>
          <span className="text-slate-700">Apply</span>
        </nav>

        <section className="job-glass-panel rounded-3xl p-6 sm:p-8 text-center">
          <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Apply — {job.title}</h1>
          <p className="text-sm text-slate-600 mt-1">{job.company?.name} · {formatLocation(job)}</p>

          <div className="mt-6 rounded-xl bg-amber-50/80 border border-amber-200 p-4 text-left">
            <p className="text-sm font-semibold text-amber-900">Application form — coming soon</p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              The in-platform application form is being built. In the meantime, you can use the options below to apply directly.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center">
            {externalHref && job.apply_mode === 'external' && (
              <a href={externalHref} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition active:scale-[0.98]">
                Apply on company website ↗
              </a>
            )}
            {externalHref && job.apply_mode === 'email' && (
              <a href={externalHref}
                 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition active:scale-[0.98]">
                Apply by email
              </a>
            )}
            {externalHref && job.apply_mode === 'phone' && (
              <a href={externalHref}
                 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition active:scale-[0.98]">
                Call to apply
              </a>
            )}
            <Link href={`/jobs/${job.category}/${job.slug}/preparation`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-800 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">
              Prepare first ✨
            </Link>
            <Link href={`/jobs/${job.category}/${job.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-800 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">
              Back to job
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
