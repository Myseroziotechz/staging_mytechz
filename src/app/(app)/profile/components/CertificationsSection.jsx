'use client'

import EntryListSection from './shared/EntryListSection'
import { TextInput, SelectInput, CheckboxField } from './shared/Fields'
import { SECTIONS, MONTHS, getYearOptions } from '../lib/constants'
import { formatDateRange } from '../lib/format'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// certifications uses issue_*/expiration_* columns rather than start_*/end_*,
// so format/sort helpers need to be told which fields to read.
const DATE_FIELDS = {
  startMonth: 'issue_month',
  startYear: 'issue_year',
  endMonth: 'expiration_month',
  endYear: 'expiration_year',
}

function CertificationRow(entry) {
  const range = formatDateRange(entry, {
    ongoingFlag: 'does_not_expire',
    ongoingLabel: 'No Expiration',
    fields: DATE_FIELDS,
  })

  return (
    <>
      <h4 className="text-sm font-semibold text-gray-900">
        {entry.name || 'Certification'}
      </h4>
      {entry.issuing_organization && (
        <p className="text-sm text-gray-500">{entry.issuing_organization}</p>
      )}
      {range && <p className="mt-1 text-xs text-gray-400">Issued {range}</p>}

      {entry.credential_id && (
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium">Credential ID:</span> {entry.credential_id}
        </p>
      )}
      {entry.credential_url && (
        <a
          href={entry.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Show credential ↗
        </a>
      )}
    </>
  )
}

function CertificationFields({ entry, errors, onChange }) {
  const years = getYearOptions()
  const expires = entry.does_not_expire !== true

  const handleDoesNotExpire = (e) => {
    const checked = e.target.checked
    onChange('does_not_expire', checked)
    if (checked) {
      onChange('expiration_month', '')
      onChange('expiration_year', '')
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Certification Name"
          required
          placeholder="AWS Certified Developer – Associate"
          value={entry.name}
          error={errors.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <TextInput
          label="Issuing Organization"
          placeholder="Amazon Web Services"
          value={entry.issuing_organization}
          error={errors.issuing_organization}
          onChange={(e) => onChange('issuing_organization', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SelectInput
          label="Issue Month"
          placeholder="Month"
          options={MONTHS}
          value={entry.issue_month}
          error={errors.issue_month}
          onChange={(e) => onChange('issue_month', e.target.value)}
        />
        <SelectInput
          label="Issue Year"
          required
          placeholder="Year"
          options={years}
          value={entry.issue_year}
          error={errors.issue_year}
          onChange={(e) => onChange('issue_year', e.target.value)}
        />
        <SelectInput
          label="Expiration Month"
          placeholder="Month"
          options={MONTHS}
          value={entry.expiration_month}
          error={errors.expiration_month}
          disabled={!expires}
          onChange={(e) => onChange('expiration_month', e.target.value)}
        />
        <SelectInput
          label="Expiration Year"
          placeholder="Year"
          options={years}
          value={entry.expiration_year}
          error={errors.expiration_year}
          disabled={!expires}
          onChange={(e) => onChange('expiration_year', e.target.value)}
        />
      </div>

      <CheckboxField
        label="This credential does not expire"
        checked={!expires}
        onChange={handleDoesNotExpire}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Credential ID"
          placeholder="ABC123XYZ"
          value={entry.credential_id}
          error={errors.credential_id}
          onChange={(e) => onChange('credential_id', e.target.value)}
        />
        <TextInput
          label="Credential URL"
          type="url"
          placeholder="https://credential-issuer.com/verify/…"
          value={entry.credential_url}
          error={errors.credential_url}
          onChange={(e) => onChange('credential_url', e.target.value)}
        />
      </div>
    </>
  )
}

export default function CertificationsSection({ userId }) {
  return (
    <EntryListSection
      section={SECTIONS.CERTIFICATIONS}
      userId={userId}
      title="Certifications"
      icon={ICON}
      entryNoun="Certification"
      emptyMessage="No certifications added yet."
      ongoingFlag="does_not_expire"
      dateFields={DATE_FIELDS}
      renderView={CertificationRow}
      renderEdit={CertificationFields}
    />
  )
}
