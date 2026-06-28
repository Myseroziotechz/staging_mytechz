'use server'

import { getJobs } from './queries'

/**
 * Server action for "Load more" in JobsListingPage.
 * Returns { jobs, hasMore } for the requested page.
 */
export async function loadMoreJobsAction(filters) {
  const { jobs, perPage, error } = await getJobs(filters)
  if (error) return { jobs: [], hasMore: false }
  return { jobs, hasMore: jobs.length >= perPage }
}
