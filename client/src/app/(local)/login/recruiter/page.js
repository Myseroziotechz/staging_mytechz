import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Recruiter Sign In - MyTechZ',
  description: 'Sign in as a recruiter to post jobs and find top tech talent on MyTechZ.',
  robots: { index: false, follow: false },
}

export default function RecruiterLoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50/30 p-3 lg:p-5 overflow-hidden">
      <div className="relative w-full max-w-[960px] h-[540px] max-h-[95vh] bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        {/* Back button (mobile) */}
        <Link
          href="/login"
          aria-label="Back"
          className="lg:hidden absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-gray-100/80 backdrop-blur-md border border-gray-200/60 flex items-center justify-center text-gray-500 hover:bg-gray-200/80 hover:text-gray-700 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex h-full">
          {/* Left: Recruiter showcase panel */}
          <div className="hidden lg:flex lg:w-[48%] flex-col justify-center bg-gradient-to-br from-violet-600 to-indigo-700 p-10 text-white">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                🏢
              </div>
              <h2 className="text-2xl font-bold leading-snug">
                Hire top tech talent faster
              </h2>
              <p className="text-sm text-violet-100 leading-relaxed">
                Post jobs, review applicants, and manage your entire hiring pipeline from one place.
              </p>
              <ul className="space-y-2.5 text-sm text-violet-100">
                {[
                  'Post unlimited job listings',
                  'AI-matched candidate recommendations',
                  'Applicant tracking & pipeline management',
                  'Company profile & verification badge',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-violet-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Login form */}
          <div className="w-full lg:w-[52%] flex flex-col justify-center px-5 sm:px-8 lg:px-9 py-4">
            <div className="w-full max-w-[340px] mx-auto space-y-3">
              {/* Logo */}
              <div className="flex justify-center lg:justify-start">
                <Link href="/" aria-label="MyTechZ Home" className="inline-flex">
                  <Image
                    src="/Mytechz_logo.png"
                    alt="MyTechZ"
                    width={140}
                    height={38}
                    className="h-8 object-contain"
                    style={{ width: 'auto' }}
                    priority
                  />
                </Link>
              </div>

              <Suspense fallback={<div className="text-center text-gray-400 py-6">Loading...</div>}>
                <LoginForm defaultRole="recruiter" />
              </Suspense>

              {/* Switch to job seeker */}
              <p className="text-center text-xs text-gray-400">
                Looking for a job?{' '}
                <Link href="/login/user" className="text-blue-600 font-semibold hover:underline">
                  Sign in as Job Seeker
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
