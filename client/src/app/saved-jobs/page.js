import ComingSoon from '@/components/ComingSoon'

export const metadata = {
  title: 'Saved Jobs - MyTechZ',
  description: 'Your bookmarked job opportunities.',
}

export default function SavedJobsPage() {
  return (
    <ComingSoon
      title="Saved Jobs"
      description="Bookmark roles you love and come back when you're ready to apply."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
        </svg>
      }
    />
  )
}
