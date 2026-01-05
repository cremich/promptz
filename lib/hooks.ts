import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './formatter/date'
import type { Hook } from './types/content'

// Import static JSON data generated at build time
import hooksData from '@/data/hooks.json'

/**
 * Get all hooks from all available libraries
 * Uses static JSON data generated at build time for optimal performance
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllHooks = cache(async (): Promise<Hook[]> => {
  try {
    // Cast imported JSON to proper TypeScript type
    const allHooks = hooksData as Hook[]
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allHooks.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching hooks:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest hooks with optional limit
 * Used for homepage to display most recent hooks
 * Defaults to returning all hooks if no limit specified
 */
export const getLatestHooks = cache(async (limit?: number): Promise<Hook[]> => {
    const allHooks = await getAllHooks()
    
    // Return limited results if limit specified and greater than 0
    if (limit !== undefined && limit > 0) {
      return allHooks.slice(0, limit)
    }
    
    // Return empty array if limit is 0 or negative
    if (limit !== undefined && limit <= 0) {
      return []
    }
    
    // Return all hooks if no limit
    return allHooks
})

/**
 * Get a specific hook by its ID
 * Used for hook detail pages
 * Returns null if hook not found
 */
export const getHookById = cache(async (id: string): Promise<Hook | null> => {
    const allHooks = await getAllHooks()
    
    // Find hook with matching ID
    const hook = allHooks.find(h => h.id === id)
    return hook || null
})