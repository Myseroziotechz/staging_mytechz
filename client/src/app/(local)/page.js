export const metadata = {
  title: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
  description:
    'Discover verified tech jobs, government vacancies, paid internships and AI career tools. 50,000+ opportunities from 500+ hiring partners across India.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
    description: 'Discover verified tech jobs, government vacancies, paid internships and AI career tools.',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
}

import HeroSection            from '@/components/home/HeroSection'
import JobSearchFeature       from '@/components/home/JobSearchFeature'
import VerifiedEmployersStrip from '@/components/home/VerifiedEmployersStrip'
import StatsBar               from '@/components/home/StatsBar'
import HowItWorks             from '@/components/home/HowItWorks'
import JobCategories          from '@/components/home/JobCategories'
import Philosophy             from '@/components/home/Philosophy'
import Reviews                from '@/components/home/Reviews'
import ForRecruiters          from '@/components/home/ForRecruiters'
import FaqAccordion           from '@/components/home/FaqAccordion'
import NewsletterSection      from '@/components/home/NewsletterSection'
import CallToAction           from '@/components/home/CallToAction'

export default function Home() {
  return (
    <main className="bg-white">
      <div>
        <HeroSection />
        <JobSearchFeature />
        <VerifiedEmployersStrip />
        <StatsBar />
        <HowItWorks />
        <JobCategories />
        <Philosophy />
        <Reviews />
        <ForRecruiters />
        <FaqAccordion />
        <NewsletterSection />
        <CallToAction />
      </div>
    </main>
  )
}
