'use server'

import { getJobs } from '@/lib/jobs/queries'
import { fetchSavedJobUrls } from '@/lib/jobs/savedJobs'

/**
 * Server action for "Load more" on the Mumbai jobs landing page.
 * Location is pinned to Mumbai regardless of caller-supplied filters, so
 * pagination can never drift into other cities' listings.
 */
export async function loadMoreMumbaiJobsAction(filters) {
  const [{ jobs, perPage, error }, savedJobUrls] = await Promise.all([
    getJobs({ ...filters, location: 'Mumbai' }),
    fetchSavedJobUrls(),
  ])
  if (error) return { jobs: [], hasMore: false, savedJobUrls }
  return { jobs, hasMore: jobs.length >= perPage, savedJobUrls }
}
