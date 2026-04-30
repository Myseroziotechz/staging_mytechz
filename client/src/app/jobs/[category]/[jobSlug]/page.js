import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJobBySlug, getSimilarJobs } from '@/lib/jobs/queries'
import {
  formatSalary, formatLocation, formatExperience, formatPostedAgo,
  formatDeadline, jobTypeLabel, workModeLabel, companyInitials,
} from '@/lib/jobs/format'
import JobJsonLd from '@/components/jobs/JobJsonLd'
import JobAssistantPanel from '@/components/jobs/JobAssistantPanel'
import JobCard from '@/components/jobs/JobCard'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

export const revalidate = 300

const VALID_CATEGORIES = ['private', 'government']

export async function generateMetadata({ params }) {
  const { category, jobSlug } = await params
  if (!VALID_CATEGORIES.includes(category)) return { title: 'Job not found' }

  const job = await getJobBySlug(category, jobSlug)
  if (!job) return { title: 'Job not found', robots: { index: false, follow: false } }

  const compName = job.company?.name || 'Company'
  const cityBit  = job.location_city ? ` – ${job.location_city}` : ''
  const title    = job.meta_title || `${job.title} at ${compName}${cityBit} | MyTechz`
  const desc     = (job.meta_description || job.summary || job.description || '').replace(/\s+/g, ' ').slice(0, 155)
  const url      = `${SITE}/jobs/${category}/${jobSlug}`

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, url, type: 'website',
      images: job.og_image_url ? [{ url: job.og_image_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description: desc },
    robots: job.status === 'active'
      ? { index: true, follow: true }
      : { index: false, follow: false },
    other: {
      'geo.region':    job.location_country_code || 'IN',
      'geo.placename': job.location_city || '',
      'geo.position':  (job.geo_lat && job.geo_lng) ? `${job.geo_lat};${job.geo_lng}` : '',
      'ICBM':          (job.geo_lat && job.geo_lng) ? `${job.geo_lat}, ${job.geo_lng}` : '',
    },
  }
}

