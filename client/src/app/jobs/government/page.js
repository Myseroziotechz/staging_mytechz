export const metadata = {
  title: 'Government Jobs - MyTechZ',
  description: 'Browse government sector job opportunities in central, state, and PSU organizations.',
}

export default function GovernmentJobsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Government <span className="text-emerald-600">Jobs</span>
        </h1>
        <p className="text-lg text-gray-600">
          Find secure and rewarding careers in central & state government, PSUs, and public sector organizations.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          We are aggregating the latest government job notifications for you. Stay tuned for updates.
        </p>
      </div>
    </section>
  )
}
