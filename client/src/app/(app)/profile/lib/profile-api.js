'use client'

/**
 * Browser-side client for the /api/profile/* routes.
 *
 * Sections previously talked to Supabase directly from the browser, which left
 * validation client-only and scattered table names across components. Routing
 * through the API gives one place where input is validated and errors are
 * shaped consistently.
 */

/** Thrown for non-2xx responses; carries per-field errors when the API sent them. */
export class ProfileApiError extends Error {
  constructor(message, { status, fieldErrors, cause } = {}) {
    super(message)
    this.name = 'ProfileApiError'
    this.status = status
    this.fieldErrors = fieldErrors ?? null
    if (cause) this.cause = cause
  }
}

const REQUEST_TIMEOUT_MS = 20_000

/**
 * A caller's own AbortSignal (e.g. an unmount cleanup) and an internal
 * timeout need to be able to abort the same fetch independently. AbortSignal.any
 * isn't available in every runtime this app might run on, so this composes
 * them manually: aborting either one aborts the combined signal, and the
 * `reason` on the combined controller tells the catch block which one fired.
 */
function withTimeout(callerSignal, ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('timeout')), ms)

  if (callerSignal) {
    if (callerSignal.aborted) controller.abort(callerSignal.reason)
    else callerSignal.addEventListener('abort', () => controller.abort(callerSignal.reason), { once: true })
  }

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  }
}

/**
 * Turns a rejected fetch() into a message that actually says what happened,
 * instead of one generic string regardless of cause. A rejected fetch (as
 * opposed to a resolved response with a bad status, handled separately below)
 * means the browser never got an HTTP response at all — the real cause is
 * always one of: the request timed out, the device is offline, or something
 * in the browser (an extension, a firewall, a captive portal) blocked the
 * request before it left. The exact identity of that third case isn't
 * observable from application code, so this logs the raw error for devtools
 * inspection rather than swallowing it.
 */
function describeFetchFailure(err, callerSignal) {
  if (err?.name === 'AbortError' || err instanceof DOMException) {
    if (callerSignal?.aborted) return { abort: true }
    return {
      error: new ProfileApiError(
        'The request timed out. Check your connection and try again.',
        { cause: err },
      ),
    }
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      error: new ProfileApiError(
        'You appear to be offline. Check your connection and try again.',
        { cause: err },
      ),
    }
  }

  console.error('[profile] request failed before receiving a response:', err)
  return {
    error: new ProfileApiError(
      'Could not reach the server. If this keeps happening, check for a browser extension or firewall blocking the request (see the browser console for the underlying error).',
      { cause: err },
    ),
  }
}

async function request(path, { method = 'GET', body, signal: callerSignal } = {}) {
  const { signal, cleanup } = withTimeout(callerSignal, REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch(`/api/profile${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    const { abort, error } = describeFetchFailure(err, callerSignal)
    if (abort) throw err
    throw error
  } finally {
    cleanup()
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // A non-JSON body (proxy error page, empty 204) leaves payload null.
  }

  if (!response.ok || payload?.ok === false) {
    throw new ProfileApiError(
      payload?.error || `Request failed (${response.status}).`,
      { status: response.status, fieldErrors: payload?.fieldErrors },
    )
  }

  return payload ?? {}
}

// ─── Sections (education | projects | internships | languages) ───────────────

export function fetchSection(section, signal) {
  return request(`/${section}`, { signal }).then((r) => r[section] ?? [])
}

export function saveSection(section, entries) {
  return request(`/${section}`, { method: 'PUT', body: { entries } }).then(
    (r) => r[section] ?? [],
  )
}

export function createSectionEntry(section, entry) {
  return request(`/${section}`, { method: 'POST', body: { entry } }).then((r) => r.entry)
}

export function updateSectionEntry(section, id, entry) {
  return request(`/${section}/${id}`, { method: 'PUT', body: { entry } }).then((r) => r.entry)
}

export function deleteSectionEntry(section, id) {
  return request(`/${section}/${id}`, { method: 'DELETE' })
}

export function clearSection(section) {
  return request(`/${section}`, { method: 'DELETE' })
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export function fetchSkills(signal) {
  return request('/skills', { signal }).then((r) => r.skills ?? [])
}

export function saveSkills(skills) {
  return request('/skills', { method: 'PUT', body: { skills } }).then((r) => r.skills ?? [])
}

// ─── About ───────────────────────────────────────────────────────────────────

export function fetchAbout(signal) {
  return request('/about', { signal }).then((r) => r.profile ?? null)
}

export function saveAbout(values) {
  return request('/about', { method: 'PUT', body: values }).then((r) => r.profile ?? null)
}
