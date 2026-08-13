import HomeSection, { SectionHeader } from '@/components/home/HomeSection'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Informations — MyTechZ',
  description: 'Informations — MyTechZ',
  alternates: { canonical: `${SITE}/info` },
}

export default function InfoPage() {
  return (
    <main className="bg-white pt-24">
      <HomeSection tone="light">
        <SectionHeader title="Informations" />
      </HomeSection>
    </main>
  )
}
