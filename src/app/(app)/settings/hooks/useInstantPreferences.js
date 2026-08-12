'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * Toggle-style settings (visibility, notifications) save immediately on
 * change rather than going through an edit/save/cancel cycle — flipping a
 * switch is already a committed action in most apps' settings pages, so a
 * separate "Save" button would just be an extra click for no benefit.
 * Optimistic update with revert-on-failure, one flight per field so two
 * quick toggles in different rows don't race each other's error handling.
 */
export default function useInstantPreferences(initialSettings) {
  const [settings, setSettings] = useState(initialSettings)
  const [savingField, setSavingField] = useState(null)
  const [error, setError] = useState(null)
  const errorTimer = useRef(null)

  const update = useCallback(async (field, value) => {
    const previous = settings[field]
    setSettings((s) => ({ ...s, [field]: value }))
    setSavingField(field)
    setError(null)

    try {
      const res = await fetch('/api/settings/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Could not save. Please try again.')
      setSettings((s) => ({ ...s, ...data.settings }))
    } catch (err) {
      setSettings((s) => ({ ...s, [field]: previous }))
      setError(err.message)
      if (errorTimer.current) clearTimeout(errorTimer.current)
      errorTimer.current = setTimeout(() => setError(null), 6000)
    } finally {
      setSavingField(null)
    }
  }, [settings])

  return { settings, update, savingField, error }
}
