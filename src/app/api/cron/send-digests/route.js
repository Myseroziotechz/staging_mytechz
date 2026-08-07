import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import { jobDigestEmailHtml, jobDigestEmailText } from '@/lib/email/templates/job-alert'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WEEKLY_SEND_DAY = 1 // Monday (UTC) — fixed, no per-user weekday config.

/**
 * Batches pending `job_digest_queue` entries into one email per user, for
 * users whose `notify_frequency` is 'daily' (every run) or 'weekly' (only on
 * the designated weekly day). In-app notifications are unaffected by this —
 * they're already created immediately by dispatchJobNotifications regardless
 * of email frequency; this route only handles the deferred EMAIL side.
 *
 * Triggered by Vercel Cron (see client/vercel.json) once a day. Protected by
 * CRON_SECRET so it can't be invoked by anyone else.
 */
export async function GET(request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = getAdminClient()
  const isWeeklySendDay = new Date().getUTCDay() === WEEKLY_SEND_DAY
  const frequencies = isWeeklySendDay ? ['daily', 'weekly'] : ['daily']

  const { data: settingsRows, error: settingsError } = await admin
    .from('user_settings')
    .select('user_id')
    .in('notify_frequency', frequencies)
    .eq('email_notifications_enabled', true)

  if (settingsError) {
    console.error('[cron/send-digests] could not load user_settings:', settingsError)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }

  const userIds = (settingsRows || []).map((s) => s.user_id)
  if (userIds.length === 0) {
    return NextResponse.json({ ok: true, usersProcessed: 0, emailsSent: 0 })
  }

  const { data: queueRows, error: queueError } = await admin
    .from('job_digest_queue')
    .select('id, user_id, job_id')
    .is('emailed_at', null)
    .in('user_id', userIds)

  if (queueError) {
    console.error('[cron/send-digests] could not load job_digest_queue:', queueError)
    return NextResponse.json({ error: 'Failed to load digest queue' }, { status: 500 })
  }
  if (!queueRows?.length) {
    return NextResponse.json({ ok: true, usersProcessed: 0, emailsSent: 0 })
  }

  const byUser = new Map()
  for (const row of queueRows) {
    if (!byUser.has(row.user_id)) byUser.set(row.user_id, [])
    byUser.get(row.user_id).push(row)
  }

  const jobIds = [...new Set(queueRows.map((r) => r.job_id))]
  const { data: jobs } = await admin
    .from('jobs')
    .select('id, slug, category, title, work_mode, job_type, location_city, location_state, company_id')
    .in('id', jobIds)
  const jobsById = new Map((jobs || []).map((j) => [j.id, j]))

  const companyIds = [...new Set((jobs || []).map((j) => j.company_id).filter(Boolean))]
  const { data: companies } = companyIds.length
    ? await admin.from('companies').select('id, name').in('id', companyIds)
    : { data: [] }
  const companiesById = new Map((companies || []).map((c) => [c.id, c]))

  let emailsSent = 0
  for (const [userId, rows] of byUser) {
    try {
      const { data: profile } = await admin
        .from('user_profiles')
        .select('email')
        .eq('id', userId)
        .maybeSingle()
      if (!profile?.email) continue

      const entries = rows
        .map((r) => ({ row: r, job: jobsById.get(r.job_id) }))
        .filter((e) => e.job)
        .map((e) => ({ ...e, company: e.job.company_id ? companiesById.get(e.job.company_id) : null }))

      if (!entries.length) continue

      await sendEmail({
        to: profile.email,
        subject: `${entries.length} new job${entries.length === 1 ? '' : 's'} for you on MyTechZ`,
        html: jobDigestEmailHtml(entries),
        text: jobDigestEmailText(entries),
      })
      emailsSent += 1

      await admin
        .from('job_digest_queue')
        .update({ emailed_at: new Date().toISOString() })
        .in('id', rows.map((r) => r.id))
    } catch (err) {
      console.error('[cron/send-digests] failed for user', userId, err)
    }
  }

  return NextResponse.json({ ok: true, usersProcessed: byUser.size, emailsSent })
}
