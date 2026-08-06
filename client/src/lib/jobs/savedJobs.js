import { createClient } from '@/lib/supabase/server'

// Server-side only: the set of job URLs the current user has bookmarked, so
// listing/detail pages can render each JobCard's save icon already filled in
// instead of every card starting "unsaved" until clicked. Returns [] for a
// signed-out visitor (no extra round trip — getUser() is already cheap/cached
// per-request) so callers never need to special-case anonymous users.
export async function fetchSavedJobUrls() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('saved_jobs')
    .select('job_url')
    .eq('user_id', user.id)

  return (data || []).map((row) => row.job_url)
}
