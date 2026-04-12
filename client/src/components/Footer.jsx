import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-60 sm:w-96 h-60 sm:h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Newsletter / CTA Banner */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -top-6 sm:-top-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                Stay ahead in your career
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm">
                Get the latest job alerts, AI tool updates, and career tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Brand Column — full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/Mytechz_logo.png"
                alt="MyTechz Logo"
                width={160}
                height={45}
                className="h-8 sm:h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your gateway to the best tech opportunities. Connecting talented
              professionals with top companies across India through AI-powered tools.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
              <a
                href={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/mytechz'}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/80 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="group w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/80 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all duration-300"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="group w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/80 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="group w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/80 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="group w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/80 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Jobs — half width on mobile (2-col grid) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Jobs
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/jobs/private" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Private Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs/government" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Government Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Fresher Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              AI Tools
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/ai-tools/resume-builder" className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/ai-tools/smart-job-search" className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Smart Job Search
                </Link>
              </li>
              <li>
                <Link href="/ai-tools/resume-rank-checker" className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Resume Rank Checker
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 hover:translate-x-1 inline-block transition-all duration-200">
                  All AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Company
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-xs sm:text-sm text-gray-400 hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Get in Touch
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2.5 sm:gap-3">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="text-xs sm:text-sm text-gray-400 break-all">support@mytechz.in</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-xs sm:text-sm text-gray-400">Bangalore, India</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-sm text-gray-400">Mon - Sat, 9am - 7pm</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-xs sm:text-sm text-gray-400">+91 XXXXX XXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-white mb-0.5">1000+</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Active Jobs</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700/50 hover:border-purple-500/30 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-white mb-0.5">500+</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Companies</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700/50 hover:border-emerald-500/30 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-white mb-0.5">10K+</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Happy Users</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700/50 hover:border-amber-500/30 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-white mb-0.5">95%</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-800/80">
          <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} MyTechZ.in — All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
              <Link href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-3 sm:mt-4">
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  )
}
