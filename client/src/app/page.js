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
    <main className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      {/* Premium animated grid + soft blobs (shared by every light section) */}
      <div className="pointer-events-none fixed inset-0 z-0 hero-grid opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="hero-blob absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-blue-300/25 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-24 w-[32rem] h-[32rem] bg-amber-300/20 rounded-full blur-3xl" />
        <div className="hero-blob-slow absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-indigo-300/25 rounded-full blur-3xl" />
      </div>

      <div className="relative z-[1]">
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
