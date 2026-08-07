const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

const WORK_MODE_LABELS = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }
const JOB_TYPE_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
  contract: 'Contract',
  temporary: 'Temporary',
}

function safe(s) {
  return String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
}

export function jobUrl(job) {
  return `${SITE}/jobs/${job.category}/${job.slug}`
}

function jobLocation(job) {
  return [job.location_city, job.location_state].filter(Boolean).join(', ') || 'Location not specified'
}

function jobCard(job, company) {
  const workMode = WORK_MODE_LABELS[job.work_mode] || job.work_mode
  const jobType = JOB_TYPE_LABELS[job.job_type] || job.job_type
  return `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px">
      <h3 style="margin:0 0 4px;color:#111827;font-size:16px">${safe(job.title)}</h3>
      <p style="margin:0 0 10px;color:#6b7280;font-size:14px">${safe(company?.name || 'A company on MyTechZ')} · ${safe(jobLocation(job))}</p>
      <p style="margin:0 0 14px;font-size:13px;color:#374151">
        ${jobType ? `<span style="background:#eff6ff;color:#1e40af;padding:3px 8px;border-radius:999px;margin-right:6px">${safe(jobType)}</span>` : ''}
        ${workMode ? `<span style="background:#f0fdf4;color:#15803d;padding:3px 8px;border-radius:999px">${safe(workMode)}</span>` : ''}
      </p>
      <a href="${jobUrl(job)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:9px 18px;border-radius:8px;font-size:14px;font-weight:600">View Job</a>
    </div>
  `
}

function wrapper(bodyHtml) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px">
      <h2 style="margin:0 0 16px;color:#1e40af">MyTechZ</h2>
      ${bodyHtml}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="font-size:12px;color:#9ca3af">
        You're receiving this because job alerts are enabled on your MyTechZ account.
        <a href="${SITE}/settings" style="color:#2563eb">Manage your notification preferences</a>.
      </p>
    </div>
  `
}

/** Single-job "instant" alert email. */
export function jobAlertEmailHtml(job, company) {
  return wrapper(`
    <p style="color:#374151;font-size:14px">A new job matching your preferences was just posted:</p>
    ${jobCard(job, company)}
  `)
}

export function jobAlertEmailText(job, company) {
  return `New job: ${job.title} at ${company?.name || 'a company on MyTechZ'} (${jobLocation(job)})\n${jobUrl(job)}\n\nManage your alerts: ${SITE}/settings`
}

/** Batched daily/weekly digest email — one or more jobs. */
export function jobDigestEmailHtml(entries) {
  return wrapper(`
    <p style="color:#374151;font-size:14px">${entries.length} new job${entries.length === 1 ? '' : 's'} matching your preferences:</p>
    ${entries.map(({ job, company }) => jobCard(job, company)).join('')}
  `)
}

export function jobDigestEmailText(entries) {
  return entries
    .map(({ job, company }) => `${job.title} at ${company?.name || 'a company on MyTechZ'} — ${jobUrl(job)}`)
    .join('\n') + `\n\nManage your alerts: ${SITE}/settings`
}
