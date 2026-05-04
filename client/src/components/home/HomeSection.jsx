/**
 * Shared shell for every home-page section.
 * Enforces identical container width, padding and rhythm.
 *
 * Variants:
 *   tone="light"  → transparent (lets the page premium gradient + grid show through)
 *   tone="surface" → soft white-ish glass card surface
 *   tone="dark"   → dark indigo gradient (visual break)
 *   tone="accent" → amber/indigo accent (visual break)
 *   tone="brand"  → blue gradient (CTA)
 */
export default function HomeSection({
  id,
  tone = 'light',
  width = 'max-w-7xl',
  pad  = 'py-16 sm:py-20',
  className = '',
  children,
}) {
  const toneClass =
    tone === 'dark'    ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white' :
    tone === 'accent'  ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50' :
    tone === 'brand'   ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' :
    tone === 'surface' ? 'bg-white/60 backdrop-blur-sm' :
                         '' // light = transparent

  return (
    <section id={id} className={`relative ${pad} ${toneClass} ${className}`}>
      {tone === 'dark' && (
        <>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(245,158,11,0.3), transparent 40%)',
          }} />
          <div className="pointer-events-none absolute inset-0 hero-grid opacity-20" />
        </>
      )}
      <div className={`relative ${width} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeader({ eyebrow, title, subtitle, eyebrowColor = 'text-blue-700' }) {
  return (
    <header className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && <span className={`text-xs font-bold uppercase tracking-wider ${eyebrowColor}`}>{eyebrow}</span>}
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-slate-600">{subtitle}</p>}
    </header>
  )
}
