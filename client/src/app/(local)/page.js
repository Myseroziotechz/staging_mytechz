// Page Version: v2.1.0 | Last Updated: 2026-07-14

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
  description:
    'Discover verified tech jobs, government vacancies, paid internships and AI career tools. 50,000+ opportunities from 500+ hiring partners across India.',
  keywords:
    'tech jobs India, AI job portal, government jobs India, paid internships India, free resume builder, IT jobs India, software developer jobs, verified job portal India, AI career tools',
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
    description: 'Discover verified tech jobs, government vacancies, paid internships and AI career tools.',
    url: `${SITE}/`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ — AI-Powered Job Portal India' }],
  },
  twitter: { card: 'summary_large_image' },
}

import HeroSection            from '@/components/home/HeroSection'
import TrendingJobs           from '@/components/home/TrendingJobs'
import VerifiedEmployersStrip from '@/components/home/VerifiedEmployersStrip'
import JobCategories          from '@/components/home/JobCategories'
import StatsBar               from '@/components/home/StatsBar'
import HowItWorks             from '@/components/home/HowItWorks'
import ForRecruiters          from '@/components/home/ForRecruiters'
import FaqAccordion           from '@/components/home/FaqAccordion'
import NewsletterSection      from '@/components/home/NewsletterSection'
import CallToAction           from '@/components/home/CallToAction'

const FAQ_ITEMS = [
  {
    q: 'Is MyTechZ free for job seekers?',
    a: 'Yes — MyTechZ is 100% free for candidates. Browse jobs, build resumes, and apply without any subscription or hidden fees.',
  },
  {
    q: 'What types of jobs are available on MyTechZ?',
    a: 'MyTechZ lists verified private-sector tech jobs, central and state government vacancies (UPSC, SSC, PSU, defence), paid internships for students and freshers, and AI-matched job recommendations.',
  },
  {
    q: 'How does AI job matching work?',
    a: 'Our AI reads your resume, skills, and preferences to calculate a fit score for every job. You see roles ranked by actual compatibility — not just keyword overlap.',
  },
  {
    q: 'Are the jobs verified?',
    a: 'Every listing is vetted by our team. We partner directly with companies and government portals to ensure jobs are legitimate, accurate, and up to date.',
  },
  {
    q: 'Can I build a resume on MyTechZ for free?',
    a: 'Yes. Our free AI Resume Builder creates ATS-optimised resumes with AI-powered bullet points, keyword suggestions, and clean PDF export — no watermarks, no paid tier.',
  },
  {
    q: 'How do I apply for government jobs on MyTechZ?',
    a: 'Browse the Government Jobs section for central, state, PSU, and defence vacancies with official notification numbers, exam dates, age limits, and links to download official PDFs.',
  },
]

function JsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyTechZ',
    url: SITE,
    logo: `${SITE}/Mytechz_logo.png`,
    description: 'India\'s AI-powered job portal connecting tech professionals with verified private and government jobs, paid internships, and free career tools.',
    sameAs: [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1200',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
    </>
  )
}

export default function Home() {
  return (
    <main className="bg-white">
      <JsonLd />
      <div>
        <HeroSection />
        <TrendingJobs />
        <JobCategories />
        <StatsBar />
        <HowItWorks />
        <VerifiedEmployersStrip />
        <ForRecruiters />
        <FaqAccordion />
        <NewsletterSection />
        <CallToAction />
      </div>
    </main>
  )
}
