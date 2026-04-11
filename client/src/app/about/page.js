export const metadata = {
  title: 'About - MyTechZ',
  description: 'Learn about MyTechZ — our mission to connect tech talent with the best opportunities.',
}

export default function AboutPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">MyTechZ</span>
          </h1>
          <p className="text-lg text-gray-600">
            Empowering tech professionals to find their dream careers.
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p>
              MyTechZ is your gateway to the best tech opportunities. We bridge the gap between talented
              professionals and leading organizations — from innovative startups to established government
              institutions. Our platform combines cutting-edge AI tools with a curated job marketplace
              to help you land the perfect role.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">1000+</div>
              <div className="text-sm text-gray-500">Job Listings</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-500">Companies</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                <span>Curated private and government job listings across all tech domains</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                <span>AI-powered resume builder for professional, ATS-friendly resumes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                <span>Smart job search that matches opportunities to your skills and preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                <span>Resume rank checker to see how your resume scores against job requirements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
