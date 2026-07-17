import HomeSection from './HomeSection'

const COMPANIES = [
  { name: 'DeHaat',    category: 'Agri-Tech',    initials: 'DH', bg: '#15803d' },
  { name: 'BharatPe',  category: 'FinTech',      initials: 'BP', bg: '#0ea5e9' },
  { name: 'Jivi.AI',   category: 'Health-Tech',  initials: 'JV', bg: '#f97316' },
  { name: 'Gojek',     category: 'Health-Tech',  initials: 'G',  outline: '#16a34a' },
  { name: 'Zomato',    category: 'Food-Tech',    initials: 'ZM', bg: '#ef4444' },
  { name: 'Razorpay',  category: 'FinTech',      initials: 'RP', bg: '#4f46e5' },
  { name: 'Meesho',    category: 'E-commerce',   initials: 'ME', bg: '#ec4899' },
  { name: 'CRED',      category: 'FinTech',      initials: 'CR', outline: '#0f172a' },
]

const ChevronDoubleLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18.75 19.5l-7.5-7.5 7.5-7.5" />
    <path d="M11.25 19.5l-7.5-7.5 7.5-7.5" />
  </svg>
)

const ChevronDoubleRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5.25 4.5l7.5 7.5-7.5 7.5" />
    <path d="M12.75 4.5l7.5 7.5-7.5 7.5" />
  </svg>
)

function StartupCard({ company }) {
  return (
    <div className="shrink-0 w-56 sm:w-60 bg-white border border-slate-200 rounded-2xl px-6 py-7 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div
        className="w-16 h-16 rounded-full ring-4 ring-slate-100 flex items-center justify-center font-bold text-lg shrink-0"
        style={
          company.outline
            ? { backgroundColor: '#fff', border: `2px solid ${company.outline}`, color: company.outline }
            : { backgroundColor: company.bg, color: '#fff' }
        }
      >
        {company.initials}
      </div>
      <p className="mt-4 font-bold text-slate-900">{company.name}</p>
      <p className="mt-0.5 text-sm text-slate-500">{company.category}</p>
      <button
        type="button"
        className="mt-5 px-5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors duration-200"
      >
        View
      </button>
    </div>
  )
}

export default function TopStartupsHiring() {
  const doubled = [...COMPANIES, ...COMPANIES]

  return (
    <HomeSection tone="light" pad="py-10 sm:py-14">
      <div className="flex items-center justify-center gap-3 mb-10">
        <ChevronDoubleLeft className="w-5 h-5 text-slate-300" />
        <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200">
          <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Top Startups Hiring</span>
        </div>
        <ChevronDoubleRight className="w-5 h-5 text-slate-300" />
      </div>

      <div className="relative overflow-hidden marquee-fade-edges">
        <div className="marquee-track flex gap-6 w-max" style={{ animationDuration: '45s' }}>
          {doubled.map((company, i) => (
            <StartupCard key={`${company.name}-${i}`} company={company} />
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
