import posthog from 'posthog-js'

/**
 * Simple rate limiter for analytics events.
 * Allows a max number of events within a rolling time window.
 */
const rateLimiter = {
  timestamps: [] as number[],
  maxEvents: 10,
  windowMs: 60_000, // 1 minute

  canSend(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs)
    if (this.timestamps.length >= this.maxEvents) return false
    this.timestamps.push(now)
    return true
  }
}

/**
 * Analytics utility for tracking user interactions with PostHog
 * Optimized for minimal event volume to preserve free tier limits
 */
export const analytics = {
  /**
   * Track search queries and results (only for meaningful searches)
   * Only tracks searches with 3+ characters to avoid excessive events
   * Rate-limited to 10 events per minute to prevent abuse
   */
  trackSearch: (query: string, resultCount: number, hasResults: boolean) => {
    if (typeof window === 'undefined') return
    
    const trimmedQuery = query.trim()
    
    // Only track searches with meaningful length to avoid excessive events
    if (trimmedQuery.length < 3) return

    // Rate limit to prevent analytics quota exhaustion
    if (!rateLimiter.canSend()) return
    
    posthog.capture('search_performed', {
      query: trimmedQuery,
      result_count: resultCount,
      has_results: hasResults,
      query_length: trimmedQuery.length
    })
  }
}