import Link from 'next/link'

export const metadata = {
  title: 'AI Tools - MyTechZ',
  description: 'Supercharge your job search with AI-powered tools — resume builder, smart job search, and resume rank checker.',
}

const tools = [
  {
    title: 'Resume Builder',
    href: '/ai-tools/resume-builder',
    description: 'Create professional, ATS-friendly resumes powered by AI. Stand out from the competition with perfectly crafted resumes.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'blue',
    gradient: 'from-blue-50 to-indigo-100',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Smart Job Search',
    href: '/ai-tools/smart-job-search',
    description: 'Let AI match you with the best job opportunities based on your skills, experience, and career preferences.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    color: 'purple',
    gradient: 'from-purple-50 to-violet-100',
    border: 'border-purple-100',
    iconBg: 'bg-purple-600',
  },
  {
    title: 'Resume Rank Checker',
    href: '/ai-tools/resume-rank-checker',
    description: 'Get an instant AI-powered score for your resume. See how well it matches job descriptions and improve your chances.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: 'amber',
    gradient: 'from-amber-50 to-orange-100',
    border: 'border-amber-100',
    iconBg: 'bg-amber-600',
  },
]

export default function AIToolsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered <span className="text-blue-600">Tools</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Supercharge your job search with our suite of intelligent tools designed to help you land your dream role.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tool.gradient} p-8 ${tool.border} border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-5`}>
              {tool.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
