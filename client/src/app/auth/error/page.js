import { Suspense } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Authentication Error - MyTechZ',
}

const ERROR_MESSAGES = {
  auth_failed: 'Authentication failed. Please try signing in again.',
  session_expired: 'Your session has expired. Please sign in again.',
  no_session: 'No active session found. Please sign in.',
  role_error: 'We could not determine your account role. Please try again.',
}

export default async function AuthErrorPage({ searchParams }) {
  const params = await searchParams
  const reason = params?.reason || 'auth_failed'
  const message = ERROR_MESSAGES[reason] || ERROR_MESSAGES.auth_failed

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6v.01M12 3l9.5 16.5H2.5L12 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Authentication Error</h1>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
