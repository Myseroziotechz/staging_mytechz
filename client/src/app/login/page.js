import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login - MyTechZ',
  description: 'Sign in to your MyTechZ account',
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" aria-label="MyTechZ Home" className="inline-flex">
            <Image
              src="/Mytechz_logo.png"
              alt="MyTechZ"
              width={180}
              height={48}
              className="h-12 object-contain"
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
