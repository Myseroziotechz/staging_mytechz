export const metadata = {
  title: 'Smart Job Search - MyTechZ AI Tools',
  description: 'AI-powered job matching based on your skills, experience, and career preferences.',
}

export default function SmartJobSearchPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Smart <span className="text-purple-600">Job Search</span>
        </h1>
        <p className="text-lg text-gray-600">
          Let AI match you with the perfect job opportunities based on your profile and preferences.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Our intelligent job matching engine is being trained. Soon it will find the best jobs tailored just for you.
        </p>
      </div>
    </section>
  )
}
