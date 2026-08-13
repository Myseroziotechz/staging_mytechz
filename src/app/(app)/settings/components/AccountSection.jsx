'use client'

import { useEffect, useRef, useState } from 'react'
import SectionCard from '@/app/(app)/profile/components/shared/SectionCard'
import { EditActions } from '@/app/(app)/profile/components/shared/Actions'
import { TextInput } from '@/app/(app)/profile/components/shared/Fields'
import { Alert } from '@/app/(app)/profile/components/shared/Feedback'
import { saveAbout } from '@/app/(app)/profile/lib/profile-api'
import Avatar from '@/components/ui/Avatar'
import { AVATAR_UPDATED_EVENT } from '@/lib/avatar-events'
import useSettingsForm from '../hooks/useSettingsForm'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const FIELDS = ['full_name', 'phone', 'location', 'headline']

function toForm(profile) {
  const form = {}
  for (const key of FIELDS) form[key] = profile?.[key] ?? ''
  return form
}

export default function AccountSection({ email, initialProfile }) {
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? null)
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingPreview, setPendingPreview] = useState(null)
  const [pendingRemove, setPendingRemove] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarError, setAvatarError] = useState(null)
  const [avatarSuccess, setAvatarSuccess] = useState(null)
  const fileInputRef = useRef(null)

  const {
    data: profile, form, setField, isEditing, saving, error, successMsg, fieldErrors,
    startEditing, cancelEditing, save,
  } = useSettingsForm({
    initialData: initialProfile,
    toForm,
    save: (values) => saveAbout(values),
  })

  // Revoke the local preview URL on unmount / when replaced, so it doesn't leak.
  useEffect(() => () => { if (pendingPreview) URL.revokeObjectURL(pendingPreview) }, [pendingPreview])

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarError('Supported formats: JPG, PNG, WEBP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2MB.')
      return
    }

    setAvatarError(null)
    setAvatarSuccess(null)
    setPendingRemove(false)
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(file)
    setPendingPreview(URL.createObjectURL(file))
  }

  function handleAvatarRemoveStage() {
    setAvatarError(null)
    setAvatarSuccess(null)
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
    setPendingRemove(true)
  }

  function handleCancelPending() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
    setPendingRemove(false)
    setAvatarError(null)
  }

  async function handleAvatarSave() {
    setAvatarBusy(true)
    setAvatarError(null)
    setAvatarSuccess(null)
    try {
      let nextUrl
      if (pendingRemove) {
        const res = await fetch('/api/settings/avatar', { method: 'DELETE' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Could not remove image.')
        nextUrl = data.avatar_url
      } else if (pendingFile) {
        const formData = new FormData()
        formData.append('file', pendingFile)
        const res = await fetch('/api/settings/avatar', { method: 'POST', body: formData })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Could not upload image.')
        nextUrl = data.avatar_url
      } else {
        return
      }

      if (pendingPreview) URL.revokeObjectURL(pendingPreview)
      setAvatarUrl(nextUrl)
      setPendingFile(null)
      setPendingPreview(null)
      setPendingRemove(false)
      setAvatarSuccess(pendingRemove ? 'Profile picture removed.' : 'Profile picture saved.')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: { avatarUrl: nextUrl } }))
      }
    } catch (err) {
      setAvatarError(err.message)
    } finally {
      setAvatarBusy(false)
    }
  }

  const hasPendingChange = Boolean(pendingFile) || pendingRemove
  const displaySrc = pendingPreview || (pendingRemove ? null : avatarUrl)

  return (
    <SectionCard
      title="Account"
      icon={ICON}
      isEditing={isEditing}
      onEdit={startEditing}
      error={error}
      successMsg={successMsg}
    >
      <div className="space-y-5">
        {/* Avatar — always editable, independent of the form's edit mode */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-4">
            <Avatar src={displaySrc} name={profile?.full_name || email} size="lg" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarBusy}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {avatarUrl || pendingPreview ? 'Replace photo' : 'Upload photo'}
                </button>
                {displaySrc && (
                  <button
                    type="button"
                    onClick={handleAvatarRemoveStage}
                    disabled={avatarBusy}
                    className="text-xs font-medium text-gray-400 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">JPG, PNG or WEBP. Max 2MB.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {avatarError && <Alert tone="error">{avatarError}</Alert>}
          {avatarSuccess && <Alert tone="success">{avatarSuccess}</Alert>}

          {hasPendingChange && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAvatarSave}
                disabled={avatarBusy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {avatarBusy ? 'Saving…' : 'Save Profile Picture'}
              </button>
              <button
                type="button"
                onClick={handleCancelPending}
                disabled={avatarBusy}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <TextInput
              label="Full Name"
              required
              value={form.full_name}
              error={fieldErrors.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
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
                label="City / Location"
                placeholder="Bengaluru"
                value={form.location}
                error={fieldErrors.location}
                onChange={(e) => setField('location', e.target.value)}
              />
            </div>
            <TextInput
              label="Profile Headline"
              placeholder="Frontend Dev | React | Open to opportunities"
              value={form.headline}
              error={fieldErrors.headline}
              onChange={(e) => setField('headline', e.target.value)}
            />
            <EditActions onSave={save} onCancel={cancelEditing} saving={saving} />
          </div>
        ) : (
          <dl className="space-y-3">
            <Row label="Full name" value={profile?.full_name} />
            <Row label="Email" value={email} hint="Managed via your sign-in provider" />
            <Row label="Phone" value={profile?.phone} />
            <Row label="Location" value={profile?.location} />
            <Row label="Headline" value={profile?.headline} />
          </dl>
        )}
      </div>
    </SectionCard>
  )
}

function Row({ label, value, hint }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <dt className="text-xs font-medium text-gray-400 sm:w-28 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-700 min-w-0">
        {value || <span className="text-gray-400">Not set</span>}
        {hint && <span className="ml-2 text-[11px] text-gray-400">{hint}</span>}
      </dd>
    </div>
  )
}
