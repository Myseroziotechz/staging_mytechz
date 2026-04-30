import Link from 'next/link'

export default function JobAssistantPanel({ job }) {
  if (!job) return null
  return (
    <Link
      href={`/jobs/${job.category}/${job.slug}/preparation`}
      className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-blue-700/25 hover:shadow-xl hover:-translate-y-0.5 transition active:scale-[0.98] overflow-hidden"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />
      </svg>
      <span>Prepare for this role</span>
      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
      </svg>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </Link>
  )
}
