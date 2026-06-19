const PARTNERS = [
  'Infosys', 'Zoho', 'TCS', 'Razorpay', 'Swiggy', 'Freshworks',
  'ISRO', 'Wipro', 'HCL', 'Flipkart', 'PhonePe', 'Meesho',
]

export default function VerifiedEmployersStrip() {
  const doubled = [...PARTNERS, ...PARTNERS]

  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold">
          <span className="text-indigo-600">Trusted by experts.</span>
          <br />
          <span className="text-slate-900">Used by the leaders.</span>
        </h2>
        <p className="mt-3 text-sm text-slate-400 tracking-wide">
          Partnered with India's top companies to connect you with real opportunities.
        </p>
      </div>

      {/* Scrolling logo strip */}
      <div className="relative z-10 overflow-hidden marquee-fade-edges mb-4">
        <div className="marquee-track flex gap-4 w-max">
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex items-center px-5 py-2.5 rounded-full border border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-default select-none group shrink-0"
            >
              <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 whitespace-nowrap transition-colors duration-200">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Arc glow — full width, subtle warm tint */}
      <div className="relative w-full h-48 mt-2 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 h-52 opacity-10"
          style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, #FBD89A 0%, #FDE9C9 50%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 opacity-15"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, #FDF6EC 0%, #FBD89A 60%, transparent 75%)' }}
        />
      </div>

    </section>
  )
}
