import { analytics } from '@/lib/analytics'

// Mock posthog
jest.mock('posthog-js', () => ({
  capture: jest.fn()
}))

import posthog from 'posthog-js'
const mockCapture = posthog.capture as jest.MockedFunction<typeof posthog.capture>

describe('analytics', () => {
  beforeEach(() => {
    mockCapture.mockClear()
  })

  describe('trackSearch', () => {
    test('should track search with correct parameters for queries 3+ characters', () => {
      const query = 'test query'
      const resultCount = 5
      const hasResults = true

      analytics.trackSearch(query, resultCount, hasResults)

      expect(mockCapture).toHaveBeenCalledWith('search_performed', {
        query: 'test query',
        result_count: 5,
        has_results: true,
        query_length: 10
      })
    })

    test('should trim query before tracking', () => {
      analytics.trackSearch('  spaced query  ', 3, true)

      expect(mockCapture).toHaveBeenCalledWith('search_performed', {
        query: 'spaced query',
        result_count: 3,
        has_results: true,
        query_length: 12
      })
    })

    test('should not track searches with less than 3 characters', () => {
      analytics.trackSearch('ab', 1, true)
      analytics.trackSearch('a', 0, false)
      analytics.trackSearch('', 0, false)

      expect(mockCapture).not.toHaveBeenCalled()
    })

    test('should track searches with exactly 3 characters', () => {
      analytics.trackSearch('abc', 2, true)

      expect(mockCapture).toHaveBeenCalledWith('search_performed', {
        query: 'abc',
        result_count: 2,
        has_results: true,
        query_length: 3
      })
    })

    test('should track searches with no results', () => {
      analytics.trackSearch('nonexistent', 0, false)

      expect(mockCapture).toHaveBeenCalledWith('search_performed', {
        query: 'nonexistent',
        result_count: 0,
        has_results: false,
        query_length: 11
      })
    })
  })
})