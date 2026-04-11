export const metadata = {
  title: 'Resume Rank Checker - MyTechZ AI Tools',
  description: 'Get an AI-powered score for your resume and see how well it matches job descriptions.',
}

export default function ResumeRankCheckerPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Resume <span className="text-amber-600">Rank Checker</span>
        </h1>
        <p className="text-lg text-gray-600">
          Upload your resume and get an instant AI-powered score with actionable improvement tips.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Our resume analysis engine is being fine-tuned. Soon you will be able to check how your resume ranks against job requirements.
        </p>
      </div>
    </section>
  )
}
