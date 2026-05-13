import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Ready to Start Your Career Journey?
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
          Join thousands of professionals who found their dream job through MyTechZ.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/20"
          >
            Sign Up Now
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
