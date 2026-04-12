'use client'

import { useState, useRef } from 'react'

export default function ContactClient({ linkedinUrl }) {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ state: 'idle', error: '' })

  const handleMouseMove = (e) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'loading', error: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus({ state: 'success', error: '' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ state: 'error', error: err.message })
    }
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative -mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50"
    >
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), rgba(245,158,11,0.12), transparent 40%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 -left-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-delay absolute top-1/3 -right-20 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl" />
        <div className="hero-blob-slow absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:pt-40">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — intro + info cards */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="hero-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-blue-100 text-xs sm:text-sm font-medium text-blue-700 shadow-sm">
              <svg className="w-3.5 h-3.5 text-amber-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
              We&apos;d love to hear from you
            </span>

            <h1 className="hero-fade-up-d1 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Get in <span className="hero-gradient-text">Touch</span>
              <br />
              With Mytechz
            </h1>

            <p className="hero-fade-up-d2 mt-6 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Have a question about careers, webinars, or partnerships? Drop us a
              message and our team will get back to you within one business day.
            </p>

            {/* Info cards */}
            <div className="hero-fade-up-d3 mt-8 grid sm:grid-cols-2 gap-4 w-full max-w-lg">
              <InfoCard
                title="Email"
                value="contact@mytechz.com"
                href="mailto:contact@mytechz.com"
                icon={<MailIcon />}
              />
              <InfoCard
                title="LinkedIn"
                value="Follow us on LinkedIn"
                href={linkedinUrl}
                external
                icon={<LinkedInIcon />}
              />
              <InfoCard
                title="Location"
                value="India"
                icon={<PinIcon />}
              />
              <InfoCard
                title="Hours"
                value="Mon – Fri, 9am – 6pm"
                icon={<ClockIcon />}
              />
            </div>
          </div>

          {/* Right — form card */}
          <div className="hero-fade-up-d2 relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-300/30 via-blue-300/20 to-indigo-300/30 rounded-3xl blur-2xl opacity-70 pointer-events-none" />
            <form
              onSubmit={handleSubmit}
              className="relative bg-white/90 backdrop-blur rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Field
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
              />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.state === 'loading'}
                className="group relative w-full overflow-hidden py-3 px-6 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {status.state === 'loading' ? (
                    <>
                      <Spinner />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                      </svg>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </button>

              {status.state === 'success' && (
                <div className="hero-fade-up p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                  Thanks! Your message was sent — we&apos;ll be in touch shortly.
                </div>
              )}
              {status.state === 'error' && (
                <div className="hero-fade-up p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
                  {status.error || 'Something went wrong. Please try again.'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition-all"
      />
    </div>
  )
}

function InfoCard({ title, value, href, external, icon }) {
  const inner = (
    <div className="group relative bg-white/90 backdrop-blur rounded-2xl border border-slate-100 p-4 shadow-sm shadow-blue-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hover:border-amber-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center transition-colors group-hover:bg-amber-100 group-hover:text-amber-600">
          {icon}
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-0.5 text-xs text-slate-500">{value}</div>
        </div>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  )
}
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 01-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
