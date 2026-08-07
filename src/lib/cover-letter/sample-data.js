/**
 * Sample cover letter data used for template previews in the gallery and detail pages.
 */
export const SAMPLE_COVER_LETTER_DATA = {
  sender: {
    fullName: 'Priya Sharma',
    headline: 'Senior Software Engineer',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/priyasharma',
    portfolio: 'priyasharma.dev',
  },
  recipient: {
    hiringManagerName: 'Anjali Mehta',
    hiringManagerTitle: 'Engineering Manager',
    companyName: 'Flipkart',
    companyLocation: 'Bengaluru, India',
    jobTitle: 'Senior Frontend Engineer',
    jobRef: 'FK-2026-1142',
    date: '7 August 2026',
  },
  letter: {
    greeting: 'Dear Ms. Mehta,',
    opening:
      "I am writing to apply for the Senior Frontend Engineer role at Flipkart. With over four years of experience building scalable React applications, I'm excited about the opportunity to contribute to your platform team.",
    body: [
      "In my current role, I led the migration of our checkout flow to a component-driven architecture, reducing page load time by 40% and cutting production bugs by a third. I've also mentored two junior engineers and driven adoption of automated testing across our team.",
      "What draws me to Flipkart specifically is the scale at which your team operates and the emphasis on performance for users across varying network conditions — a challenge I've tackled directly in my current work and would love to bring to your team.",
    ],
    closing:
      "I would welcome the chance to discuss how my experience aligns with your team's needs. Thank you for your time and consideration.",
    signOff: 'Sincerely,',
  },
}
