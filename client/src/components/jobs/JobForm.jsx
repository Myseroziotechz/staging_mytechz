'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FORM_DEFAULTS } from '@/lib/jobs/schema'
import { localSuggest, POPULAR_SKILLS } from '@/lib/jobs/popular-skills'

const POPULAR_CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai',
  'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi',
  'Indore', 'Chandigarh', 'Coimbatore', 'Trivandrum',
]
const POPULAR_INDUSTRIES = [
  'Software / IT', 'Fintech', 'Healthcare', 'E-commerce', 'EdTech',
  'Manufacturing', 'Banking', 'Telecom', 'Media', 'Real Estate',
  'Consulting', 'Logistics', 'Retail', 'Automotive', 'Energy', 'Government',
]
const POPULAR_DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales',
  'Customer Support', 'Operations', 'Finance', 'HR', 'Legal',
]

const TYPES = [
  {
    key: 'private',
    label: 'Private Job',
    desc: 'Standard role at a private company',
    icon: '💼',
    accent: 'blue',
  },
  {
    key: 'government',
    label: 'Government',
    desc: 'PSU / sarkari notification',
    icon: '🏛️',
    accent: 'amber',
    adminOnly: true,
  },
  {
    key: 'internship',
    label: 'Internship',
    desc: 'Stipend + duration based',
    icon: '🎓',
    accent: 'emerald',
  },
  {
    key: 'ai',
    label: 'AI Pick',
    desc: 'Curated featured card',
    icon: '✨',
    accent: 'purple',
    adminOnly: true,
  },
]

const ACCENT = {
  blue: 'border-blue-500 bg-blue-50 text-blue-700',
  amber: 'border-amber-500 bg-amber-50 text-amber-700',
  emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  purple: 'border-purple-500 bg-purple-50 text-purple-700',
}

function FieldRow({ label, name, error, hint, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition'

function Input({ name, value, onChange, type = 'text', list, ...rest }) {
  return (
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(name, e.target.value)}
      className={inputClass}
      list={list}
      autoComplete={list ? 'off' : undefined}
      {...rest}
    />
  )
}

function NumberInput({ name, value, onChange, ...rest }) {
  return (
    <input
      type="number"
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(name, e.target.value)}
      className={inputClass}
      {...rest}
    />
  )
}

function Select({ name, value, onChange, options, ...rest }) {
  return (
    <select
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(name, e.target.value)}
      className={inputClass}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function TextArea({ name, value, onChange, rows = 4, ...rest }) {
  return (
    <textarea
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(name, e.target.value)}
      rows={rows}
      className={inputClass}
      {...rest}
    />
  )
}

