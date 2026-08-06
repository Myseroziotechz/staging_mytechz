'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * View/edit/save/cancel state for a single-object settings form — the same
 * contract as the profile page's AboutSection.jsx (SectionCard + EditActions
 * + Field primitives), generalised so both Account and Job Preferences can
 * reuse it instead of each re-implementing the same timers/error handling.
 */
export default function useSettingsForm({ initialData, toForm, save }) {
  const [data, setData] = useState(initialData)
  const [form, setForm] = useState(() => toForm(initialData))
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
    []
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
    setForm(toForm(data))
    setIsEditing(true)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }

  const cancelEditing = () => {
    setForm(toForm(data))
    setIsEditing(false)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }

  const doSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const saved = await save(form)
      if (saved) {
        setData(saved)
        setForm(toForm(saved))
      }
      setIsEditing(false)
      flashSuccess('Saved successfully.')
      return true
    } catch (err) {
      if (err?.fieldErrors) setFieldErrors(err.fieldErrors)
      flashError(err.message || 'Save failed. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    data,
    setData,
    form,
    setField,
    isEditing,
    saving,
    error,
    successMsg,
    fieldErrors,
    startEditing,
    cancelEditing,
    save: doSave,
  }
}
