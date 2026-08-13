'use client'

import useProfileSection from '../../hooks/useProfileSection'
import SectionCard from './SectionCard'
import { EmptyState } from './Feedback'
import { EditActions, AddButton, EntryCard } from './Actions'

/**
 * Drives every multi-record section (Education, Projects, Internships,
 * Languages). Owns the view/edit toggle, add/delete, save/cancel and empty
 * state; callers supply only how one record renders.
 *
 * This replaces four components that each re-implemented the same shell and
 * had drifted apart (different labels, one missing `last:border-0`, one not
 * using the shared card at all).
 *
 * @param {Object}   props
 * @param {string}   props.section       - section key (see SECTIONS)
 * @param {string}   props.userId
 * @param {string}   props.title
 * @param {string}   props.entryNoun     - singular label, e.g. "Education"
 * @param {string}   props.emptyMessage
 * @param {string}   [props.ongoingFlag] - field driving recency sort
 * @param {Object}   [props.dateFields]  - date column overrides (see useProfileSection)
 * @param {Function} props.renderView    - (entry) => ReactNode
 * @param {Function} props.renderEdit    - ({ entry, index, errors, onChange }) => ReactNode
 */
export default function EntryListSection({
  section,
  userId,
  title,
  icon,
  entryNoun,
  emptyMessage,
  ongoingFlag,
  dateFields,
  renderView,
  renderEdit,
}) {
  const {
    entries,
    isEditing,
    loading,
    saving,
    error,
    successMsg,
    fieldErrors,
    startEditing,
    cancelEditing,
    save,
    addEntry,
    removeEntry,
    updateEntry,
  } = useProfileSection({ section, userId, ongoingFlag, dateFields })

  return (
    <SectionCard
      title={title}
      icon={icon}
      loading={loading}
      isEditing={isEditing}
      onEdit={startEditing}
      error={error}
      successMsg={successMsg}
    >
      {isEditing ? (
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <EntryCard
              key={entry._key}
              label={`${entryNoun} #${idx + 1}`}
              onDelete={() => removeEntry(idx)}
            >
              {renderEdit({
                entry,
                index: idx,
                errors: fieldErrors[idx] ?? {},
                onChange: (field, value) => updateEntry(idx, field, value),
              })}
            </EntryCard>
          ))}

          <AddButton onClick={addEntry}>Add {entryNoun}</AddButton>

          <EditActions onSave={save} onCancel={cancelEditing} saving={saving} />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          message={emptyMessage}
          actionLabel={`Add ${entryNoun}`}
          onAction={startEditing}
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <div key={entry._key} className="py-4 first:pt-0 last:pb-0">
              {renderView(entry)}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
