'use client'

import { useEffect, useRef } from 'react'

export default function LegalModal({ type, onClose }) {
  const backdropRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  const isTerms = type === 'terms'

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {isTerms ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 text-sm text-gray-700 leading-relaxed legal-content">
          {isTerms ? <TermsContent /> : <PrivacyContent />}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 sm:px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">{children}</h3>
}

function P({ children }) {
  return <p className="mb-3">{children}</p>
}

function List({ items }) {
  return (
    <ul className="list-disc pl-5 mb-3 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function TermsContent() {
  return (
    <>
      <p className="text-xs text-gray-400 mb-4">Last updated: April 2026</p>

      <P>
        Welcome to MyTechZ. By accessing or using our platform, you agree to be
        bound by these Terms of Service. Please read them carefully before using
        our services.
      </P>

      <SectionTitle>1. Acceptance of Terms</SectionTitle>
      <P>
        By creating an account, accessing, or using any part of the MyTechZ
        platform (including the website, mobile applications, and APIs), you
        confirm that you have read, understood, and agree to these Terms. If you
        do not agree, you must not use our services.
      </P>

      <SectionTitle>2. Eligibility</SectionTitle>
      <List
        items={[
          'You must be at least 18 years of age to use this platform.',
          'You must provide accurate and complete registration information.',
          'You are responsible for maintaining the confidentiality of your account credentials.',
          'One person may not maintain more than one account per role (Candidate or Recruiter).',
        ]}
      />

      <SectionTitle>3. User Accounts and Roles</SectionTitle>
      <P>MyTechZ supports three user roles:</P>
      <List
        items={[
          'Candidates (Job Seekers) — can browse jobs, apply, upload resumes, and track applications.',
          'Recruiters (Employers) — can post jobs, manage applicants, and access recruiter tools after completing company verification.',
          'Administrators — platform operators with full access to manage users, recruiters, and content.',
        ]}
      />
      <P>
        Recruiter accounts require completion of a company profile and are
        subject to admin verification before job postings become publicly
        visible.
      </P>

      <SectionTitle>4. Job Listings and Applications</SectionTitle>
      <List
        items={[
          'Recruiters are solely responsible for the accuracy, legality, and content of their job postings.',
          'MyTechZ does not guarantee employment or placement for any candidate.',
          'Job postings must not contain discriminatory, misleading, or fraudulent content.',
          'MyTechZ reserves the right to remove any job listing that violates these Terms or applicable laws.',
          'Candidates acknowledge that submitting an application does not guarantee a response from the employer.',
        ]}
      />

      <SectionTitle>5. Resume and Personal Data</SectionTitle>
      <List
        items={[
          'Candidates may upload resumes and personal information to their profile.',
          'By uploading a resume, you grant MyTechZ the right to store and share it with recruiters you apply to.',
          'You may delete your resume and personal data at any time through your account settings.',
          'MyTechZ will not sell your resume data to third parties.',
        ]}
      />

      <SectionTitle>6. AI Tools</SectionTitle>
      <P>
        MyTechZ provides AI-powered tools including Resume Builder, Smart Job
        Search, and Resume Rank Checker. These tools are provided as-is and
        for informational purposes only. We do not guarantee the accuracy,
        completeness, or effectiveness of AI-generated content or suggestions.
      </P>

      <SectionTitle>7. Prohibited Conduct</SectionTitle>
      <P>You agree not to:</P>
      <List
        items={[
          'Use the platform for any unlawful purpose or to promote illegal activities.',
          'Post false, misleading, or fraudulent job listings or profile information.',
          'Scrape, crawl, or use automated tools to extract data from the platform.',
          'Attempt to gain unauthorized access to other user accounts or platform systems.',
          'Harass, abuse, or discriminate against other users.',
          'Upload malicious files, viruses, or harmful content.',
          'Impersonate another person or entity.',
        ]}
      />

      <SectionTitle>8. Intellectual Property</SectionTitle>
      <P>
        All content on MyTechZ — including logos, design, text, graphics, and
        software — is the property of MyTechZ or its licensors and is protected
        by intellectual property laws. You may not reproduce, distribute, or
        create derivative works without prior written consent.
      </P>

      <SectionTitle>9. Termination</SectionTitle>
      <P>
        MyTechZ reserves the right to suspend or terminate your account at any
        time, with or without notice, for any violation of these Terms. Upon
        termination, your right to use the platform ceases immediately. You may
        also delete your account at any time.
      </P>

      <SectionTitle>10. Limitation of Liability</SectionTitle>
      <P>
        MyTechZ is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis. We make no warranties, express or implied, regarding the
        platform&apos;s reliability, availability, or fitness for a particular
        purpose. MyTechZ shall not be liable for any indirect, incidental, or
        consequential damages arising from your use of the platform.
      </P>

      <SectionTitle>11. Changes to Terms</SectionTitle>
      <P>
        We may update these Terms from time to time. Continued use of the
        platform after changes are posted constitutes acceptance of the revised
        Terms. We will notify users of material changes via email or platform
        notification.
      </P>

      <SectionTitle>12. Governing Law</SectionTitle>
      <P>
        These Terms are governed by and construed in accordance with the laws of
        India. Any disputes arising from these Terms shall be subject to the
        exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
      </P>

      <SectionTitle>13. Contact</SectionTitle>
      <P>
        If you have any questions about these Terms, please contact us at{' '}
        <span className="font-medium text-blue-600">support@mytechz.com</span>.
      </P>
    </>
  )
}

function PrivacyContent() {
  return (
    <>
      <p className="text-xs text-gray-400 mb-4">Last updated: April 2026</p>

      <P>
        At MyTechZ, we take your privacy seriously. This Privacy Policy explains
        how we collect, use, store, and protect your personal information when
        you use our platform.
      </P>

      <SectionTitle>1. Information We Collect</SectionTitle>
      <P>We collect the following types of information:</P>

      <h4 className="font-semibold text-gray-800 mt-3 mb-1">a) Account Information</h4>
      <List
        items={[
          'Full name, email address, and phone number.',
          'Profile photo (if provided via Google OAuth).',
          'Role selection (Job Seeker or Recruiter).',
        ]}
      />

      <h4 className="font-semibold text-gray-800 mt-3 mb-1">b) Recruiter Information</h4>
      <List
        items={[
          'Company name, industry, size, and location.',
          'Designation / job title within the company.',
          'Company website, GST/CIN number (optional).',
          'Company description.',
        ]}
      />

      <h4 className="font-semibold text-gray-800 mt-3 mb-1">c) Candidate Information</h4>
      <List
        items={[
          'Resume / CV files uploaded to the platform.',
          'Job application history and saved jobs.',
          'Skills, experience, and preferences (when provided).',
        ]}
      />

      <h4 className="font-semibold text-gray-800 mt-3 mb-1">d) Automatically Collected Data</h4>
      <List
        items={[
          'IP address, browser type, and device information.',
          'Pages visited, time spent, and interaction patterns.',
          'Cookies and similar tracking technologies.',
        ]}
      />

      <SectionTitle>2. How We Use Your Information</SectionTitle>
      <List
        items={[
          'To create and manage your account.',
          'To match candidates with relevant job opportunities.',
          'To enable recruiters to post jobs and manage applicants.',
          'To provide AI-powered tools (Resume Builder, Smart Search, Resume Rank Checker).',
          'To send transactional emails (magic links, application updates).',
          'To improve and personalize your experience on the platform.',
          'To detect and prevent fraud, abuse, or security threats.',
          'To comply with legal obligations.',
        ]}
      />

      <SectionTitle>3. Information Sharing</SectionTitle>
      <P>We do not sell your personal data. We may share your information with:</P>
      <List
        items={[
          'Recruiters — when you apply to their job postings (your name, email, resume, and application details).',
          'Service providers — trusted third parties that help us operate the platform (hosting, email delivery, analytics).',
          'Legal authorities — when required by law, court order, or to protect our rights and safety.',
        ]}
      />

      <SectionTitle>4. Data Storage and Security</SectionTitle>
      <List
        items={[
          'Your data is stored securely using Supabase (PostgreSQL) with row-level security policies.',
          'Sensitive operations use service-role keys accessible only on the server side.',
          'Passwords are never stored — we use passwordless authentication (Google OAuth and magic links).',
          'We use HTTPS encryption for all data in transit.',
          'We regularly review and update our security practices.',
        ]}
      />

      <SectionTitle>5. Cookies</SectionTitle>
      <P>
        We use essential cookies to maintain your authentication session and
        remember your preferences (such as your intended login role). We do not
        use third-party advertising cookies. Session cookies are automatically
        deleted when you close your browser.
      </P>

      <SectionTitle>6. Your Rights</SectionTitle>
      <P>You have the right to:</P>
      <List
        items={[
          'Access — view all personal data we hold about you.',
          'Correction — update or correct your personal information.',
          'Deletion — request deletion of your account and all associated data.',
          'Portability — request a copy of your data in a portable format.',
          'Withdraw consent — opt out of non-essential data processing at any time.',
        ]}
      />
      <P>
        To exercise any of these rights, contact us at{' '}
        <span className="font-medium text-blue-600">privacy@mytechz.com</span>.
      </P>

      <SectionTitle>7. Data Retention</SectionTitle>
      <List
        items={[
          'Active accounts — data is retained for as long as your account is active.',
          'Deleted accounts — personal data is permanently removed within 30 days of account deletion.',
          'Application history — retained for 12 months after the job posting expires, then anonymized.',
          'Server logs — retained for up to 90 days for security and debugging purposes.',
        ]}
      />

      <SectionTitle>8. Children&apos;s Privacy</SectionTitle>
      <P>
        MyTechZ is not intended for users under 18 years of age. We do not
        knowingly collect personal information from minors. If we become aware
        that a minor has provided us with personal data, we will delete it
        promptly.
      </P>

      <SectionTitle>9. Third-Party Services</SectionTitle>
      <P>Our platform integrates with the following third-party services:</P>
      <List
        items={[
          'Google OAuth — for sign-in authentication.',
          'Supabase — for database and authentication services.',
          'Gmail SMTP — for sending transactional emails.',
        ]}
      />
      <P>
        Each third-party service has its own privacy policy. We encourage you to
        review their policies.
      </P>

      <SectionTitle>10. Changes to This Policy</SectionTitle>
      <P>
        We may update this Privacy Policy from time to time. We will notify you
        of significant changes via email or a prominent notice on the platform.
        Your continued use of MyTechZ after changes are posted constitutes
        acceptance of the updated policy.
      </P>

      <SectionTitle>11. Contact Us</SectionTitle>
      <P>
        For questions, concerns, or requests related to your privacy, contact us
        at:
      </P>
      <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3">
        <p className="font-medium text-gray-900">MyTechZ Privacy Team</p>
        <p className="text-gray-600">Email: privacy@mytechz.com</p>
        <p className="text-gray-600">Website: www.mytechz.com</p>
      </div>
    </>
  )
}
