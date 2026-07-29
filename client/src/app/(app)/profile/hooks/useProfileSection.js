'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { fetchSection, saveSection } from '../lib/profile-api'
import { NORMALISERS, FACTORIES, isBlankEntry } from '../lib/entries'
import { VALIDATORS, isValid } from '../lib/validation'
import { sortByRecency } from '../lib/format'

/**
 * State for one profile section: fetch, view/edit toggle, add/update/remove,
 * validation and save.
 *
 * Notable behaviours:
 * - Rows keep their `id`, so saving performs a diffed upsert server-side
 *   instead of wiping and re-inserting the section.
 * - Every fetched row is normalised, so nullable DB columns can't turn a
 *   controlled input into an uncontrolled one.
 * - Success and error messages own separate timers; previously they shared one
 *   ref, so an error would cancel a pending success message and vice versa.
 *
 * @param {Object}   options
 * @param {string}   options.section     - one of SECTIONS (education, projects, …)
 * @param {string}   options.userId      - current user's UUID; refetches when it changes
 * @param {string}   [options.ongoingFlag] - field name used for recency sorting
 */
export default function useProfileSection({ section, userId, ongoingFlag }) {
  const [entries, setEntries] = useState([])
  const [original, setOriginal] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const successTimer = useRef(null)
  const errorTimer = useRef(null)

  const normalise = NORMALISERS[section]
  const createEmpty = FACTORIES[section]
  const validate = VALIDATORS[section]

  // ── Fetch ──────────────────────────────────────────────────────────────
  const load = useCallback(
    (signal) => {
      setLoading(true)
      setError(null)
      return fetchSection(section, signal)
        .then((rows) => {
          if (signal?.aborted) return
          const list = (Array.isArray(rows) ? rows : []).map(normalise)
          const sorted = ongoingFlag ? sortByRecency(list, ongoingFlag) : list
          setEntries(sorted)
          setOriginal(sorted)
        })
        .catch((err) => {
          if (signal?.aborted || err?.name === 'AbortError') return
          setError(err.message || 'Failed to load this section.')
        })
        .finally(() => {
          if (!signal?.aborted) setLoading(false)
        })
    },
    [section, normalise, ongoingFlag],
  )

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load, userId])

  useEffect(
    () => () => {
      if (successTimer.current) clearTimeout(successTimer.current)
      if (errorTimer.current) clearTimeout(errorTimer.current)
    },
    [],
  )

  const flashSuccess = useCallback((msg) => {
    setSuccessMsg(msg)
    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSuccessMsg(null), 3000)
  }, [])

  const flashError = useCallback((msg) => {
    setError(msg)
    if (errorTimer.current) clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(null), 6000)
  }, [])

  // ── Edit lifecycle ─────────────────────────────────────────────────────
  const startEditing = useCallback(() => {
    setOriginal(entries.map((e) => ({ ...e })))
    // An empty section opens with one blank row so there's something to fill in.
    if (entries.length === 0) setEntries([createEmpty()])
    setIsEditing(true)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }, [entries, createEmpty])

  const cancelEditing = useCallback(() => {
    setEntries(original.map((e) => ({ ...e })))
    setIsEditing(false)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})
  }, [original])

  const save = useCallback(async () => {
    // Rows the user added but left untouched are dropped rather than rejected —
    // clicking "Add" then "Save" shouldn't be a validation error.
    const meaningful = entries.filter((entry) => !isBlankEntry(section, entry))

    const errors = validate(meaningful)
    if (!isValid(errors)) {
      setFieldErrors(errors)
      flashError('Please fix the highlighted fields before saving.')
      return false
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})

    try {
      const rows = await saveSection(section, meaningful)
      const list = (Array.isArray(rows) ? rows : []).map(normalise)
      const sorted = ongoingFlag ? sortByRecency(list, ongoingFlag) : list
      setEntries(sorted)
      setOriginal(sorted)
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
  }, [entries, validate, section, normalise, ongoingFlag, flashSuccess, flashError])

  // ── Entry mutations ────────────────────────────────────────────────────
  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, createEmpty()])
  }, [createEmpty])

  const removeEntry = useCallback((index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
    setFieldErrors((prev) => {
      if (!prev[index]) return prev
      const next = { ...prev }
      delete next[index]
      return next
    })
  }, [])

  const updateEntry = useCallback((index, field, value) => {
    setEntries((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    // Clear the field's error as soon as the user edits it.
    setFieldErrors((prev) => {
      if (!prev[index]?.[field]) return prev
      const row = { ...prev[index] }
      delete row[field]
      const next = { ...prev }
      if (Object.keys(row).length) next[index] = row
      else delete next[index]
      return next
    })
  }, [])

  const isDirty = useMemo(
    () => JSON.stringify(entries) !== JSON.stringify(original),
    [entries, original],
  )

  return {
    entries,
    isEditing,
    loading,
    saving,
    error,
    successMsg,
    fieldErrors,
    isDirty,
    startEditing,
    cancelEditing,
    save,
    addEntry,
    removeEntry,
    updateEntry,
    reload: load,
  }
}
