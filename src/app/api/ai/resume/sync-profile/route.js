export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ai/rate-limit'
import { parseResumeWithGemini, isGeminiConfigured, MODEL } from '@/lib/ai/gemini'
import { validateResumeFile, extractResumeText } from '@/lib/ai/resume-text'
import { listSection, insertSectionRow, getSkills, setSkills } from '@/app/(app)/profile/lib/profile-repository'
import { MONTHS } from '@/app/(app)/profile/lib/constants'

/**
 * POST /api/ai/resume/sync-profile — upload a resume, extract structured
 * data with the existing Gemini parser, and MERGE it into the real profile
 * tables that already power /profile and the matching engine.
 *
 * Merge-only, additive: this never updates or deletes an existing row. Any
 * parsed entry that looks like a duplicate of something already saved is
 * skipped, not overwritten — a user's manually-curated profile data is never
 * at risk from a resume upload.
 */
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  const limited = await rateLimit(user.id)
  if (limited) return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })

  let formData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 })
  }

  const file = formData.get('file')
  const fileError = validateResumeFile(file)
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })

  try {
    const text = await extractResumeText(file)
    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. The file may be empty, image-only, or corrupted — try pasting your resume text instead.' },
        { status: 400 },
      )
    }

    // No local-rule fallback here (unlike /parse): this endpoint's entire
    // purpose is structured section data, which a raw-text fallback can't
    // provide, so a Gemini failure is a real failure for this endpoint.
    const resumeData = await parseResumeWithGemini(text.slice(0, 8000))

    const synced = {
      skillsAdded: await mergeSkills(supabase, user.id, resumeData.skills),
      educationAdded: await mergeEducation(supabase, user.id, resumeData.education),
      projectsAdded: await mergeProjects(supabase, user.id, resumeData.projects),
      certificationsAdded: await mergeCertifications(supabase, user.id, resumeData.certifications),
    }

    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'sync_profile',
        input_prompt: `File: ${file.name} (${text.length} chars)`,
        output_content: synced,
        model_used: MODEL,
        status: 'success',
      })
    } catch { /* non-critical */ }

    return NextResponse.json({ resumeData, synced })
  } catch (err) {
    console.error('[resume/sync-profile] Error:', err)
    try {
      await supabase.from('ai_generation_logs').insert({
        user_id: user.id,
        action_type: 'sync_profile',
        input_prompt: `File: ${file.name}`,
        model_used: MODEL,
        status: 'error',
        error_message: err.message?.slice(0, 500),
      })
    } catch { /* non-critical */ }
    return NextResponse.json(
      { error: 'Could not analyze this resume right now. Please try again.' },
      { status: 500 },
    )
  }
}

// ─── Merge helpers — additive only, never delete/overwrite existing rows ────

