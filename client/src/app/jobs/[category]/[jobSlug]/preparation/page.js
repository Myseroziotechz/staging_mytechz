import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJobBySlug } from '@/lib/jobs/queries'
import { createClient } from '@/lib/supabase-server'
import JobRoadmapView, { FALLBACK_ROADMAP } from '@/components/jobs/JobRoadmapView'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'
const VALID = ['private', 'government']

export const revalidate = 600

export async function generateMetadata({ params }) {
  const { category, jobSlug } = await params
  if (!VALID.includes(category)) return { title: 'Preparation roadmap not found' }
  const job = await getJobBySlug(category, jobSlug)
  if (!job) return { title: 'Preparation roadmap not found', robots: { index: false } }
  const url = `${SITE}/jobs/${category}/${jobSlug}/preparation`
  return {
    title: `Preparation roadmap — ${job.title} at ${job.company?.name || ''} | MyTechz`,
    description: `A 4-week preparation roadmap for the ${job.title} role: skill gap, study plan, resources, mock-interview questions, resume tips and a final checklist.`,
    alternates: { canonical: url },
    openGraph: { title: `Prepare for: ${job.title}`, url, type: 'article' },
    robots: { index: true, follow: true },
  }
}

async function fetchRoadmap(jobId) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: own } = await supabase
        .from('job_assistant_roadmaps').select('roadmap')
        .eq('job_id', jobId).eq('user_id', user.id).maybeSingle()
      if (own?.roadmap) return { roadmap: own.roadmap, personalized: true }
    }

    const { data: generic } = await supabase
      .from('job_assistant_roadmaps').select('roadmap')
      .eq('job_id', jobId).is('user_id', null).maybeSingle()
    if (generic?.roadmap) return { roadmap: generic.roadmap, personalized: false }

    return { roadmap: null, personalized: false }
  } catch {
    return { roadmap: null, personalized: false }
  }
}

export default async function JobPreparationPage({ params }) {
  const { category, jobSlug } = await params
  if (!VALID.includes(category)) notFound()

  const job = await getJobBySlug(category, jobSlug)
  if (!job) notFound()

  const { roadmap: stored, personalized } = await fetchRoadmap(job.id)
  const roadmap = stored || FALLBACK_ROADMAP(job)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>›</span>
          <Link href="/jobs" className="hover:text-blue-700">Jobs</Link>
          <span>›</span>
          <Link href={`/jobs?tab=${job.category}`} className="hover:text-blue-700 capitalize">{job.category}</Link>
          <span>›</span>
          <Link href={`/jobs/${job.category}/${job.slug}`} className="hover:text-blue-700 truncate">{job.title}</Link>
          <span>›</span>
          <span className="text-slate-700">Preparation</span>
        </nav>

        {/* Hero */}
        <header className="job-glass-panel rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500 text-white shadow-md shadow-blue-700/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z"/></svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Preparation roadmap</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mt-0.5">
                {job.title}
              </h1>
              <p className="text-sm text-slate-600 mt-1">{job.company?.name || 'Company'}</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
            A guided 4-week plan to prepare for this role — skills to learn, what to build, common interview questions, and a resume-tailoring checklist.
            {!personalized && ' Sign in for a roadmap personalized to your resume.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/jobs/${job.category}/${job.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-800 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">
              ← Back to job
            </Link>
            {job.apply_mode === 'internal' ? (
              <Link href={`/jobs/${job.category}/${job.slug}/apply`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition active:scale-[0.98]">
                Apply now →
              </Link>
            ) : (
              <Link href={`/jobs/${job.category}/${job.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-md shadow-blue-700/20 transition active:scale-[0.98]">
                Apply now →
              </Link>
            )}
          </div>
        </header>

        {/* Roadmap content */}
        <div className="job-glass-panel rounded-3xl p-5 sm:p-8">
          <JobRoadmapView roadmap={roadmap} />
        </div>
      </div>
    </main>
  )
}
