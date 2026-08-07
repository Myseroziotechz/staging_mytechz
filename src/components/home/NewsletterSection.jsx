import NewsletterSubscribe from '@/components/NewsletterSubscribe'

export default function NewsletterSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="job-glass-panel rounded-3xl px-6 py-12 text-center max-w-3xl mx-auto shadow-md shadow-blue-900/5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Job alerts</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Get matching jobs in your inbox.
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Weekly digest, fully personalized. Unsubscribe with one click.
          </p>
          <div className="mt-7">
            <NewsletterSubscribe />
          </div>
        </div>
      </div>
    </section>
  )
}
