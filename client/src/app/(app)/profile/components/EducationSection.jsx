'use client'

import EntryListSection from './shared/EntryListSection'
import { TextInput, TextArea, MonthYearRange } from './shared/Fields'
import { SECTIONS } from '../lib/constants'
import { formatDateRange } from '../lib/format'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0118 18.72 12 12 0 0112 21a12 12 0 01-6-2.28 12.083 12.083 0 01-.16-8.142L12 14z" />
  </svg>
)

function EducationRow(entry) {
  const range = formatDateRange(entry, { ongoingFlag: 'currently_studying' })
  return (
    <>
      <h4 className="text-sm font-semibold text-gray-900">
        {entry.degree || 'Degree not specified'}
      </h4>
      {entry.field_of_study && <p className="text-sm text-gray-600">{entry.field_of_study}</p>}
      {entry.institution && <p className="text-sm text-gray-500">{entry.institution}</p>}

      {range && <p className="mt-1 text-xs text-gray-400">{range}</p>}

      {entry.cgpa && (
        <p className="mt-1 text-sm text-gray-700">
          <span className="font-medium">CGPA:</span> {entry.cgpa}
        </p>
      )}
      {entry.description && (
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{entry.description}</p>
      )}
    </>
  )
}

function EducationFields({ entry, errors, onChange }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Degree"
          required
          placeholder="Bachelor of Engineering"
          value={entry.degree}
          error={errors.degree}
          onChange={(e) => onChange('degree', e.target.value)}
        />
        <TextInput
          label="Field of Study"
          placeholder="Computer Science"
          value={entry.field_of_study}
          error={errors.field_of_study}
          onChange={(e) => onChange('field_of_study', e.target.value)}
        />
      </div>

      <TextInput
        label="Institution"
        required
        placeholder="XYZ College of Engineering"
        value={entry.institution}
        error={errors.institution}
        onChange={(e) => onChange('institution', e.target.value)}
      />

      <MonthYearRange
        entry={entry}
        errors={errors}
        onChange={onChange}
        ongoingFlag="currently_studying"
        ongoingLabel="Currently Studying"
      />

      <TextInput
        label="CGPA"
        hint="(or percentage)"
        placeholder="8.8"
        inputMode="decimal"
        value={entry.cgpa}
        error={errors.cgpa}
        onChange={(e) => onChange('cgpa', e.target.value)}
      />

      <TextArea
        label="Description"
        rows={2}
        placeholder="Coursework, honours, activities…"
        value={entry.description}
        error={errors.description}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </>
  )
}

export default function EducationSection({ userId }) {
  return (
    <EntryListSection
      section={SECTIONS.EDUCATION}
      userId={userId}
      title="Education"
      icon={ICON}
      entryNoun="Education"
      emptyMessage="No education added yet."
      ongoingFlag="currently_studying"
      renderView={EducationRow}
      renderEdit={EducationFields}
    />
  )
}
