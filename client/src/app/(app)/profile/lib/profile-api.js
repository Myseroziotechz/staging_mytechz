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
  constructor(message, { status, fieldErrors } = {}) {
    super(message)
    this.name = 'ProfileApiError'
    this.status = status
    this.fieldErrors = fieldErrors ?? null
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response
  try {
    response = await fetch(`/api/profile${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ProfileApiError('Network error — check your connection and try again.')
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
