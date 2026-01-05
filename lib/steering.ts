import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './formatter/date'
import type { SteeringDocument } from './types/content'

// Import static JSON data generated at build time
import steeringData from '@/data/steering.json'

/**
 * Get all steering documents from all available libraries
 * Uses static JSON data generated at build time for optimal performance
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllSteering = cache(async (): Promise<SteeringDocument[]> => {
  try {
    // Cast imported JSON to proper TypeScript type
    const allSteering = steeringData as SteeringDocument[]
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allSteering.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching steering documents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest steering documents with optional limit
 * Used for homepage to display most recent steering documents
 * Defaults to returning all steering documents if no limit specified
 */
export const getLatestSteering = cache(async (limit?: number): Promise<SteeringDocument[]> => {
    const allSteering = await getAllSteering()
    
    // Return limited results if limit specified
    if (limit && limit > 0) {
      return allSteering.slice(0, limit)
    }
    
    // Return all steering documents if no limit
    return allSteering
})

/**
 * Get a specific steering document by ID
 * Used for detail pages to display individual steering documents
 * Returns null if steering document is not found
 */
export const getSteeringById = cache(async (id: string): Promise<SteeringDocument | null> => {
    const allSteering = await getAllSteering()
    
    // Find steering document with matching ID
    const steering = allSteering.find(s => s.id === id)
    
    return steering || null
})