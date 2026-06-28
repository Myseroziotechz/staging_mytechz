export const metadata = {
  title: 'Resume Rank Checker - MyTechZ',
  description: 'Instantly check your resume ATS score and find keyword gaps. Coming soon to MyTechZ.',
  robots: { index: false, follow: false },
}

export default function ResumeRankCheckerPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
        Coming Soon
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Resume Rank Checker</h1>
      <p className="text-gray-500 text-base leading-relaxed">
        Instantly check your resume ATS score, find keyword gaps, and get actionable tips to beat applicant tracking systems.
      </p>
    </div>
  )
}
