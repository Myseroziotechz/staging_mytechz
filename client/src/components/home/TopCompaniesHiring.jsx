import { getIndustryHiringPanels } from '@/lib/jobs/facets'
import HomeSection, { SectionHeader } from './HomeSection'
import CompaniesHiringCarousel from './CompaniesHiringCarousel'

export default async function TopCompaniesHiring() {
  const panels = await getIndustryHiringPanels(6)
  if (panels.length === 0) return null

  return (
    <HomeSection tone="light" pad="pt-2 pb-16 sm:pt-4 sm:pb-20">
      <SectionHeader title="Top companies hiring now" subtitle="Real openings, grouped by industry — updated as new roles go live." />
      <CompaniesHiringCarousel panels={panels} />
    </HomeSection>
  )
}
