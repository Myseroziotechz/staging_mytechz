'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import SectionCard from './shared/SectionCard'
import { EditActions } from './shared/Actions'
import { TextInput, TextArea } from './shared/Fields'
import { saveAbout } from '../lib/profile-api'
import { validateAbout } from '../lib/validation'
import { MAX_HEADLINE_LENGTH, MAX_ABOUT_LENGTH } from '../lib/constants'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const FIELDS = [
  'full_name', 'headline', 'about', 'phone', 'location',
  'linkedin_url', 'github_url', 'portfolio_url', 'total_experience_years',
]

function toForm(profile) {
  const form = {}
  for (const key of FIELDS) form[key] = profile?.[key] ?? ''
  return form
}

function DetailRow({ label, value, href }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs font-medium text-gray-400 sm:w-24 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-700 break-words min-w-0">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

/**
 * The About / personal-details block.
 *
 * This section previously didn't exist, and the personal fields lived in an
 * always-open form with no view mode and no Cancel. It now follows the same
 * view/edit contract as every other section.
 */
export default function AboutSection({ userId, initialProfile }) {
  const [profile, setProfile] = useState(initialProfile ?? null)
  const [form, setForm] = useState(() => toForm(initialProfile))
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const successTimer = useRef(null)
  const errorTimer = useRef(null)

  useEffect(
    () => () => {
      if (successTimer.current) clearTimeout(successTimer.current)
      if (errorTimer.current) clearTimeout(errorTimer.current)
    },
    [],
  )

  const flashSuccess = (msg) => {
    setSuccessMsg(msg)
    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSuccessMsg(null), 3000)
  }

  const flashError = (msg) => {
    setError(msg)
    if (errorTimer.current) clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(null), 6000)
  }

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const startEditing = () => {
    setForm(toForm(profile))
    setIsEditing(true)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }

  const cancelEditing = () => {
    setForm(toForm(profile))
    setIsEditing(false)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }

  const save = async () => {
    const errors = validateAbout(form)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      flashError('Please fix the highlighted fields before saving.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const saved = await saveAbout(form)
      if (saved) {
        setProfile(saved)
        setForm(toForm(saved))
      }
      setIsEditing(false)
      flashSuccess('Profile saved successfully.')
    } catch (err) {
      if (err?.fieldErrors) setFieldErrors(err.fieldErrors)
      flashError(err.message || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard
      title="About"
      icon={ICON}
      isEditing={isEditing}
      onEdit={startEditing}
      error={error}
      successMsg={successMsg}
    >
      {isEditing ? (
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            required
            placeholder="Naresh Raja"
            value={form.full_name}
            error={fieldErrors.full_name}
            onChange={(e) => setField('full_name', e.target.value)}
          />

          <TextInput
            label="Headline"
            hint={`(max ${MAX_HEADLINE_LENGTH} chars)`}
            maxLength={MAX_HEADLINE_LENGTH}
            placeholder="Frontend Dev | React | Open to opportunities"
            value={form.headline}
            error={fieldErrors.headline}
            onChange={(e) => setField('headline', e.target.value)}
          />

          <TextArea
            label="About"
            rows={4}
            maxLength={MAX_ABOUT_LENGTH}
            placeholder="A short summary of who you are, what you build, and what you're looking for…"
            value={form.about}
            error={fieldErrors.about}
            onChange={(e) => setField('about', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Phone"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              error={fieldErrors.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
            <TextInput
              label="City"
              placeholder="Bengaluru"
              value={form.location}
              error={fieldErrors.location}
              onChange={(e) => setField('location', e.target.value)}
            />
          </div>

          <TextInput
            label="Years of Experience"
            type="number"
            min="0"
            max="50"
            step="0.5"
            hint="(used to match you with jobs at the right level)"
            placeholder="e.g. 0 for fresher, 2.5 for 2.5 years"
            value={form.total_experience_years}
            error={fieldErrors.total_experience_years}
            onChange={(e) => setField('total_experience_years', e.target.value)}
          />

          <TextInput
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={form.linkedin_url}
            error={fieldErrors.linkedin_url}
            onChange={(e) => setField('linkedin_url', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="GitHub URL"
              type="url"
              placeholder="https://github.com/your-username"
              value={form.github_url}
              error={fieldErrors.github_url}
              onChange={(e) => setField('github_url', e.target.value)}
            />
            <TextInput
              label="Portfolio URL"
              type="url"
              placeholder="https://your-portfolio.com"
              value={form.portfolio_url}
              error={fieldErrors.portfolio_url}
              onChange={(e) => setField('portfolio_url', e.target.value)}
            />
          </div>

          <EditActions onSave={save} onCancel={cancelEditing} saving={saving} />
        </div>
      ) : (
        // Every About field is always visible in view mode too — no
        // "Add Details" teaser gating them behind an extra click.
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900">
            {profile?.full_name || 'Your name'}
          </h3>
          {profile?.headline && (
            <p className="text-sm font-medium text-gray-800">{profile.headline}</p>
          )}
          {profile?.about ? (
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {profile.about}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No summary added yet.</p>
          )}

          <dl className="space-y-2 pt-1">
            <DetailRow label="Phone" value={profile?.phone} />
            <DetailRow label="City" value={profile?.location} />
            <DetailRow
              label="Experience"
              value={
                profile?.total_experience_years != null
                  ? `${profile.total_experience_years} ${Number(profile.total_experience_years) === 1 ? 'year' : 'years'}`
                  : null
              }
            />
            <DetailRow label="LinkedIn" value={profile?.linkedin_url} href={profile?.linkedin_url} />
            <DetailRow label="GitHub" value={profile?.github_url} href={profile?.github_url} />
            <DetailRow label="Portfolio" value={profile?.portfolio_url} href={profile?.portfolio_url} />
          </dl>
        </div>
      )}
    </SectionCard>
  )
}
