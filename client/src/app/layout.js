import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutShell from '@/components/LayoutShell'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'MyTechZ - Find Your Dream Tech Job',
  description:
    'MyTechZ is your gateway to the best tech opportunities. Browse private & government jobs, internships, webinars, and more.',
  keywords:
    'jobs, tech jobs, IT jobs, software developer jobs, government jobs, internships, India',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
