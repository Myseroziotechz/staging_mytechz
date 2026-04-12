import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact - MyTechZ',
  description: 'Get in touch with the MyTechZ team. We would love to hear from you.',
}

export default function ContactPage() {
  return <ContactClient linkedinUrl={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/mytechz'} />
}
