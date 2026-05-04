import Link from 'next/link'
import HomeSection, { SectionHeader } from './HomeSection'

const categories = [
  { name: 'Software Development', href: '/jobs/private?q=developer', count: 'Private',       icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> },
  { name: 'Data Science / AI',    href: '/jobs/private?q=data',       count: 'Private',       icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
  { name: 'UI / UX Design',       href: '/jobs/private?q=design',     count: 'Private',       icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
  { name: 'Internships',          href: '/jobs/internship',           count: 'For students',  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12 12 0 01.665 6.479A11.95 11.95 0 0012 20.055a11.95 11.95 0 00-6.824-2.998 12 12 0 01.665-6.479L12 14z" /> },
  { name: 'Government / PSU',     href: '/jobs/government',           count: 'Public sector', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /> },
  { name: 'AI Featured',          href: '/jobs/ai',                   count: 'Personalized',  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" /> },
]

export default function JobCategories() {
  return (
    <HomeSection id="categories" tone="light">
      <SectionHeader eyebrow="Categories" title="Browse by area" subtitle="Find jobs in your area of expertise." />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href}
            className="job-glass-panel group p-6 rounded-xl hover:bg-blue-50/60 hover:border-blue-200 transition-all duration-200 hover:-translate-y-0.5">
            <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{cat.icon}</svg>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{cat.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{cat.count}</p>
          </Link>
        ))}
      </div>
    </HomeSection>
  )
}
