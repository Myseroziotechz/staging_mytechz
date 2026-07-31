'use client'

import EntryListSection from './shared/EntryListSection'
import { TextInput, TextArea, SelectInput, MonthYearRange } from './shared/Fields'
import { Chip } from './shared/Actions'
import { SECTIONS, EMPLOYMENT_TYPES } from '../lib/constants'
import { formatDateRange } from '../lib/format'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

function InternshipRow(entry) {
  const range = formatDateRange(entry, { ongoingFlag: 'currently_working' })

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">
            {entry.role || 'Role not specified'}
          </h4>
          {entry.company && <p className="text-sm text-gray-500">{entry.company}</p>}
        </div>
        {entry.employment_type && <Chip tone="gray">{entry.employment_type}</Chip>}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
        {range && <span>{range}</span>}
        {entry.location && <span>{entry.location}</span>}
      </div>

      {entry.description && (
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{entry.description}</p>
      )}
    </>
  )
}

function InternshipFields({ entry, errors, onChange }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Company"
          required
          placeholder="Acme Corp"
          value={entry.company}
          error={errors.company}
          onChange={(e) => onChange('company', e.target.value)}
        />
        <TextInput
          label="Role"
          required
          placeholder="Frontend Developer Intern"
          value={entry.role}
          error={errors.role}
          onChange={(e) => onChange('role', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectInput
          label="Employment Type"
          placeholder="Select type"
          options={EMPLOYMENT_TYPES}
          value={entry.employment_type}
          error={errors.employment_type}
          onChange={(e) => onChange('employment_type', e.target.value)}
        />
        <TextInput
          label="Location"
          placeholder="Bengaluru / Remote"
          value={entry.location}
          error={errors.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
      </div>

      <MonthYearRange
        entry={entry}
        errors={errors}
        onChange={onChange}
        ongoingFlag="currently_working"
        ongoingLabel="Currently Working here"
      />

      <TextArea
        label="Description"
        rows={3}
        placeholder="What you worked on and what you achieved…"
        value={entry.description}
        error={errors.description}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </>
  )
}

export default function InternshipsSection({ userId }) {
  return (
    <EntryListSection
      section={SECTIONS.INTERNSHIPS}
      userId={userId}
      title="Internships"
      icon={ICON}
      entryNoun="Internship"
      emptyMessage="No internships added yet."
      ongoingFlag="currently_working"
      renderView={InternshipRow}
      renderEdit={InternshipFields}
    />
  )
}
