'use server'

import { getJobs } from './queries'
import { fetchSavedJobUrls } from './savedJobs'

/**
 * Server action for "Load more" in JobsListingPage.
 * Returns { jobs, hasMore, savedJobUrls } for the requested page. Refetching
 * savedJobUrls here (not just on initial page load) keeps newly-appended
 * cards' bookmark state correct too, instead of every "load more" page
 * defaulting to unsaved regardless of the DB.
 */
export async function loadMoreJobsAction(filters) {
  const [{ jobs, perPage, error }, savedJobUrls] = await Promise.all([
    getJobs(filters),
    fetchSavedJobUrls(),
  ])
  if (error) return { jobs: [], hasMore: false, savedJobUrls }
  return { jobs, hasMore: jobs.length >= perPage, savedJobUrls }
}
