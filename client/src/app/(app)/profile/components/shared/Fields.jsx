'use client'

import { useId } from 'react'
import { MONTHS, getYearOptions } from '../../lib/constants'

const BASE_INPUT =
  'w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
const OK = 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
const BAD = 'border-red-300 bg-red-50/40 focus:ring-red-500 focus:border-transparent'

function inputClass(hasError) {
  return `${BASE_INPUT} ${hasError ? BAD : OK}`
}

/** Label + optional required marker + hint + error message wrapper. */
export function Field({ label, required, hint, error, htmlFor, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {hint && <span className="ml-1 font-normal text-gray-400">{hint}</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

export function TextInput({ label, required, hint, error, type = 'text', ...props }) {
  const id = useId()
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        className={inputClass(error)}
        {...props}
        value={props.value ?? ''}
      />
    </Field>
  )
}

export function TextArea({ label, required, hint, error, rows = 3, maxLength, value, ...props }) {
  const id = useId()
  const length = String(value ?? '').length
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        className={`${inputClass(error)} resize-y`}
        value={value ?? ''}
        {...props}
      />
      {maxLength && (
        <p className="mt-1 text-right text-[11px] text-gray-400">
          {length}/{maxLength}
        </p>
      )}
    </Field>
  )
}

export function SelectInput({ label, required, hint, error, options, placeholder, ...props }) {
  const id = useId()
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <select
        id={id}
        aria-invalid={error ? 'true' : undefined}
        className={inputClass(error)}
        {...props}
        value={props.value ?? ''}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value
          const text = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
    </Field>
  )
}

export function CheckboxField({ label, checked, onChange, ...props }) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none w-fit">
      <input
        id={id}
        type="checkbox"
        checked={checked === true}
        onChange={onChange}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

/**
 * The start/end month+year grid shared by Education, Projects and Internships,
 * plus its "currently studying/working" toggle. Clearing the end date when the
 * toggle is switched on keeps the stored row consistent with what's displayed.
 */
export function MonthYearRange({
  entry,
  errors = {},
  onChange,
  ongoingFlag,
  ongoingLabel,
}) {
  const years = getYearOptions()
  const ongoing = entry[ongoingFlag] === true

  const handleOngoing = (e) => {
    const checked = e.target.checked
    onChange(ongoingFlag, checked)
    if (checked) {
      onChange('end_month', '')
      onChange('end_year', '')
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SelectInput
          label="Start Month"
          placeholder="Month"
          options={MONTHS}
          value={entry.start_month}
          error={errors.start_month}
          onChange={(e) => onChange('start_month', e.target.value)}
        />
        <SelectInput
          label="Start Year"
          required
          placeholder="Year"
          options={years}
          value={entry.start_year}
          error={errors.start_year}
          onChange={(e) => onChange('start_year', e.target.value)}
        />
        <SelectInput
          label="End Month"
          placeholder="Month"
          options={MONTHS}
          value={entry.end_month}
          error={errors.end_month}
          disabled={ongoing}
          onChange={(e) => onChange('end_month', e.target.value)}
        />
        <SelectInput
          label="End Year"
          placeholder="Year"
          options={years}
          value={entry.end_year}
          error={errors.end_year}
          disabled={ongoing}
          onChange={(e) => onChange('end_year', e.target.value)}
        />
      </div>

      <CheckboxField label={ongoingLabel} checked={ongoing} onChange={handleOngoing} />
    </div>
  )
}