function SkillsInput({ value, onChange }) {
  const [draft, setDraft] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const debounceRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    const q = draft.trim()
    let cancelled = false
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q) {
      // Defer to a microtask so we're not setting state synchronously inside
      // the effect body (Next 16 / React 19 lint rule).
      const handle = setTimeout(() => {
        if (!cancelled) setSuggestions([])
      }, 0)
      return () => {
        cancelled = true
        clearTimeout(handle)
      }
    }
    const local = localSuggest(q, value)
    debounceRef.current = setTimeout(async () => {
      if (cancelled) return
      setSuggestions(local)
      setActiveIdx(0)
      try {
        const res = await fetch(
          `/api/skills/suggest?q=${encodeURIComponent(q)}`,
          { credentials: 'same-origin' }
        )
        if (cancelled) return
        const data = await res.json()
        const exclude = new Set(value.map((s) => s.toLowerCase()))
        const have = new Set(local.map((s) => s.toLowerCase()))
        const dynamic = (data.suggestions || []).filter(
          (s) => !have.has(s.toLowerCase()) && !exclude.has(s.toLowerCase())
        )
        if (!cancelled) setSuggestions([...local, ...dynamic].slice(0, 10))
      } catch {}
    }, 180)
    return () => {
      cancelled = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [draft, value])

  function add(skill) {
    const t = (skill ?? draft).trim()
    if (!t) return
    if (value.length >= 15) return
    if (value.some((s) => s.toLowerCase() === t.toLowerCase())) return
    onChange('skills', [...value, t])
    setDraft('')
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="space-y-2" ref={wrapRef}>
      <div className="flex flex-wrap gap-1.5">
        {value.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
          >
            {s}
            <button
              type="button"
              onClick={() =>
                onChange(
                  'skills',
                  value.filter((v) => v !== s)
                )
              }
              className="text-blue-400 hover:text-blue-700"
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (open && suggestions.length) {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIdx((i) => (i + 1) % suggestions.length)
                  return
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIdx(
                    (i) => (i - 1 + suggestions.length) % suggestions.length
                  )
                  return
                }
                if (e.key === 'Tab' && suggestions[activeIdx]) {
                  e.preventDefault()
                  add(suggestions[activeIdx])
                  return
                }
              }
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                if (open && suggestions[activeIdx]) add(suggestions[activeIdx])
                else add()
              } else if (e.key === 'Escape') {
                setOpen(false)
              } else if (
                e.key === 'Backspace' &&
                draft === '' &&
                value.length
              ) {
                onChange('skills', value.slice(0, -1))
              }
            }}
            placeholder={
              value.length >= 15
                ? 'Max 15 skills'
                : 'Type to search · Enter to add · ↑↓ to pick'
            }
            disabled={value.length >= 15}
            className={inputClass}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => add()}
            disabled={!draft.trim() || value.length >= 15}
            className="shrink-0 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {open && suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {suggestions.map((s, i) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => add(s)}
                className={`block w-full text-left text-sm px-3 py-2 ${
                  i === activeIdx
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {value.length === 0 && draft === '' && (
        <div className="flex flex-wrap gap-1 pt-1">
          <span className="text-[11px] text-slate-400 mr-1 self-center">
            Quick add:
          </span>
          {POPULAR_SKILLS.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function JobForm({
  mode = 'recruiter', // 'recruiter' | 'admin'
  action, // server action: (payload) => { ok, job?, errors? }
  initial = null,
}) {
  const router = useRouter()
  const [form, setForm] = useState({ ...FORM_DEFAULTS, ...(initial || {}) })
  const [errors, setErrors] = useState({})
  const [submitting, startTransition] = useTransition()
  const [success, setSuccess] = useState(null)
  const [needsApproval, setNeedsApproval] = useState(false)

  const visibleTypes = useMemo(
    () => TYPES.filter((t) => mode === 'admin' || !t.adminOnly),
    [mode]
  )

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }))
  }
  function setGov(name, value) {
    setForm((f) => ({
      ...f,
      government_meta: { ...f.government_meta, [name]: value },
    }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }))
  }

  function pickType(key) {
    set('category', key)
    if (key === 'internship') set('job_type', 'internship')
    else if (form.job_type === 'internship') set('job_type', 'full_time')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess(null)
    startTransition(async () => {
      const res = await action(form)
      if (res?.ok) {
        setSuccess(res.job)
        setNeedsApproval(!!res.pending)
      } else {
        setErrors(res?.errors || { _form: 'Something went wrong' })
        // Scroll to first error.
        setTimeout(() => {
          document
            .querySelector('[data-error="true"]')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50)
      }
    })
  }

  if (success) {
    const liveHref =
      success.category && success.slug
        ? `/jobs/${success.category}/${success.slug}`
        : null
    const dashHref = mode === 'admin' ? '/admin/dashboard' : '/recruiter/dashboard'
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div
          className={`w-20 h-20 ${needsApproval ? 'bg-amber-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <svg
            className={`w-10 h-10 ${needsApproval ? 'text-amber-600' : 'text-emerald-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                needsApproval
                  ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  : 'M5 13l4 4L19 7'
              }
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {needsApproval ? 'Submitted for review' : 'Card is live!'}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {needsApproval
            ? "Your company isn't verified yet, so an admin will approve this card before it's listed publicly. You can already see it on your dashboard."
            : 'Your card is published and visible on the public listings.'}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {liveHref && !needsApproval && (
            <Link
              href={liveHref}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              View live card →
            </Link>
          )}
          <Link
            href={dashHref}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
          >
            Go to dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(null)
              setNeedsApproval(false)
              setForm({ ...FORM_DEFAULTS })
            }}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition"
          >
            Post another
          </button>
        </div>
      </div>
    )
  }

  const cat = form.category

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {mode === 'admin' ? 'Create Job Card' : 'Post a Job'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'admin'
            ? 'Posts go live immediately. AI/Government cards are admin-only.'
            : 'Your post will be reviewed before going live.'}
        </p>
      </header>

      {errors._form && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errors._form}
        </div>
      )}

      {/* ── Step 1: type ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          1. Card type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {visibleTypes.map((t) => {
            const active = cat === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => pickType(t.key)}
                className={`text-left p-3 rounded-xl border-2 transition ${
                  active
                    ? ACCENT[t.accent]
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-xl">{t.icon}</div>
                <div className="text-sm font-semibold mt-1">{t.label}</div>
                <div className="text-[11px] opacity-70">{t.desc}</div>
              </button>
            )
          })}
        </div>
        {errors.category && (
          <p data-error="true" className="text-xs text-rose-600">
            {errors.category}
          </p>
        )}
      </section>

      {/* ── Step 2: basics ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          2. Basics
        </h2>

        {mode === 'admin' && (
          <FieldRow label="Company name" name="company_name">
            <Input
              name="company_name"
              value={form.company_name || ''}
              onChange={set}
              placeholder="e.g. Acme Cloud Labs"
            />
          </FieldRow>
        )}

        <FieldRow
          label="Job title"
          name="title"
          required
          error={errors.title}
        >
          <Input
            name="title"
            value={form.title}
            onChange={set}
            placeholder="e.g. Senior React Developer"
          />
        </FieldRow>

        <FieldRow label="One-line summary" name="summary" hint="Max 280 chars">
          <Input
            name="summary"
            value={form.summary}
            onChange={set}
            placeholder="Build the next-gen MyTechZ web app with our React team."
            maxLength={280}
          />
        </FieldRow>

        <FieldRow
          label="Description"
          name="description"
          required
          error={errors.description}
          hint="Markdown supported"
        >
          <TextArea
            name="description"
            value={form.description}
            onChange={set}
            rows={6}
            placeholder="Responsibilities, what you'll do, what we're looking for…"
          />
        </FieldRow>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cat !== 'internship' && (
            <FieldRow label="Job type" required error={errors.job_type}>
              <Select
                name="job_type"
                value={form.job_type}
                onChange={set}
                options={[
                  { value: 'full_time', label: 'Full-time' },
                  { value: 'part_time', label: 'Part-time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'temporary', label: 'Temporary' },
                ]}
              />
            </FieldRow>
          )}
          <FieldRow label="Work mode" required error={errors.work_mode}>
            <Select
              name="work_mode"
              value={form.work_mode}
              onChange={set}
              options={[
                { value: 'onsite', label: 'On-site' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'remote', label: 'Remote' },
              ]}
            />
          </FieldRow>
          <FieldRow label="Openings">
            <NumberInput
              name="openings"
              value={form.openings}
              onChange={set}
              min={1}
            />
          </FieldRow>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldRow
            label="City"
            error={errors.location_city}
            required={form.work_mode !== 'remote'}
          >
            <Input
              name="location_city"
              value={form.location_city}
              onChange={set}
              placeholder="Bengaluru"
              list="jobform-cities"
            />
            <datalist id="jobform-cities">
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </FieldRow>
          <FieldRow label="State">
            <Input
              name="location_state"
              value={form.location_state}
              onChange={set}
              placeholder="Karnataka"
            />
          </FieldRow>
          <FieldRow label="Country">
            <Input
              name="location_country"
              value={form.location_country}
              onChange={set}
            />
          </FieldRow>
        </div>

        <FieldRow label="Skills" hint="Press Enter or comma to add (max 15)">
          <SkillsInput value={form.skills} onChange={set} />
        </FieldRow>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldRow label="Department" hint="Optional — helps candidates filter">
            <Input
              name="department"
              value={form.department}
              onChange={set}
              placeholder="Engineering"
              list="jobform-departments"
            />
            <datalist id="jobform-departments">
              {POPULAR_DEPARTMENTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </FieldRow>
          <FieldRow label="Industry">
            <Input
              name="industry"
              value={form.industry}
              onChange={set}
              placeholder="Software / IT"
              list="jobform-industries"
            />
            <datalist id="jobform-industries">
              {POPULAR_INDUSTRIES.map((i) => (
                <option key={i} value={i} />
              ))}
            </datalist>
          </FieldRow>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldRow label="Min experience (yrs)">
            <NumberInput
              name="experience_min"
              value={form.experience_min}
              onChange={set}
              min={0}
              step={0.5}
            />
          </FieldRow>
          <FieldRow label="Max experience (yrs)" error={errors.experience_max}>
            <NumberInput
              name="experience_max"
              value={form.experience_max}
              onChange={set}
              min={0}
              step={0.5}
            />
          </FieldRow>
          <FieldRow label="Application deadline">
            <Input
              name="application_deadline"
              type="date"
              value={form.application_deadline}
              onChange={set}
            />
          </FieldRow>
        </div>
      </section>

      {/* ── Step 3: type-specific ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          3. {cat === 'internship' ? 'Internship details' : cat === 'government' ? 'Government notification' : cat === 'ai' ? 'AI curation' : 'Compensation'}
        </h2>

        {(cat === 'private' || cat === 'ai') && (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_salary_disclosed}
                onChange={(e) => set('is_salary_disclosed', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Disclose salary on the card
            </label>
            {form.is_salary_disclosed && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <FieldRow label="Min salary (₹/yr)" error={errors.salary_min}>
                  <NumberInput
                    name="salary_min"
                    value={form.salary_min}
                    onChange={set}
                    placeholder="800000"
                  />
                </FieldRow>
                <FieldRow label="Max salary (₹/yr)" error={errors.salary_max}>
                  <NumberInput
                    name="salary_max"
                    value={form.salary_max}
                    onChange={set}
                    placeholder="1500000"
                  />
                </FieldRow>
                <FieldRow label="Currency">
                  <Select
                    name="salary_currency"
                    value={form.salary_currency}
                    onChange={set}
                    options={[
                      { value: 'INR', label: 'INR ₹' },
                      { value: 'USD', label: 'USD $' },
                    ]}
                  />
                </FieldRow>
                <FieldRow label="Period">
                  <Select
                    name="salary_period"
                    value={form.salary_period}
                    onChange={set}
                    options={[
                      { value: 'year', label: 'Per year' },
                      { value: 'month', label: 'Per month' },
                    ]}
                  />
                </FieldRow>
              </div>
            )}
          </>
        )}

        {cat === 'internship' && (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_salary_disclosed}
                onChange={(e) => set('is_salary_disclosed', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Paid internship
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {form.is_salary_disclosed && (
                <>
                  <FieldRow label="Min stipend (₹/mo)" error={errors.stipend_min}>
                    <NumberInput
                      name="stipend_min"
                      value={form.stipend_min}
                      onChange={set}
                      placeholder="15000"
                    />
                  </FieldRow>
                  <FieldRow label="Max stipend (₹/mo)">
                    <NumberInput
                      name="stipend_max"
                      value={form.stipend_max}
                      onChange={set}
                      placeholder="25000"
                    />
                  </FieldRow>
                </>
              )}
              <FieldRow
                label="Duration (months)"
                required
                error={errors.duration_months}
              >
                <NumberInput
                  name="duration_months"
                  value={form.duration_months}
                  onChange={set}
                  min={1}
                  placeholder="6"
                />
              </FieldRow>
              <FieldRow label="PPO chance (%)">
                <NumberInput
                  name="ppo_chance"
                  value={form.ppo_chance}
                  onChange={set}
                  min={0}
                  max={100}
                  placeholder="40"
                />
              </FieldRow>
            </div>
          </>
        )}

        {cat === 'government' && (
          <div className="space-y-4">
            <FieldRow
              label="Notification URL (PDF)"
              required
              error={errors.notification_url}
            >
              <Input
                name="notification_url"
                value={form.government_meta.notification_url}
                onChange={(_, v) => setGov('notification_url', v)}
                placeholder="https://example.gov.in/notification.pdf"
              />
            </FieldRow>
            <FieldRow
              label="Department"
              required
              error={errors.department}
            >
              <Input
                name="department"
                value={form.government_meta.department}
                onChange={(_, v) => setGov('department', v)}
                placeholder="Indian Railways"
              />
            </FieldRow>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <FieldRow label="Vacancies">
                <NumberInput
                  name="vacancies"
                  value={form.government_meta.vacancies}
                  onChange={(_, v) => setGov('vacancies', v)}
                />
              </FieldRow>
              <FieldRow label="Age limit">
                <NumberInput
                  name="age_max"
                  value={form.government_meta.age_max}
                  onChange={(_, v) => setGov('age_max', v)}
                />
              </FieldRow>
              <FieldRow label="Application fee (₹)">
                <NumberInput
                  name="application_fee"
                  value={form.government_meta.application_fee}
                  onChange={(_, v) => setGov('application_fee', v)}
                />
              </FieldRow>
              <FieldRow label="Exam date">
                <Input
                  type="date"
                  name="exam_date"
                  value={form.government_meta.exam_date}
                  onChange={(_, v) => setGov('exam_date', v)}
                />
              </FieldRow>
            </div>
          </div>
        )}

        {cat === 'ai' && (
          <FieldRow
            label="Curation reason"
            required
            error={errors.curation_reason}
            hint="Why this is an AI pick (shown on the card)"
          >
            <TextArea
              name="curation_reason"
              value={form.curation_reason}
              onChange={set}
              rows={2}
              placeholder="Hand-picked because it matches our top-trending React + AI stack."
            />
          </FieldRow>
        )}
      </section>

      {/* ── Step 4: apply ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          4. How candidates apply
        </h2>
        <FieldRow label="Apply mode" required error={errors.apply_mode}>
          <Select
            name="apply_mode"
            value={form.apply_mode}
            onChange={set}
            options={[
              { value: 'internal', label: 'On MyTechZ (recommended)' },
              { value: 'external', label: 'Redirect to company URL' },
              { value: 'email', label: 'Send to email' },
              { value: 'phone', label: 'Phone' },
            ]}
          />
        </FieldRow>
        {form.apply_mode === 'external' && (
          <FieldRow label="Apply URL" required error={errors.apply_url}>
            <Input
              name="apply_url"
              value={form.apply_url}
              onChange={set}
              placeholder="https://company.com/careers/role-id"
            />
          </FieldRow>
        )}
        {form.apply_mode === 'email' && (
          <FieldRow label="Apply email" required error={errors.apply_email}>
            <Input
              name="apply_email"
              type="email"
              value={form.apply_email}
              onChange={set}
              placeholder="careers@company.com"
            />
          </FieldRow>
        )}
        {form.apply_mode === 'phone' && (
          <FieldRow label="Apply phone" required error={errors.apply_phone}>
            <Input
              name="apply_phone"
              value={form.apply_phone}
              onChange={set}
              placeholder="+91 98765 43210"
            />
          </FieldRow>
        )}
      </section>

      {/* ── Admin extras ── */}
      {mode === 'admin' && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Admin
          </h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_urgent}
                onChange={(e) => set('is_urgent', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Urgent
            </label>
            <label className="flex items-center gap-2 text-sm ml-auto">
              <span className="text-slate-600">Status</span>
              <Select
                name="status"
                value={form.status}
                onChange={set}
                options={[
                  { value: 'active', label: 'Publish now' },
                  { value: 'pending_approval', label: 'Save as pending' },
                ]}
              />
            </label>
          </div>
        </section>
      )}

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition shadow-sm shadow-blue-700/20"
        >
          {submitting
            ? 'Saving…'
            : mode === 'admin'
              ? 'Publish card'
              : 'Submit for review'}
        </button>
      </div>
    </form>
  )
}
