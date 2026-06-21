import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ notifications: [] })

    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, body, is_read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return NextResponse.json({ notifications: [] })
    return NextResponse.json({ notifications: data ?? [] })
  } catch {
    return NextResponse.json({ notifications: [] })
  }
}
