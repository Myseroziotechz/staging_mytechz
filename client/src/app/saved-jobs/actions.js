'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function removeSavedJob(_prev, formData) {
  const id = formData.get('id')
  if (!id) return { error: 'Missing job ID' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/saved-jobs')
  revalidatePath('/dashboard')
  return { success: true }
}
