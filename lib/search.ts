import type { FuseResultMatch } from 'fuse.js'
import type { SearchIndexItem } from '@/lib/types/content'
import React from 'react'

/**
 * Error types for search functionality
 */
export type SearchErrorType = 'index_load_failed' | 'index_malformed' | 'search_failed' | 'partial_data'

export interface SearchError {
  type: SearchErrorType
  message: string
  userMessage: string
  canRetry: boolean
}

/**
 * Highlights matching text within a string based on Fuse.js match indices.
 * Returns an array of React elements with <mark> tags around matched portions.
 * This avoids dangerouslySetInnerHTML and prevents XSS from untrusted content titles.
 */
export function highlightMatches(text: string, matches?: readonly FuseResultMatch[]): React.ReactNode {
  if (!matches || matches.length === 0) return text
  
  // Find matches for the title field
  const titleMatch = matches.find(match => match.key === 'title')
  if (!titleMatch || !titleMatch.indices) return text
  
  // Sort indices by start position ascending, then build segments
  const indices = [...titleMatch.indices].sort((a, b) => a[0] - b[0])
  const parts: React.ReactNode[] = []
  let cursor = 0
  
  indices.forEach(([start, end], i) => {
    if (start > cursor) {
      parts.push(text.slice(cursor, start))
    }
    parts.push(
      React.createElement(
        'mark',
        { key: i, className: 'bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded' },
        text.slice(start, end + 1)
      )
    )
    cursor = end + 1
  })
  
  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }
  
  return parts
}

/**
 * Validates search index data structure
 * Returns validated items and any validation errors
 */
export function validateSearchIndex(data: unknown): { 
  items: SearchIndexItem[]
  isPartial: boolean
  validationErrors: string[]
} {
  const validationErrors: string[] = []
  let items: SearchIndexItem[] = []
  let isPartial = false

  // Check if data has expected structure
  if (!data || typeof data !== 'object') {
    validationErrors.push('Search index data is not an object')
    return { items: [], isPartial: false, validationErrors }
  }

  const indexData = data as Record<string, unknown>

  // Check for items array
  if (!Array.isArray(indexData.items)) {
    validationErrors.push('Search index missing items array')
    return { items: [], isPartial: false, validationErrors }
  }

  // Validate each item and filter out malformed entries
  const rawItems = indexData.items as unknown[]
  items = rawItems.filter((item, index): item is SearchIndexItem => {
    if (!item || typeof item !== 'object') {
      validationErrors.push(`Item at index ${index} is not an object`)
      isPartial = true
      return false
    }

    const itemObj = item as Record<string, unknown>

    // Check required fields
    const requiredFields = ['id', 'type', 'title', 'path']
    const missingFields = requiredFields.filter(field => !itemObj[field])
    
    if (missingFields.length > 0) {
      validationErrors.push(`Item at index ${index} missing fields: ${missingFields.join(', ')}`)
      isPartial = true
      return false
    }

    // Validate type field
    const validTypes = ['prompt', 'agent', 'power', 'steering', 'hook']
    if (!validTypes.includes(itemObj.type as string)) {
      validationErrors.push(`Item at index ${index} has invalid type: ${itemObj.type}`)
      isPartial = true
      return false
    }

    return true
  })

  // Log validation errors for debugging (not exposed to users)
  if (validationErrors.length > 0) {
    console.warn('Search index validation warnings:', validationErrors)
  }

  return { items, isPartial, validationErrors }
}

/**
 * Creates a user-friendly error object based on error type
 */
export function createSearchError(type: SearchErrorType, originalError?: unknown): SearchError {
  // Log original error for debugging
  if (originalError) {
    console.error('Search error details:', originalError)
  }

  const errorMap: Record<SearchErrorType, SearchError> = {
    index_load_failed: {
      type: 'index_load_failed',
      message: originalError instanceof Error ? originalError.message : 'Unknown error',
      userMessage: 'Unable to load search data. Please try again.',
      canRetry: true
    },
    index_malformed: {
      type: 'index_malformed',
      message: 'Search index data is corrupted or malformed',
      userMessage: 'Search data appears to be corrupted. Please try again later.',
      canRetry: true
    },
    search_failed: {
      type: 'search_failed',
      message: originalError instanceof Error ? originalError.message : 'Search processing failed',
      userMessage: 'Search encountered an error. Please try a different query.',
      canRetry: false
    },
    partial_data: {
      type: 'partial_data',
      message: 'Some search data could not be loaded',
      userMessage: 'Some content may not appear in search results.',
      canRetry: false
    }
  }

  return errorMap[type]
}

/**
 * Content type configuration for display
 */
export const contentTypeConfig = {
  prompt: { badge: 'Prompt', color: 'blue' },
  agent: { badge: 'Agent', color: 'green' },
  power: { badge: 'Power', color: 'purple' },
  steering: { badge: 'Steering', color: 'orange' },
  hook: { badge: 'Hook', color: 'red' }
} as const
