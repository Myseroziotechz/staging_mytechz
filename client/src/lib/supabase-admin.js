import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Admin Supabase client using the service_role key.
// This bypasses ALL RLS and column grants — use ONLY in server-side code.
// NEVER import this file from a client component.
let adminClient = null

export function getAdminClient() {
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  return adminClient
}
