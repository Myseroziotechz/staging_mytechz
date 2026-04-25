import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import LoginShowcase from '@/components/auth/LoginShowcase'

export const metadata = {
  title: 'Login - MyTechZ',
  description: 'Sign in to your MyTechZ account',
}

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-3 lg:p-5 overflow-hidden">
      {/* Card */}
      <div className="relative w-full max-w-[960px] h-[540px] max-h-[95vh] bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        {/* Mobile glass back button */}
        <Link
          href="/"
          aria-label="Back to home"
          className="lg:hidden absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-gray-100/80 backdrop-blur-md border border-gray-200/60 flex items-center justify-center text-gray-500 hover:bg-gray-200/80 hover:text-gray-700 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex h-full">
          {/* Left: Showcase (desktop only) */}
          <div className="hidden lg:block lg:w-[48%]">
            <LoginShowcase />
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

              <Suspense
                fallback={
                  <div className="text-center text-gray-400 py-6">Loading...</div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
