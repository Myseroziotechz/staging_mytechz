import ContactClient from './ContactClient'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Contact MyTechZ — Get Support, Partnership & Feedback',
  description:
    'Contact the MyTechZ team for support with job applications, recruiter partnerships, platform feedback, or press enquiries. We respond within 24 hours.',
  keywords:
    'contact MyTechZ, MyTechZ support, job portal contact, recruiter partnership India, MyTechZ help',
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: 'Contact MyTechZ — Get Support, Partnership & Feedback',
    description: 'Reach out to MyTechZ for support with job applications, recruiter partnerships, platform feedback, or press enquiries.',
    url: `${SITE}/contact`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'Contact MyTechZ' }],
  },
  twitter: { card: 'summary_large_image' },
}

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE}/contact` },
    ],
  }

  const contactPage = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact MyTechZ',
    url: `${SITE}/contact`,
    description: 'Contact the MyTechZ team for support, recruiter partnerships, feedback, or press enquiries.',
    mainEntity: {
      '@type': 'Organization',
      name: 'MyTechZ',
      url: SITE,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: `${SITE}/contact`,
          availableLanguage: ['English', 'Hindi'],
          areaServed: 'IN',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          url: `${SITE}/contact`,
          description: 'Recruiter and hiring partner enquiries',
        },
      ],
    },
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How quickly does MyTechZ respond to support requests?',
        acceptedAnswer: { '@type': 'Answer', text: 'The MyTechZ team typically responds within 24 hours on business days. For urgent issues, please include "URGENT" in your message subject.' },
      },
      {
        '@type': 'Question',
        name: 'How can recruiters partner with MyTechZ?',
        acceptedAnswer: { '@type': 'Answer', text: 'Recruiters and companies can reach out via the contact form to discuss hiring partnerships, job posting packages, and AI-powered candidate screening. Our team will get back to you within 24 hours.' },
      },
      {
        '@type': 'Question',
        name: 'I have a problem with my job application. Who do I contact?',
        acceptedAnswer: { '@type': 'Answer', text: 'Use the contact form on this page, selecting "Support" as the category. Include your registered email and the job title. Our support team will help resolve the issue.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  )
}

export default function ContactPage() {
  return (
    <>
      <JsonLd />
      <ContactClient linkedinUrl={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/108975050/admin/notifications/comments/'} />
    </>
  )
}
