'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import SectionCard from './shared/SectionCard'
import { EditActions, Chip } from './shared/Actions'
import { fetchSkills, saveSkills } from '../lib/profile-api'
import { validateSkills } from '../lib/validation'
import { splitTokens } from '../lib/format'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

/**
 * Skills are a TEXT[] on user_profiles rather than their own table, so this
 * section manages a flat string list instead of using useProfileSection.
 */
function SkillsEditor({ skills, onChange }) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const has = useCallback(
    (skill) => skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
    [skills],
  )

  const addSkills = useCallback(
    (raw) => {
      const additions = splitTokens(raw).filter((s) => !has(s))
      if (additions.length) onChange([...skills, ...additions])
    },
    [skills, has, onChange],
  )

  const removeSkill = useCallback(
    (skill) => onChange(skills.filter((s) => s !== skill)),
    [skills, onChange],
  )

  const commit = useCallback(() => {
    addSkills(inputValue)
    setInputValue('')
  }, [addSkills, inputValue])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';' || e.key === 'Tab') {
      if (e.key === 'Tab' && !inputValue.trim()) return
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && inputValue === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text')
    if (/[,;\n]/.test(pasted)) {
      e.preventDefault()
      addSkills(pasted)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap items-center gap-2 min-h-[2.75rem] p-2 rounded-xl border border-gray-300 bg-white cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
      >
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="w-4 h-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={commit}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : 'Add another…'}
          className="flex-1 min-w-[140px] border-0 outline-none text-sm bg-transparent py-1 placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400">
        Press Enter or comma to add. Backspace removes the last skill.
      </p>
    </div>
  )
}

export default function SkillsSection({ userId }) {
  const [skills, setSkills] = useState([])
  const [original, setOriginal] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const successTimer = useRef(null)
  const errorTimer = useRef(null)

  // No skills saved yet -> open straight into the editor, so the input is
  // there to type into immediately rather than behind an "Add" click.
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetchSkills(controller.signal)
      .then((list) => {
        if (controller.signal.aborted) return
        const safe = Array.isArray(list) ? list : []
        setOriginal(safe)
        setSkills(safe)
        setIsEditing(safe.length === 0)
      })
      .catch((err) => {
        if (controller.signal.aborted || err?.name === 'AbortError') return
        setError(err.message || 'Failed to load skills.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [userId])

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

  const startEditing = () => {
    setOriginal([...skills])
    setIsEditing(true)
    setError(null)
    setSuccessMsg(null)
  }

  const cancelEditing = () => {
    setSkills([...original])
    setIsEditing(original.length > 0 ? false : true)
    setError(null)
    setSuccessMsg(null)
  }

  const save = async () => {
    const invalid = validateSkills(skills)
    if (invalid) {
      flashError(invalid)
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)
    try {
      const saved = await saveSkills(skills)
      const safe = Array.isArray(saved) ? saved : skills
      setOriginal([...safe])
      setSkills(safe)
      setIsEditing(safe.length === 0)
      flashSuccess('Skills saved successfully.')
    } catch (err) {
      flashError(err.message || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard
      title="Skills"
      icon={ICON}
      loading={loading}
      isEditing={isEditing}
      onEdit={startEditing}
      error={error}
      successMsg={successMsg}
    >
      {isEditing ? (
        <div className="space-y-1">
          <SkillsEditor skills={skills} onChange={setSkills} />
          <EditActions onSave={save} onCancel={cancelEditing} saving={saving} />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
