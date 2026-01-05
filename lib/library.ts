/**
 * Library utilities for extracting and working with library information from content paths
 */

import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './formatter/date'
import { getAllPrompts, getLatestPrompts } from './prompts'
import { getAllAgents, getLatestAgents } from './agents'
import { getAllPowers, getLatestPowers } from './powers'
import { getAllSteering, getLatestSteering } from './steering'
import { getAllHooks, getLatestHooks } from './hooks'
import type { ContentItem } from './types/content'

/**
 * Extract library name from content path
 * @param path - The full path to the content file
 * @returns The library name or 'unknown' if not found
 * 
 * @example
 * getLibraryName('libraries/kiro-powers/agents/test-agent') // returns 'kiro-powers'
 * getLibraryName('libraries/promptz/prompts/test-prompt') // returns 'promptz'
 * getLibraryName('invalid/path') // returns 'unknown'
 */
export function getLibraryName(path: string): string {
  const pathParts = path.split('/');
  const librariesIndex = pathParts.indexOf('libraries');
  if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
    const libraryName = pathParts[librariesIndex + 1];
    return libraryName || 'unknown';
  }
  return 'unknown';
}

/**
 * Get all content items across all content types
 * Combines prompts, agents, powers, steering, and hooks
 * Sorted by date (newest first)
 */
export const getAllContent = cache(async (): Promise<ContentItem[]> => {
  try {
    const [prompts, agents, powers, steering, hooks] = await Promise.all([
      getAllPrompts(),
      getAllAgents(),
      getAllPowers(),
      getAllSteering(),
      getAllHooks(),
    ])

    const allContent: ContentItem[] = [
      ...prompts,
      ...agents,
      ...powers,
      ...steering,
      ...hooks,
    ]

    return allContent.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
  } catch (error) {
    console.error('Error fetching all content:', error)
    return []
  }
})

/**
 * Get the latest content items across all content types
 * Combines prompts, agents, powers, steering, and hooks
 * Sorted by date (newest first)
 */
export const getLatestContent = cache(async (limit: number = 6): Promise<ContentItem[]> => {
  try {
    const fetchLimit = Math.ceil(limit / 5) + 2
    
    const [prompts, agents, powers, steering, hooks] = await Promise.all([
      getLatestPrompts(fetchLimit),
      getLatestAgents(fetchLimit),
      getLatestPowers(fetchLimit),
      getLatestSteering(fetchLimit),
      getLatestHooks(fetchLimit),
    ])

    const allContent: ContentItem[] = [
      ...prompts,
      ...agents,
      ...powers,
      ...steering,
      ...hooks,
    ]

    const sorted = allContent.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })

    return sorted.slice(0, limit)
  } catch (error) {
    console.error('Error fetching latest content:', error)
    return []
  }
})