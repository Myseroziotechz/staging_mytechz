'use client'

import EntryListSection from './shared/EntryListSection'
import { TextInput, TextArea, MonthYearRange } from './shared/Fields'
import { Chip } from './shared/Actions'
import { SECTIONS } from '../lib/constants'
import { formatDateRange, splitTokens } from '../lib/format'

const ICON = (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

function ProjectRow(entry) {
  const range = formatDateRange(entry, { ongoingFlag: 'currently_working' })
  const skills = splitTokens(entry.skills_used)

  return (
    <>
      <h4 className="text-sm font-semibold text-gray-900">{entry.title || 'Project'}</h4>
      {entry.organization && <p className="text-sm text-gray-500">{entry.organization}</p>}
      {range && <p className="mt-1 text-xs text-gray-400">{range}</p>}

      {entry.description && (
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{entry.description}</p>
      )}

      {skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
      )}

      {(entry.project_url || entry.github_url) && (
        <div className="mt-2 flex flex-wrap gap-3">
          {entry.project_url && (
            <a
              href={entry.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Live Project ↗
            </a>
          )}
          {entry.github_url && (
            <a
              href={entry.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-gray-600 hover:text-gray-800 hover:underline"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}
    </>
  )
}

function ProjectFields({ entry, errors, onChange }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Project Title"
          required
          placeholder="E-Commerce Platform"
          value={entry.title}
          error={errors.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
        <TextInput
          label="Organization"
          placeholder="Personal / College / Company"
          value={entry.organization}
          error={errors.organization}
          onChange={(e) => onChange('organization', e.target.value)}
        />
      </div>

      <TextArea
        label="Description"
        rows={3}
        placeholder="What you built, and the impact it had…"
        value={entry.description}
        error={errors.description}
        onChange={(e) => onChange('description', e.target.value)}
      />

      <TextInput
        label="Skills Used"
        hint="(comma-separated)"
        placeholder="React, Node.js, MongoDB"
        value={entry.skills_used}
        error={errors.skills_used}
        onChange={(e) => onChange('skills_used', e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput
          label="Project URL"
          type="url"
          placeholder="https://myproject.com"
          value={entry.project_url}
          error={errors.project_url}
          onChange={(e) => onChange('project_url', e.target.value)}
        />
        <TextInput
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/user/repo"
          value={entry.github_url}
          error={errors.github_url}
          onChange={(e) => onChange('github_url', e.target.value)}
        />
      </div>

      <MonthYearRange
        entry={entry}
        errors={errors}
        onChange={onChange}
        ongoingFlag="currently_working"
        ongoingLabel="Currently Working on this"
      />
    </>
  )
}

export default function ProjectsSection({ userId }) {
  return (
    <EntryListSection
      section={SECTIONS.PROJECTS}
      userId={userId}
      title="Projects"
      icon={ICON}
      entryNoun="Project"
      emptyMessage="No projects added yet."
      ongoingFlag="currently_working"
      renderView={ProjectRow}
      renderEdit={ProjectFields}
    />
  )
}
