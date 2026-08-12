import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/auth/LoginForm'
import LoginShowcase from '@/components/auth/LoginShowcase'

export const metadata = {
  title: 'Job Seeker Sign In',
  description: 'Sign in to find jobs, build your resume, and track applications on MyTechZ.',
  robots: { index: false, follow: false },
}

export default async function UserLoginPage({ searchParams }) {
  const sp = await searchParams
  const query = sp?.returnTo ? `?returnTo=${encodeURIComponent(sp.returnTo)}` : ''

  // Redirect already-authenticated users to their dashboard
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, onboarding_completed')
        .eq('id', user.id)
        .maybeSingle()

      const role = profile?.role ?? 'candidate'
      if (role === 'admin') redirect('/admin/dashboard')
      else if (role === 'recruiter') redirect(profile?.onboarding_completed ? '/recruiter/dashboard' : '/recruiter/onboarding')
      else redirect('/dashboard')
    }
  } catch (e) {
    if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e
  }
  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-blue-50/30 p-3 lg:p-5 overflow-hidden">
      <div className="relative w-full max-w-[960px] h-[540px] max-h-[95vh] bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        {/* Back button (mobile) */}
        <Link
          href={`/login${query}`}
          aria-label="Back"
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

              <Suspense fallback={<div className="text-center text-gray-400 py-6">Loading...</div>}>
                <LoginForm defaultRole="candidate" />
              </Suspense>

              {/* Switch to recruiter */}
              <p className="text-center text-xs text-gray-400">
                Hiring talent?{' '}
                <Link href={`/login/recruiter${query}`} className="text-violet-600 font-semibold hover:underline">
                  Sign in as Recruiter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
