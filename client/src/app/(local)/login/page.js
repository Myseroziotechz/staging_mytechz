import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Login to MyTechZ',
  description: 'Sign in to your MyTechZ account as a job seeker or recruiter.',
  robots: { index: false, follow: false },
}

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams
  // Forwarded to /login/user and /login/recruiter so a returnTo set by
  // middleware (e.g. /login?returnTo=/profile) survives the role picker
  // instead of being dropped — otherwise a user bounced here from a
  // protected route would land on the generic dashboard after signing in
  // instead of back on the page they actually asked for.
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
    // NEXT_REDIRECT is thrown by redirect() — rethrow it
    if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e
    // Otherwise ignore auth errors and show login page
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="MyTechZ Home">
            <Image
              src="/Mytechz_logo.png"
              alt="MyTechZ"
              width={140}
              height={38}
              className="h-9 object-contain"
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to MyTechZ</h1>
          <p className="mt-2 text-sm text-gray-500">Choose how you want to sign in</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Job Seeker */}
          <Link
            href={`/login/user${query}`}
            className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all duration-200 text-center"
          >
            <span className="text-4xl">🎯</span>
            <div>
              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Job Seeker
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Find jobs, build resumes & track applications
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Sign in <span aria-hidden="true">→</span>
            </span>
          </Link>

          {/* Recruiter */}
          <Link
            href={`/login/recruiter${query}`}
            className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-violet-500 hover:shadow-md transition-all duration-200 text-center"
          >
            <span className="text-4xl">🏢</span>
            <div>
              <p className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                Recruiter
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Post jobs, find talent & manage your pipeline
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Sign in <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        {/* Back link */}
        <p className="mt-8 text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
