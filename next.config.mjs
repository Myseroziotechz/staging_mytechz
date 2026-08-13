/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfjs-dist'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // SEO: redirect common URL variants, old paths, and typos to canonical URLs
  async redirects() {
    return [
      // Resume builder variants → canonical
      { source: '/resume-builder',           destination: '/ai-tools/resume-builder',   permanent: true },
      { source: '/resume',                   destination: '/ai-tools/resume-builder',   permanent: true },
      { source: '/cv-builder',               destination: '/ai-tools/resume-builder',   permanent: true },
      { source: '/free-resume-builder',      destination: '/ai-tools/resume-builder',   permanent: true },
      { source: '/build-resume',             destination: '/ai-tools/resume-builder',   permanent: true },
      { source: '/ai-tools/resume',          destination: '/ai-tools/resume-builder',   permanent: true },
      // Resume templates
      { source: '/resume-templates',         destination: '/ai-tools/resume-builder/templates', permanent: true },
      { source: '/templates',                destination: '/ai-tools/resume-builder/templates', permanent: true },
      // Jobs variants → canonical
      { source: '/job',                      destination: '/jobs',                permanent: true },
      { source: '/job-search',               destination: '/jobs',                permanent: true },
      { source: '/find-jobs',                destination: '/jobs',                permanent: true },
      { source: '/tech-jobs',                destination: '/jobs/private',        permanent: true },
      { source: '/it-jobs',                  destination: '/jobs/private',        permanent: true },
      { source: '/software-jobs',            destination: '/jobs/private',        permanent: true },
      { source: '/govt-jobs',                destination: '/jobs/government',     permanent: true },
      { source: '/government-jobs',          destination: '/jobs/government',     permanent: true },
      { source: '/sarkari-jobs',             destination: '/jobs/government',     permanent: true },
      { source: '/internship',               destination: '/jobs/internship',     permanent: true },
      { source: '/internships',              destination: '/jobs/internship',     permanent: true },
      // AI tools variants
      { source: '/tools',                    destination: '/ai-tools',            permanent: true },
      { source: '/ai',                       destination: '/ai-tools',            permanent: true },
      { source: '/career-tools',             destination: '/ai-tools',            permanent: true },
      // Page variants
      { source: '/about-us',                 destination: '/about',               permanent: true },
      { source: '/contact-us',               destination: '/contact',             permanent: true },
      { source: '/our-services',             destination: '/services',            permanent: true },
      // Auth shortcuts
      { source: '/signup',                   destination: '/login',               permanent: true },
      { source: '/register',                 destination: '/login',               permanent: true },
      { source: '/sign-up',                  destination: '/login',               permanent: true },
      { source: '/sign-in',                  destination: '/login',               permanent: true },
      // Resume ATS Checker variants → canonical
      { source: '/ats-checker',              destination: '/ai-tools/resume-rank-checker', permanent: true },
      { source: '/resume-score',             destination: '/ai-tools/resume-rank-checker', permanent: true },
      { source: '/resume-checker',           destination: '/ai-tools/resume-rank-checker', permanent: true },
      { source: '/ats-score',                destination: '/ai-tools/resume-rank-checker', permanent: true },
      { source: '/resume-ats-test',          destination: '/ai-tools/resume-rank-checker', permanent: true },
      { source: '/resume-analysis',          destination: '/ai-tools/resume-rank-checker', permanent: true },
      // Salary calculator variants → canonical
      { source: '/salary-calculator',        destination: '/ai-tools/salary-calculator', permanent: true },
      { source: '/ctc-calculator',           destination: '/ai-tools/salary-calculator', permanent: true },
      { source: '/take-home-calculator',     destination: '/ai-tools/salary-calculator', permanent: true },
      { source: '/in-hand-salary-calculator', destination: '/ai-tools/salary-calculator', permanent: true },
    ]
  },
}

export default nextConfig
