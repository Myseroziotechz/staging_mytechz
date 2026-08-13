// Page Version: v1.0.0 | Last Updated: 2026-08-13
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SalaryCalculatorClient from '@/components/salary-calculator/SalaryCalculatorClient'
import { calculateSalaryBreakdown } from '@/lib/salary-calculator/calculate'
import { formatINR } from '@/lib/salary-calculator/format'
import { LPA_TIERS, lpaSlug, parseLpaSlug } from '@/lib/salary-calculator/lpaTiers'

const SITE = 'https://mytechz.com'

export async function generateStaticParams() {
  return LPA_TIERS.map((lpa) => ({ lpa: lpaSlug(lpa) }))
}

export async function generateMetadata({ params }) {
  const { lpa: slug } = await params
  const lpa = parseLpaSlug(slug)
  if (!lpa) return { title: 'Salary Calculator' }

  const result = calculateSalaryBreakdown({ ctc: lpa * 100000 })
  const title = `${lpa} LPA In-Hand Salary — Take Home Pay Calculator (FY 2026-27)`
  const description = `${lpa} LPA CTC gives roughly ${formatINR(result.inHand.monthly)}/month in-hand under the new tax regime. See the full salary breakup, old vs new regime comparison — free.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/ai-tools/salary-calculator/${slug}` },
    openGraph: { title, description, url: `${SITE}/ai-tools/salary-calculator/${slug}`, type: 'website', siteName: 'MyTechZ' },
    twitter: { card: 'summary_large_image' },
  }
}

function JsonLd({ lpa, result }) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Salary Calculator', item: `${SITE}/ai-tools/salary-calculator` },
      { '@type': 'ListItem', position: 4, name: `${lpa} LPA In-Hand Salary`, item: `${SITE}/ai-tools/salary-calculator/${lpaSlug(lpa)}` },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the in-hand salary for ${lpa} LPA?`,
        acceptedAnswer: { '@type': 'Answer', text: `For a ${lpa} LPA CTC under the new tax regime (default 40% Basic, metro city), in-hand salary works out to approximately ${formatINR(result.inHand.monthly)} per month, or ${formatINR(result.inHand.annual)} per year. This assumes standard PF and professional tax deductions — your exact figure depends on your company's specific salary structure.` },
      },
      {
        '@type': 'Question',
        name: `Do I pay income tax on ${lpa} LPA?`,
        acceptedAnswer: { '@type': 'Answer', text: result.isZeroTax ? `No — at ${lpa} LPA CTC, your taxable income after standard deduction typically stays under the ₹12L rebate threshold, so you pay ₹0 income tax under the new regime.` : `Yes — at ${lpa} LPA CTC, your estimated annual income tax under the new regime is approximately ${formatINR(result.deductions.incomeTax.annual)}. Use the calculator above to see how the old regime compares for your specific deductions.` },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}

export default async function LpaSalaryPage({ params }) {
  const { lpa: slug } = await params
  const lpa = parseLpaSlug(slug)
  if (!lpa || !LPA_TIERS.includes(lpa)) notFound()

  const result = calculateSalaryBreakdown({ ctc: lpa * 100000 })

  return (
    <>
      <JsonLd lpa={lpa} result={result} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-green-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools/salary-calculator" className="hover:text-green-700">Salary Calculator</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">{lpa} LPA</span>
        </nav>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-4">
            Free · Updated for FY 2026-27
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {lpa} LPA In-Hand Salary <span className="text-green-600">Calculator</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            A {lpa} LPA CTC works out to roughly <strong>{formatINR(result.inHand.monthly)}/month</strong> in-hand under the new tax regime.
            Adjust the numbers below to match your exact offer.
          </p>
        </div>

        <SalaryCalculatorClient initialValues={{ ctc: String(lpa * 100000), regime: 'new' }} />

        <section className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Other CTC tiers</h2>
          <div className="flex flex-wrap gap-2">
            {LPA_TIERS.map((tier) => (
              <Link
                key={tier}
                href={`/ai-tools/salary-calculator/${lpaSlug(tier)}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  tier === lpa ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-green-300'
                }`}
              >
                {tier} LPA
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
