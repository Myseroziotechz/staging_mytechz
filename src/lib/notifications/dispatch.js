import 'server-only'
import { getAdminClient } from '@/lib/supabase/admin'
import { isEligibleForJob } from './match'
import { sendEmail } from '@/lib/email/send'
import { jobAlertEmailHtml, jobAlertEmailText } from '@/lib/email/templates/job-alert'

/**
 * Fans a newly-published job out to eligible candidates: an in-app
 * `notifications` row always, and either an immediate email (instant
 * frequency) or a `job_digest_queue` entry (daily/weekly frequency) when the
 * user has email alerts enabled. Safe to call more than once for the same
 * job — `job_notification_log` (job_id, user_id, channel) is the dedup
 * guard, independent of the caller-side "don't re-trigger" checks in the
 * job-status actions, and independent of the user later deleting their
 * in-app notification.
 *
 * Called from `after()` in the job-publish Server Actions, so it always runs
 * post-response — a failure here never affects the recruiter/admin's request,
 * and one user's failure (bad email, etc.) never aborts the rest of the batch.
 */
export async function dispatchJobNotifications(jobId) {
  const admin = getAdminClient()

  const { data: job, error: jobError } = await admin
    .from('jobs')
    .select('id, slug, category, title, work_mode, job_type, location_city, location_state, company_id')
    .eq('id', jobId)
    .maybeSingle()

  if (jobError || !job) {
    console.error('[dispatchJobNotifications] could not load job:', jobId, jobError)
    return
  }

  let company = null
  if (job.company_id) {
    const { data } = await admin.from('companies').select('name').eq('id', job.company_id).maybeSingle()
    company = data
  }

  const { data: profiles, error: profilesError } = await admin
    .from('user_profiles')
    .select('id, email, role')
    .eq('role', 'candidate')
    .eq('is_active', true)

  if (profilesError) {
    console.error('[dispatchJobNotifications] could not load candidate profiles:', profilesError)
    return
  }
  if (!profiles?.length) return

  const ids = profiles.map((p) => p.id)
  const { data: settingsRows } = await admin
    .from('user_settings')
    .select('user_id, notify_job_alerts, preferred_roles, preferred_locations, work_mode, employment_type, notify_frequency, email_notifications_enabled, in_app_notifications_enabled')
    .in('user_id', ids)

  const settingsByUser = new Map((settingsRows || []).map((s) => [s.user_id, s]))
  const DEFAULT_SETTINGS = {
    notify_job_alerts: true,
    preferred_roles: [],
    preferred_locations: [],
    work_mode: null,
    employment_type: null,
    notify_frequency: 'instant',
    email_notifications_enabled: true,
    in_app_notifications_enabled: true,
  }

  const link = `/jobs/${job.category}/${job.slug}`

  for (const profile of profiles) {
    const settings = settingsByUser.get(profile.id) || DEFAULT_SETTINGS
    if (!isEligibleForJob({ job, profile, settings })) continue

    try {
      if (settings.in_app_notifications_enabled) {
        await createInAppNotification(admin, { job, company, profile, link })
      }
      if (settings.email_notifications_enabled && profile.email) {
        await deliverEmail(admin, { job, company, profile, settings })
      }
    } catch (err) {
      console.error('[dispatchJobNotifications] failed for user', profile.id, err)
    }
  }
}

async function logOnce(admin, { jobId, userId, channel }) {
  const { data, error } = await admin
    .from('job_notification_log')
    .upsert({ job_id: jobId, user_id: userId, channel }, { onConflict: 'job_id,user_id,channel', ignoreDuplicates: true })
    .select('job_id')

  if (error) {
    console.error('[dispatchJobNotifications] log insert failed:', error)
    return false
  }
  return data.length > 0 // true only if this call actually created the log row
}

async function createInAppNotification(admin, { job, company, profile, link }) {
  const isNew = await logOnce(admin, { jobId: job.id, userId: profile.id, channel: 'in_app' })
  if (!isNew) return

  const companyName = company?.name || 'A company on MyTechZ'
  await admin.from('notifications').insert({
    user_id: profile.id,
    type: 'job_alert',
    title: `New job: ${job.title}`,
    body: `${companyName} just posted a job that matches your preferences.`,
    link,
    job_id: job.id,
  })
}

async function deliverEmail(admin, { job, company, profile, settings }) {
  const isNew = await logOnce(admin, { jobId: job.id, userId: profile.id, channel: 'email' })
  if (!isNew) return

  if (settings.notify_frequency === 'instant') {
    await sendEmail({
      to: profile.email,
      subject: `New job for you: ${job.title}`,
      html: jobAlertEmailHtml(job, company),
      text: jobAlertEmailText(job, company),
    })
  } else {
    // daily / weekly — queue for the digest cron instead of sending now.
    await admin.from('job_digest_queue').insert({ user_id: profile.id, job_id: job.id })
  }
}
