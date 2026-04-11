import Link from 'next/link'

export const metadata = {
  title: 'Jobs - MyTechZ',
  description: 'Browse private and government tech job opportunities on MyTechZ.',
}

export default function JobsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream <span className="text-blue-600">Job</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore thousands of opportunities across private companies and government organizations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          href="/jobs/private"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Private Jobs
            </h2>
            <p className="text-gray-600">
              Explore opportunities at top private companies, startups, and MNCs across all tech domains.
            </p>
          </div>
        </Link>

        <Link
          href="/jobs/government"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 p-8 border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              Government Jobs
            </h2>
            <p className="text-gray-600">
              Find secure careers in central & state government, PSUs, and public sector organizations.
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}
