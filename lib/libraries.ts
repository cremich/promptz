/**
 * Libraries service for managing library metadata and statistics
 */

import 'server-only'
import { cache } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getAllPrompts } from './prompts'
import { getAllAgents } from './agents'
import { getAllPowers } from './powers'
import { getAllSteering } from './steering'
import { getAllHooks } from './hooks'
import { getLibraryName } from './library'
import type { ContentItem } from './types/content'

export interface LibraryInfo {
  id: string
  name: string
  displayName: string
  description: string
  repositoryUrl: string
  owner: string
  path: string
  readme?: string
  license?: string
  contentStats: {
    prompts: number
    agents: number
    powers: number
    steering: number
    hooks: number
    total: number
  }
  lastUpdated?: string
  category: 'official' | 'community' | 'individual'
}

/**
 * Extract repository information from git submodules
 */
async function getRepositoryInfo(): Promise<Record<string, { url: string; path: string }>> {
  try {
    const gitmodulesContent = await readFile('.gitmodules', 'utf-8')
    return parseGitmodules(gitmodulesContent)
  } catch {
    console.error('Error reading .gitmodules')
    return {}
  }
}

/**
 * Parse gitmodules content and extract repository information
 */
function parseGitmodules(content: string): Record<string, { url: string; path: string }> {
  const repositories: Record<string, { url: string; path: string }> = {}
  const submoduleBlocks = content.split('[submodule').filter(block => block.trim())
  
  for (const block of submoduleBlocks) {
    const repoInfo = parseSubmoduleBlock(block)
    if (repoInfo) {
      repositories[repoInfo.name] = { url: repoInfo.url, path: repoInfo.path }
    }
  }
  
  return repositories
}

/**
 * Parse a single submodule block
 */
function parseSubmoduleBlock(block: string): { name: string; url: string; path: string } | null {
  const lines = block.split('\n').map(line => line.trim()).filter(line => line)
  let name = ''
  let path = ''
  let url = ''
  
  for (const line of lines) {
    if (line.startsWith('"') && line.endsWith('"]')) {
      name = line.slice(1, -2)
    } else if (line.startsWith('path = ')) {
      path = line.replace('path = ', '')
    } else if (line.startsWith('url = ')) {
      url = line.replace('url = ', '')
    }
  }
  
  if (name && path && url) {
    const libraryName = path.split('/').pop() || name
    return { name: libraryName, url, path }
  }
  
  return null
}

/**
 * Read README content for a library
 */
async function getLibraryReadme(libraryPath: string): Promise<string | undefined> {
  try {
    const readmePath = join(libraryPath, 'README.md')
    const content = await readFile(readmePath, 'utf-8')
    return content
  } catch {
    // README not found or not readable
    return undefined
  }
}

/**
 * Extract description from README content
 */
function extractDescription(readme: string): string {
  const lines = readme.split('\n')
  
  // Look for the first paragraph after the title
  let foundTitle = false
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.startsWith('# ')) {
      foundTitle = true
      continue
    }
    
    if (foundTitle && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('[![')) {
      return trimmed
    }
  }
  
  return 'A library of AI development resources'
}

/**
 * Determine library category based on owner and name
 */
function getLibraryCategory(owner: string, name: string): 'official' | 'community' | 'individual' {
  if (owner.includes('kirodotdev') || name.includes('kiro-powers')) {
    return 'official'
  }
  
  if (name.includes('product-teams')) {
    return 'individual'
  }
  
  return 'community'
}

/**
 * Extract owner from repository URL
 */
function extractOwner(repositoryUrl: string): string {
  try {
    const url = new URL(repositoryUrl.replace('git@github.com:', 'https://github.com/'))
    const pathParts = url.pathname.split('/').filter(part => part)
    return pathParts[0] || 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Calculate content statistics for a library
 */
function calculateLibraryStats(allContent: ContentItem[], libraryName: string) {
  const libraryContent = allContent.filter(item => getLibraryName(item.path) === libraryName)
  
  const stats = {
    prompts: 0,
    agents: 0,
    powers: 0,
    steering: 0,
    hooks: 0,
    total: 0
  }
  
  for (const item of libraryContent) {
    switch (item.type) {
      case 'prompt':
        stats.prompts++
        break
      case 'agent':
        stats.agents++
        break
      case 'power':
        stats.powers++
        break
      case 'steering':
        stats.steering++
        break
      case 'hook':
        stats.hooks++
        break
    }
    stats.total++
  }
  
  return stats
}

/**
 * Process a single library and create LibraryInfo
 */
async function processLibrary(
  libraryName: string,
  repoInfo: { url: string; path: string },
  allContent: ContentItem[]
): Promise<LibraryInfo> {
  const owner = extractOwner(repoInfo.url)
  const category = getLibraryCategory(owner, libraryName)
  const contentStats = calculateLibraryStats(allContent, libraryName)
  
  // Read README for description
  let readme: string | undefined
  let description = 'A library of AI development resources'
  
  try {
    readme = await getLibraryReadme(repoInfo.path)
    if (readme) {
      description = extractDescription(readme)
    }
  } catch {
    // README not found or not readable, use default description
  }
  
  // Create display name
  const displayName = libraryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    id: libraryName,
    name: libraryName,
    displayName,
    description,
    repositoryUrl: repoInfo.url,
    owner,
    path: repoInfo.path,
    readme,
    contentStats,
    category,
  }
}

/**
 * Get all available libraries with their metadata and statistics
 */
export const getAllLibraries = cache(async (): Promise<LibraryInfo[]> => {
  try {
    const repositories = await getRepositoryInfo()
    
    // Get all content first
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
    
    const libraries: LibraryInfo[] = []
    
    for (const [libraryName, repoInfo] of Object.entries(repositories)) {
      const library = await processLibrary(libraryName, repoInfo, allContent)
      libraries.push(library)
    }
    
    // Sort by total content count (descending), then by category (official first), then by name
    return libraries.sort((a, b) => {
      // First, sort by content count (most content first)
      if (a.contentStats.total !== b.contentStats.total) {
        return b.contentStats.total - a.contentStats.total
      }
      
      // If content count is the same, sort by category
      if (a.category !== b.category) {
        const categoryOrder = { official: 0, community: 1, individual: 2 }
        return categoryOrder[a.category] - categoryOrder[b.category]
      }
      
      // Finally, sort by display name
      return a.displayName.localeCompare(b.displayName)
    })
  } catch {
    console.error('Error fetching libraries')
    return []
  }
})

/**
 * Get a specific library by ID
 */
export const getLibraryById = cache(async (id: string): Promise<LibraryInfo | null> => {
  const libraries = await getAllLibraries()
  return libraries.find(lib => lib.id === id) || null
})