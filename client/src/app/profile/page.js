import ComingSoon from '@/components/ComingSoon'

export const metadata = {
  title: 'Profile - MyTechZ',
  description: 'Manage your MyTechZ profile and preferences.',
}

export default function ProfilePage() {
  return (
    <ComingSoon
      title="Your Profile"
      description="Update your details, skills, and resume to unlock personalised job matches."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m12 7a8 8 0 10-16 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }
    />
  )
}
