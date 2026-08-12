/**
 * Honest progress state for the resume-sync request: exactly one real
 * network call, exactly one status line tied to its actual promise state.
 * Deliberately does NOT simulate a multi-step checklist ("Extracting
 * text… Analyzing skills…") with timed fake transitions — those wouldn't
 * correspond to any real intermediate server event, since sync-profile is a
 * single request/response, not a streamed job.
 */
export default function ResumeAnalysisProgress({ status, fileName }) {
  if (status === 'idle') return null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
      {status === 'uploading' && (
        <>
          <svg className="w-4 h-4 text-violet-600 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-violet-900">Reading {fileName || 'your resume'}…</p>
            <p className="text-xs text-violet-600">This usually takes 5-10 seconds.</p>
          </div>
        </>
      )}
    </div>
  )
}
