'use client'

import EntryListSection from './shared/EntryListSection'
import { TextInput, SelectInput } from './shared/Fields'
import { Chip } from './shared/Actions'
import { SECTIONS, PROFICIENCY_LEVELS } from '../lib/constants'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
)

function LanguageRow(entry) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h4 className="text-sm font-semibold text-gray-900">
        {entry.language || 'Language not specified'}
      </h4>
      <Chip tone="gray">{entry.proficiency || 'Beginner'}</Chip>
    </div>
  )
}

function LanguageFields({ entry, errors, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <TextInput
        label="Language"
        required
        placeholder="English"
        value={entry.language}
        error={errors.language}
        onChange={(e) => onChange('language', e.target.value)}
      />
      <SelectInput
        label="Proficiency"
        options={PROFICIENCY_LEVELS}
        value={entry.proficiency}
        error={errors.proficiency}
        onChange={(e) => onChange('proficiency', e.target.value)}
      />
    </div>
  )
}

export default function LanguagesSection({ userId }) {
  return (
    <EntryListSection
      section={SECTIONS.LANGUAGES}
      userId={userId}
      title="Languages"
      icon={ICON}
      entryNoun="Language"
      emptyMessage="No languages added yet."
      renderView={LanguageRow}
      renderEdit={LanguageFields}
    />
  )
}
