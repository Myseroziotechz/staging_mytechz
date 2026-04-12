import ComingSoon from '@/components/ComingSoon'

export const metadata = {
  title: 'Dashboard - MyTechZ',
  description: 'Your personalised MyTechZ dashboard.',
}

export default function DashboardPage() {
  return (
    <ComingSoon
      title="Your Dashboard"
      description="A unified view of your job search progress, recommendations, and career insights is coming soon."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
        </svg>
      }
    />
  )
}
