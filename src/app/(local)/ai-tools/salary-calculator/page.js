// Page Version: v1.0.0 | Last Updated: 2026-08-13
import Link from 'next/link'
import SalaryCalculatorClient from '@/components/salary-calculator/SalaryCalculatorClient'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Salary Calculator India 2026-27 — CTC to In-Hand, Tax Comparison',
  description:
    'Calculate your in-hand salary from CTC instantly. Compare old vs new tax regime, see salary breakup with PF, HRA, TDS — free salary calculator for India FY 2026-27.',
  keywords:
    'salary calculator India, CTC to in-hand salary calculator, take home salary calculator, salary breakup calculator, new tax regime calculator 2026-27, in-hand salary calculator India',
  alternates: { canonical: `${SITE}/ai-tools/salary-calculator` },
  openGraph: {
    title: 'Free Salary Calculator India 2026-27 — CTC to In-Hand',
    description: 'Calculate your in-hand salary from CTC instantly. Compare old vs new tax regime — free, no login required.',
    url: `${SITE}/ai-tools/salary-calculator`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Salary Calculator' }],
  },
  twitter: { card: 'summary_large_image' },
}

const FAQ = [
  { q: 'What is in-hand salary for 12 LPA?', a: 'For a 12 LPA CTC under the new tax regime, in-hand salary works out to roughly ₹94,000-95,000 per month after PF and professional tax — and typically zero income tax, since taxable income after standard deduction stays under the ₹12L rebate threshold. Use the calculator above with your exact CTC for a precise figure.' },
  { q: 'How to calculate take-home salary from CTC?', a: 'Take-home salary = Gross Salary − Employee PF − Professional Tax − Income Tax (TDS). Gross Salary itself is your CTC minus the employer\'s contributions (Employer PF, Gratuity, and ESI if applicable), which are part of your CTC but never reach your bank account.' },
  { q: 'Old vs new tax regime — which is better in 2026?', a: 'The new regime usually wins for most salaried employees now, especially with the ₹75,000 standard deduction and zero tax up to ₹12.75L. The old regime can still work out better if you claim large deductions — HRA exemption, Section 80C investments (PPF, ELSS, EPF), and 80D health insurance. Use the comparison above to see which wins for your numbers.' },
  { q: 'What is the standard deduction for FY 2026-27?', a: '₹75,000 under the new tax regime, ₹50,000 under the old tax regime. This is subtracted from your gross salary before income tax is calculated, for every salaried employee, automatically — no proof or investment required.' },
  { q: 'How is HRA exemption calculated?', a: 'HRA exemption (old regime only) is the lowest of: actual HRA received, rent paid minus 10% of Basic salary, or 50% of Basic (metro) / 40% of Basic (non-metro). This calculator currently shows your HRA component but doesn\'t yet apply the exemption to old-regime tax — a full HRA exemption calculator is coming soon.' },
  { q: 'What is professional tax in India?', a: 'Professional Tax (PT) is a small state-level tax on salaried income, typically around ₹200/month, deducted directly from your salary. A few states — Tamil Nadu, Delhi, Haryana, Uttar Pradesh, Rajasthan — don\'t charge it at all. It\'s capped at ₹2,500/year everywhere by law.' },
  { q: 'Is PF deducted from CTC or salary?', a: 'Both, in different ways. Employer PF (12% of Basic, capped at ₹1,800/month) is part of your CTC but never hits your bank account — it goes straight to your EPF account. Employee PF (also 12% of Basic) is deducted from your Gross Salary and also goes to your EPF account, reducing your in-hand pay.' },
  { q: 'How much tax do I pay on 15 LPA?', a: 'Enter 1500000 as your CTC above for an exact figure — it depends on your regime choice, Basic salary %, and state. As a rough guide, most 15 LPA earners under the new regime pay somewhere in the ₹80,000-1,10,000/year range in income tax.' },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Salary Calculator', item: `${SITE}/ai-tools/salary-calculator` },
    ],
  }

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MyTechZ Salary Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/salary-calculator`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free CTC to in-hand salary calculator for India — compare old vs new tax regime, see full salary breakup.',
    provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
  }

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to calculate in-hand salary from CTC',
    step: [
      { '@type': 'HowToStep', name: 'Enter your CTC', text: 'Enter your annual Cost to Company (CTC) as mentioned in your offer letter.' },
      { '@type': 'HowToStep', name: 'Choose your tax regime', text: 'Select New Regime or Old Regime — the calculator shows both so you can compare.' },
      { '@type': 'HowToStep', name: 'Select your state and city type', text: 'This determines your Professional Tax and HRA calculation.' },
      { '@type': 'HowToStep', name: 'View your breakdown', text: 'See your monthly and annual in-hand salary, full breakup, and a visual chart of where your CTC goes.' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

export default async function SalaryCalculatorPage({ searchParams }) {
  const sp = (await searchParams) || {}

  return (
    <>
      <JsonLd />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-green-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Salary Calculator</span>
        </nav>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-4">
            Free · Updated for FY 2026-27
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Free Salary Calculator <span className="text-green-600">India</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            Enter your CTC and instantly see your monthly and annual in-hand salary, full breakup, and a side-by-side old vs new tax regime comparison — free, no login required.
          </p>
        </div>

        <SalaryCalculatorClient
          initialValues={{ ctc: sp.ctc, regime: sp.regime, state: sp.state, metro: sp.metro, basic: sp.basic }}
        />

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          <div className="space-y-3 max-w-4xl mx-auto">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900">
                  {q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Also explore</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            <Link href="/ai-tools/resume-builder" className="group bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-all">
              <h3 className="font-bold text-gray-900 group-hover:text-green-700 mb-1">Free Resume Builder</h3>
              <p className="text-sm text-gray-500">Build an ATS-ready resume — free, no watermarks.</p>
            </Link>
            <Link href="/jobs" className="group bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-all">
              <h3 className="font-bold text-gray-900 group-hover:text-green-700 mb-1">Browse Tech Jobs</h3>
              <p className="text-sm text-gray-500">50,000+ verified private and government tech jobs in India.</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
