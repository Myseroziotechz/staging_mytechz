import HomeSection from './HomeSection'

const stats = [
  { value: '500+', label: 'Jobs Posted' },
  { value: '100+', label: 'Companies' },
  { value: '10K+', label: 'Candidates' },
  { value: '95%',  label: 'Success Rate' },
]

export default function StatsBar() {
  return (
    <HomeSection tone="light" pad="py-10 sm:py-14">
      <div className="job-glass-panel rounded-2xl px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-md shadow-blue-900/5">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl sm:text-4xl font-bold hero-gradient-text">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </HomeSection>
  )
}