function normalizeText(v) {
  return String(v || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

function fuzzyEq(a, b) {
  const na = normalizeText(a)
  const nb = normalizeText(b)
  if (!na || !nb) return false
  return na === nb || na.includes(nb) || nb.includes(na)
}

/** Pulls the first 4-digit year (19xx/20xx) found anywhere in a string. */
function extractYear(str) {
  const m = String(str || '').match(/\b(19|20)\d{2}\b/)
  return m ? m[0] : ''
}

/** Finds a month name mentioned in a string, returned in the form entries.js expects. */
function extractMonthName(str) {
  const s = String(str || '').toLowerCase()
  for (const month of MONTHS) {
    if (s.includes(month.toLowerCase()) || s.includes(month.slice(0, 3).toLowerCase())) return month
  }
  return ''
}

async function mergeSkills(supabase, userId, parsedSkills) {
  if (!Array.isArray(parsedSkills) || !parsedSkills.length) return 0
  const existing = await getSkills(supabase, userId)
  const existingLower = new Set(existing.map((s) => String(s).toLowerCase().trim()))
  const toAdd = parsedSkills
    .map((s) => String(s || '').trim())
    .filter((s) => s && !existingLower.has(s.toLowerCase()))

  // Dedupe within the parsed list itself too.
  const seen = new Set()
  const uniqueToAdd = toAdd.filter((s) => {
    const k = s.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  if (!uniqueToAdd.length) return 0
  const merged = [...existing, ...uniqueToAdd].slice(0, 50) // matches the profile UI's own skills cap
  await setSkills(supabase, userId, merged)
  return merged.length - existing.length
}

async function mergeEducation(supabase, userId, parsedEducation) {
  if (!Array.isArray(parsedEducation) || !parsedEducation.length) return 0
  const existing = await listSection(supabase, 'education', userId)
  let added = 0

  for (const e of parsedEducation) {
    if (!e?.degree && !e?.institution) continue
    const isDup = existing.some(
      (row) => fuzzyEq(row.degree, e.degree) && fuzzyEq(row.institution, e.institution),
    )
    if (isDup) continue

    // education.start_year is NOT NULL — Gemini's schema only gives one
    // "year" per entry (typically graduation year), so start/end are set to
    // the same best-effort value rather than fabricating a range. Skip
    // entirely if no year is parseable at all, rather than guessing one.
    const year = extractYear(e.year)
    if (!year) continue

    try {
      await insertSectionRow(supabase, 'education', userId, {
        degree: e.degree || '',
        institution: e.institution || '',
        field_of_study: '',
        start_month: '',
        start_year: year,
        end_month: '',
        end_year: year,
        currently_studying: false,
        cgpa: '',
        description: '',
      })
      added++
      existing.push({ degree: e.degree, institution: e.institution }) // avoid re-adding within this same request
    } catch (err) {
      console.warn('[resume/sync-profile] skipped education entry:', err.message)
    }
  }
  return added
}

async function mergeProjects(supabase, userId, parsedProjects) {
  if (!Array.isArray(parsedProjects) || !parsedProjects.length) return 0
  const existing = await listSection(supabase, 'projects', userId)
  let added = 0

  for (const p of parsedProjects) {
    if (!p?.name) continue
    const isDup = existing.some((row) => fuzzyEq(row.title, p.name))
    if (isDup) continue

    // projects.start_year is NOT NULL — parsed projects only carry a single
    // free-text `date` field, so skip if no year can be extracted from it.
    const year = extractYear(p.date)
    if (!year) continue

    try {
      await insertSectionRow(supabase, 'projects', userId, {
        title: p.name,
        organization: '',
        description: p.description || '',
        skills_used: Array.isArray(p.techStack) ? p.techStack.join(', ') : '',
        project_url: '',
        github_url: '',
        start_month: extractMonthName(p.date),
        start_year: year,
        end_month: '',
        end_year: year,
        currently_working: false,
      })
      added++
      existing.push({ title: p.name })
    } catch (err) {
      console.warn('[resume/sync-profile] skipped project entry:', err.message)
    }
  }
  return added
}

async function mergeCertifications(supabase, userId, parsedCertifications) {
  if (!Array.isArray(parsedCertifications) || !parsedCertifications.length) return 0
  const existing = await listSection(supabase, 'certifications', userId)
  let added = 0

  for (const c of parsedCertifications) {
    if (!c?.name) continue
    const isDup = existing.some(
      (row) => fuzzyEq(row.name, c.name) && fuzzyEq(row.issuing_organization, c.issuer),
    )
    if (isDup) continue

    // certifications.issue_year is NOT NULL — skip rather than insert a
    // null and rely on the DB to reject it.
    const year = extractYear(c.year)
    if (!year) continue

    try {
      await insertSectionRow(supabase, 'certifications', userId, {
        name: c.name,
        issuing_organization: c.issuer || '',
        issue_month: extractMonthName(c.year),
        issue_year: year,
        expiration_month: '',
        expiration_year: '',
        does_not_expire: false,
        credential_id: '',
        credential_url: '',
      })
      added++
      existing.push({ name: c.name, issuing_organization: c.issuer })
    } catch (err) {
      console.warn('[resume/sync-profile] skipped certification entry:', err.message)
    }
  }
  return added
}
