// Supabase CRUD helpers for resume_documents table (client-side)

import { createClient } from '@/lib/supabase/browser'

function sb() {
  return createClient()
}

// Fetch all resumes for the current user
export async function getUserResumes() {
  const { data, error } = await sb()
    .from('resume_documents')
    .select('id, title, template_slug, status, is_primary, created_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Fetch a single resume by ID
export async function getResume(id) {
  const { data, error } = await sb()
    .from('resume_documents')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Create a new resume
export async function createResume({ title = 'Untitled Resume', templateSlug = 'classic', resumeData = {} }) {
  const { data: { user } } = await sb().auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await sb()
    .from('resume_documents')
    .insert({
      user_id: user.id,
      title,
      template_slug: templateSlug,
      resume_data: resumeData,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Update a resume
export async function updateResume(id, updates) {
  const payload = { updated_at: new Date().toISOString() }
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.templateSlug !== undefined) payload.template_slug = updates.templateSlug
  if (updates.resumeData !== undefined) payload.resume_data = updates.resumeData
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.isPrimary !== undefined) payload.is_primary = updates.isPrimary

  const { data, error } = await sb()
    .from('resume_documents')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Delete a resume
export async function deleteResume(id) {
  const { error } = await sb()
    .from('resume_documents')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Duplicate a resume
export async function duplicateResume(id) {
  const original = await getResume(id)
  return createResume({
    title: `${original.title} (Copy)`,
    templateSlug: original.template_slug,
    resumeData: original.resume_data,
  })
}
