import HomeSection from './HomeSection'

const EMPLOYERS = [
  'Acme Cloud Labs', 'Northwind Bank', 'Tata Helio', 'Pixel Pioneers',
  'UPSC', 'ISRO', 'SBI', 'Infosys', 'Zoho', 'Razorpay', 'Swiggy', 'Freshworks',
]

export default function VerifiedEmployersStrip() {
  return (
    <HomeSection tone="light" pad="py-10 sm:py-14">
      <div className="job-glass-panel rounded-2xl px-6 py-7 shadow-md shadow-blue-900/5">
        <div className="flex items-center justify-center gap-2 mb-4 text-xs uppercase tracking-wider text-slate-500">
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.5 2 3.2-.4 1 3 2.7 1.6-1.5 2.8.6 3.1-3 .8-1.7 2.7-2.8-1.5-3 .8-1.7-2.7-3-.8.6-3.1L1.3 8.2 4 6.6l1-3 3.2.4L10 2zm-1 11l5-5-1.4-1.4L9 10.2l-1.6-1.6L6 10l3 3z"/></svg>
          <span className="font-bold text-slate-700">Verified by MyTechz</span>
          <span className="text-slate-300">·</span>
          <span>Trusted by recruiters from</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {EMPLOYERS.map((name) => (
            <span key={name}
              className="text-sm sm:text-base font-semibold tracking-tight text-slate-500 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:text-slate-900 transition">
              {name}
            </span>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