export default async function JobDetailPage({ params, searchParams }) {
  const { category, jobSlug } = await params
  const sp = (await searchParams) || {}
  if (!VALID_CATEGORIES.includes(category)) notFound()

  const job = await getJobBySlug(category, jobSlug)
  if (!job) notFound()

  const similar = await getSimilarJobs(job.id, job.category, job.skills || [], 6)

  const isApplied = sp.applied === '1'
  const salary    = formatSalary(job)
  const loc       = formatLocation(job)
  const exp       = formatExperience(job)
  const posted    = formatPostedAgo(job.posted_at)
  const deadline  = formatDeadline(job.application_deadline)
  const compName  = job.company?.name || 'Company'
  const compLogo  = job.company?.logo_url
  const applyPath = `/jobs/${job.category}/${job.slug}/apply`
  const applyLabel = job.apply_mode === 'external' ? 'Apply on company website'
                  : job.apply_mode === 'email'    ? 'Apply by email'
                  : job.apply_mode === 'phone'    ? 'Call to apply'
                  : 'Apply now'

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      <JobJsonLd job={job} />

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
          <span className="text-slate-700 truncate">{job.title}</span>
        </nav>

        {/* Header card */}
        <header className="job-glass-panel rounded-3xl p-5 sm:p-7 mb-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-xl ring-1 ring-white/60">
              {compLogo
                ? /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={compLogo} alt={compName} className="w-full h-full object-cover rounded-2xl" />
                : <span>{companyInitials(compName)}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                {job.is_featured && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Featured</span>}
                {job.is_urgent &&   <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">Urgent</span>}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                <span className="font-medium">{compName}</span>
                {loc && <> · <span>{loc}</span></>}
                {posted && <> · <span className="text-slate-400">{posted}</span></>}
              </div>

              <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Fact label="Type"       value={jobTypeLabel(job.job_type)} />
                <Fact label="Mode"       value={workModeLabel(job.work_mode)} />
                <Fact label="Experience" value={exp} />
                <Fact label="Openings"   value={`${job.openings_filled || 0} / ${job.openings || 1}`} />
                {salary &&                                                       <Fact label="Salary"   value={salary} />}
                {job.application_deadline && deadline &&                          <Fact label="Closes"   value={deadline.text} accent={deadline.urgent ? 'rose' : null} />}
                {job.job_start_date &&                                            <Fact label="Start"    value={new Date(job.job_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />}
                {job.department &&                                                <Fact label="Team"     value={job.department} />}
              </dl>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-5 pt-5 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <Link
              href={isApplied ? `?applied=1` : applyPath}
              className={[
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition active:scale-[0.98]',
                isApplied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/20',
              ].join(' ')}
            >
              {isApplied ? 'Applied ✓' : applyLabel}
              {!isApplied && job.apply_mode === 'external' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14M5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>
              )}
            </Link>

            {job.company?.website && (
              <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition active:scale-[0.98]">
                Visit website
              </a>
            )}

            <JobAssistantPanel job={job} />
          </div>
        </header>

        {/* Body grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <article className="space-y-6">
            {job.summary && (
              <div className="job-glass-panel rounded-2xl p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-blue-700 mb-2">At a glance</h2>
                <p className="text-slate-800 leading-relaxed">{job.summary}</p>
              </div>
            )}

            <Block title="About the role">
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 text-[15px] leading-relaxed">
                {job.description}
              </div>
            </Block>

            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <Block title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map(s => <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{s}</span>)}
                </div>
              </Block>
            )}

            {Array.isArray(job.qualifications) && job.qualifications.length > 0 && (
              <Block title="Qualifications">
                <ul className="list-disc list-inside text-slate-700 text-sm space-y-1">
                  {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </Block>
            )}

            {Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <Block title="Benefits">
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.map(b => <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{b}</span>)}
                </div>
              </Block>
            )}

            {job.category === 'government' && job.government_meta && (
              <Block title="Official notification">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(job.government_meta).map(([k, v]) => (
                    typeof v === 'string' || typeof v === 'number' ? (
                      <div key={k}>
                        <dt className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}</dt>
                        <dd className="font-medium text-slate-900">{String(v)}</dd>
                      </div>
                    ) : null
                  ))}
                </dl>
                {job.government_meta.notification_pdf_url && (
                  <a href={job.government_meta.notification_pdf_url} target="_blank" rel="noreferrer"
                     className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                    Download official PDF
                  </a>
                )}
              </Block>
            )}

            {Array.isArray(job.faq) && job.faq.length > 0 && (
              <Block title="Frequently asked">
                <div className="space-y-2">
                  {job.faq.map((f, i) => (
                    <details key={i} className="rounded-xl border border-slate-200 bg-white/70 p-3">
                      <summary className="cursor-pointer font-medium text-slate-900">{f.q}</summary>
                      <p className="mt-2 text-sm text-slate-600">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Block>
            )}
          </article>

          <aside className="space-y-4">
            <Block title="About the company">
              <div className="text-sm text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">{compName}</div>
                {job.company?.industry && <div>{job.company.industry}</div>}
                {job.company?.size     && <div>{job.company.size} employees</div>}
                {job.company?.hq_location && <div>HQ: {job.company.hq_location}</div>}
                {job.company?.website  && <a href={job.company.website} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">{job.company.website.replace(/^https?:\/\//, '')}</a>}
              </div>
            </Block>

            <Block title="Share">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <a className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(job.title)}&url=${encodeURIComponent(`${SITE}/jobs/${job.category}/${job.slug}`)}`}>Twitter / X</a>
                <a className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200" target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE}/jobs/${job.category}/${job.slug}`)}`}>LinkedIn</a>
                <a className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200" href={`mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(`${SITE}/jobs/${job.category}/${job.slug}`)}`}>Email</a>
              </div>
            </Block>
          </aside>
        </div>

        {/* Similar jobs */}
        {similar.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Similar jobs</h2>
            <div className="job-card-stagger grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {similar.map(j => <JobCard key={j.id} job={j} variant="compact" />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function Fact({ label, value, accent }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className={[
        'mt-0.5 text-sm font-semibold',
        accent === 'rose' ? 'text-rose-600' : 'text-slate-900',
      ].join(' ')}>{value}</dd>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <section className="job-glass-panel rounded-2xl p-5 sm:p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}
