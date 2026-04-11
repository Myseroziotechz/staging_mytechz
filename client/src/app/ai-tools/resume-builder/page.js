export const metadata = {
  title: 'Resume Builder - MyTechZ AI Tools',
  description: 'Create professional, ATS-friendly resumes powered by AI.',
}

export default function ResumeBuilderPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          AI <span className="text-blue-600">Resume Builder</span>
        </h1>
        <p className="text-lg text-gray-600">
          Create professional, ATS-friendly resumes in minutes with the power of AI.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Our AI-powered resume builder is under development. Soon you will be able to create stunning resumes effortlessly.
        </p>
      </div>
    </section>
  )
}
