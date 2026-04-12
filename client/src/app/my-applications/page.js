import ComingSoon from '@/components/ComingSoon'

export const metadata = {
  title: 'My Applications - MyTechZ',
  description: 'Track the status of every job you have applied to.',
}

export default function MyApplicationsPage() {
  return (
    <ComingSoon
      title="My Applications"
      description="Track the status of every job you have applied to — from submitted to offer — in one place."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      }
    />
  )
}
