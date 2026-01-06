import posthog from 'posthog-js'

/**
 * Analytics utility for tracking user interactions with PostHog
 * Optimized for minimal event volume to preserve free tier limits
 */
export const analytics = {
  /**
   * Track search queries and results (only for meaningful searches)
   * Only tracks searches with 3+ characters to avoid excessive events
   */
  trackSearch: (query: string, resultCount: number, hasResults: boolean) => {
    if (typeof window === 'undefined') return
    
    const trimmedQuery = query.trim()
    
    // Only track searches with meaningful length to avoid excessive events
    if (trimmedQuery.length < 3) return
    
    posthog.capture('search_performed', {
      query: trimmedQuery,
      result_count: resultCount,
      has_results: hasResults,
      query_length: trimmedQuery.length
    })
  }
}