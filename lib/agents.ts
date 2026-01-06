import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './formatter/date'
import type { Agent } from './types/content'

// Import static JSON data generated at build time
import agentsData from '@/data/agents.json'

/**
 * Get all agents from all available libraries
 * Uses static JSON data generated at build time for optimal performance
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllAgents = cache(async (): Promise<Agent[]> => {
  try {
    // Cast imported JSON to proper TypeScript type
    // Use unknown first to avoid TypeScript union type issues
    const allAgents = agentsData as unknown as Agent[]
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allAgents.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching agents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest agents with optional limit
 * Used for homepage to display most recent agents
 * Defaults to returning all agents if no limit specified
 */
export const getLatestAgents = cache(async (limit?: number): Promise<Agent[]> => {
    const allAgents = await getAllAgents()
    
    // Return limited results if limit specified and greater than 0
    if (limit !== undefined && limit > 0) {
      return allAgents.slice(0, limit)
    }
    
    // Return empty array if limit is 0 or negative
    if (limit !== undefined && limit <= 0) {
      return []
    }
    
    // Return all agents if no limit
    return allAgents
})

/**
 * Get a specific agent by ID
 * Used for detail pages to display individual agents
 * Returns null if agent is not found
 */
export const getAgentById = cache(async (id: string): Promise<Agent | null> => {
    const allAgents = await getAllAgents()
    
    // Find agent with matching ID
    const agent = allAgents.find(a => a.id === id)
    return agent || null
})