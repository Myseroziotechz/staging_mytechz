import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { OpenPanelComponent } from '@openpanel/nextjs'
import './globals.css'
import ClarityInit from '@/components/ClarityInit'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
    template: '%s | MyTechZ',
  },
  description:
    'Discover verified tech jobs, government vacancies, paid internships and AI career tools. 50,000+ opportunities from 500+ hiring partners across India.',
  keywords:
    'jobs, tech jobs, IT jobs, software developer jobs, government jobs, internships, India, AI resume builder, job portal, career platform',
  authors: [{ name: 'MyTechZ' }],
  creator: 'MyTechZ',
  publisher: 'MyTechZ',
  openGraph: {
    siteName: 'MyTechZ',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyTechZ — AI-Powered Job Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MyTechZ',
              alternateName: ['MyTechZ India', 'Mytechz Career Platform'],
              url: SITE,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE}/Mytechz_logo.png`,
                width: 200,
                height: 60,
              },
              description:
                'India\'s AI-powered career platform connecting tech talent with verified private and government job opportunities. AI job matching, expert mentorship, and free career tools for Indian job seekers.',
              foundingDate: '2023',
              foundingLocation: { '@type': 'Place', addressCountry: 'IN' },
              areaServed: { '@type': 'Country', name: 'India' },
              knowsAbout: [
                'Tech Jobs India',
                'Government Jobs India',
                'Paid Internships India',
                'AI Job Matching',
                'Smart Job Search',
                'AI Career Tools',
              ],
              sameAs: [
                process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/mytechz',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                url: `${SITE}/contact`,
                availableLanguage: ['English', 'Hindi'],
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'MyTechZ Free Career Services',
                itemListElement: [
                  { '@type': 'Offer', name: 'Free Job Search', description: 'Browse 50,000+ verified tech jobs in India.', price: '0', priceCurrency: 'INR', url: `${SITE}/jobs` },
                  { '@type': 'Offer', name: 'Smart Job Search', description: 'AI-powered job matching based on your skills and career goals.', price: '0', priceCurrency: 'INR', url: `${SITE}/ai-tools/smart-job-search` },
                ],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MyTechZ',
              url: SITE,
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/jobs/private?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SiteNavigationElement',
              name: 'Main Navigation',
              hasPart: [
                { '@type': 'SiteNavigationElement', name: 'Private Jobs', url: `${SITE}/jobs/private` },
                { '@type': 'SiteNavigationElement', name: 'Government Jobs', url: `${SITE}/jobs/government` },
                { '@type': 'SiteNavigationElement', name: 'Internships', url: `${SITE}/jobs/internship` },
                { '@type': 'SiteNavigationElement', name: 'AI Tools', url: `${SITE}/ai-tools` },
                { '@type': 'SiteNavigationElement', name: 'Smart Job Search', url: `${SITE}/ai-tools/smart-job-search` },
                { '@type': 'SiteNavigationElement', name: 'About', url: `${SITE}/about` },
                { '@type': 'SiteNavigationElement', name: 'Services', url: `${SITE}/services` },
                { '@type': 'SiteNavigationElement', name: 'Blog', url: `${SITE}/blog` },
                { '@type': 'SiteNavigationElement', name: 'Contact', url: `${SITE}/contact` },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClarityInit />
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
          trackScreenViews={true}
          trackOutgoingLinks={true}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-FXKXL6XP9H" />
    </html>
  )
}
