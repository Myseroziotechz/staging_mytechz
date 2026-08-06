export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { fail, requireUser } from '@/app/api/profile/_lib/handlers'
import { NextResponse } from 'next/server'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// POST /api/settings/avatar — upload a new profile photo
export async function POST(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  let formData
  try {
    formData = await request.formData()
  } catch {
    return fail('Invalid upload request.', 400)
  }

  const file = formData.get('file')
  if (!file) return fail('No file uploaded.', 400)
  if (file.size > MAX_SIZE) return fail('Image must be under 2MB.', 400)

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) return fail('Supported formats: JPG, PNG, WEBP.', 400)

  const path = `${user.id}/avatar-${Date.now()}.${ext}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('[settings/avatar] upload failed:', uploadError)
      return fail('Could not upload image. Please try again.', 500)
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

    const { data: profile, error: dbError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('avatar_url')
      .maybeSingle()

    if (dbError) {
      console.error('[settings/avatar] profile update failed:', dbError)
      return fail('Image uploaded, but we could not save it to your profile.', 500)
    }

    return NextResponse.json({ ok: true, avatar_url: profile?.avatar_url })
  } catch (err) {
    console.error('[settings/avatar] unexpected error:', err)
    return fail('Could not upload image. Please try again.', 500)
  }
}

// DELETE /api/settings/avatar — remove the uploaded photo, falling back to
// the OAuth-provider avatar (Google profile picture) if one exists.
export async function DELETE() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { data: files } = await supabase.storage.from('avatars').list(user.id)
    if (files?.length) {
      await supabase.storage.from('avatars').remove(files.map((f) => `${user.id}/${f.name}`))
    }

    const fallback = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: fallback, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('avatar_url')
      .maybeSingle()

    if (error) throw error
    return NextResponse.json({ ok: true, avatar_url: profile?.avatar_url })
  } catch (err) {
    console.error('[settings/avatar] delete failed:', err)
    return fail('Could not remove image. Please try again.', 500)
  }
}
