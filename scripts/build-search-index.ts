#!/usr/bin/env tsx

/**
 * Build-time script to generate search index from static JSON data
 * Integrates with existing prebuild process after generate-library-data.ts
 */

import path from 'path'
import fs from 'fs/promises'
import type { 
  Prompt, 
  Agent, 
  Power, 
  SteeringDocument, 
  Hook,
  ContentItem,
  SearchIndexItem,
  SearchIndex
} from '../lib/types/content'
import { idToSlug } from '../lib/formatter/slug'

const DATA_PATH = path.join(process.cwd(), 'data')
const SEARCH_INDEX_PATH = path.join(DATA_PATH, 'search-index.json')

/**
 * Main function to generate search index
 */
async function buildSearchIndex() {
  console.log('🔍 Starting search index generation...')
  
  try {
    // Read all existing JSON data files
    const [prompts, agents, powers, steering, hooks] = await Promise.allSettled([
      readJsonFile<Prompt[]>('prompts.json'),
      readJsonFile<Agent[]>('agents.json'),
      readJsonFile<Power[]>('powers.json'),
      readJsonFile<SteeringDocument[]>('steering.json'),
      readJsonFile<Hook[]>('hooks.json')
    ])
    
    // Extract successful data, fallback to empty arrays
    const promptsData = prompts.status === 'fulfilled' ? prompts.value : []
    const agentsData = agents.status === 'fulfilled' ? agents.value : []
    const powersData = powers.status === 'fulfilled' ? powers.value : []
    const steeringData = steering.status === 'fulfilled' ? steering.value : []
    const hooksData = hooks.status === 'fulfilled' ? hooks.value : []
    
    // Transform all content to search index items
    const searchItems: SearchIndexItem[] = [
      ...promptsData.map(transformToSearchItem),
      ...agentsData.map(transformToSearchItem),
      ...powersData.map(transformToSearchItem),
      ...steeringData.map(transformToSearchItem),
      ...hooksData.map(transformToSearchItem)
    ].filter(Boolean) // Remove any null/undefined items
    
    // Generate metadata
    const itemsByType = searchItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const searchIndex: SearchIndex = {
      items: searchItems,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalItems: searchItems.length,
        itemsByType
      }
    }
    
    // Write search index to file
    await fs.writeFile(
      SEARCH_INDEX_PATH, 
      JSON.stringify(searchIndex, null, 2), 
      'utf-8'
    )
    
    console.log(`✅ Generated search index with ${searchItems.length} items`)
    console.log('📊 Items by type:', itemsByType)
    
  } catch (error) {
    console.error('❌ Error generating search index:', error)
    // Create empty search index to prevent build failures
    const emptyIndex: SearchIndex = {
      items: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalItems: 0,
        itemsByType: {}
      }
    }
    
    await fs.writeFile(
      SEARCH_INDEX_PATH, 
      JSON.stringify(emptyIndex, null, 2), 
      'utf-8'
    )
    
    console.warn('⚠️  Created empty search index to continue build')
  }
}

/**
 * Read JSON file with error handling
 */
async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_PATH, filename)
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content) as T
}

/**
 * Transform content item to search index item
 */
function transformToSearchItem(item: ContentItem): SearchIndexItem {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: extractDescription(item),
    content: truncateContent(getContentText(item), 500),
    author: item.author,
    date: item.date,
    library: extractLibraryName(item.id),
    path: generateDetailPath(item.type, item.id),
    keywords: extractKeywords(item)
  }
}

/**
 * Extract library name from content ID
 */
function extractLibraryName(id: string): string {
  return id.split('/')[0] || 'unknown'
}

/**
 * Extract description from content item
 */
function extractDescription(item: ContentItem): string {
  // Use existing description if available
  if ('description' in item && item.description) {
    return item.description
  }
  
  // Extract from content
  const content = getContentText(item)
  const cleanContent = content
    .replace(/^#+\s+.*$/gm, '') // Remove headers
    .replace(/^\s*$/gm, '') // Remove empty lines
    .trim()
  
  const firstParagraph = cleanContent.split('\n\n')[0] || cleanContent.split('\n')[0] || ''
  
  return firstParagraph.length > 150 
    ? firstParagraph.substring(0, 150) + '...'
    : firstParagraph
}

/**
 * Get content text from content item
 */
function getContentText(item: ContentItem): string {
  return item.content || ''
}

/**
 * Truncate content for search index
 */
function truncateContent(content: string, maxLength: number): string {
  const cleanContent = content.replace(/#+\s+/g, '').trim()
  return cleanContent.length > maxLength 
    ? cleanContent.substring(0, maxLength) + '...'
    : cleanContent
}

/**
 * Extract keywords from content item
 */
function extractKeywords(item: ContentItem): string[] {
  const keywords: string[] = []
  
  // Add existing keywords if available
  if ('keywords' in item && item.keywords) {
    keywords.push(...item.keywords)
  }
  
  // Extract keywords from content
  const content = getContentText(item)
  const contentWords = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && word.length < 20)
    .filter(word => !commonWords.includes(word))
  
  // Add unique content words
  const uniqueWords = [...new Set(contentWords)]
  keywords.push(...uniqueWords.slice(0, 10))
  
  return [...new Set(keywords)].slice(0, 15)
}

/**
 * Generate detail page path for content item
 */
function generateDetailPath(type: string, id: string): string {
  try {
    const slug = idToSlug(id)
    return `/${type}s/${slug}`
  } catch {
    // Fallback to simple slug if idToSlug fails
    const simpleName = id.split('/').pop() || ''
    return `/${type}s/${simpleName}`
  }
}

/**
 * Common words to exclude from keyword extraction
 */
const commonWords = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with', 'this', 'that', 'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'
]

// Execute the main function
if (require.main === module) {
  buildSearchIndex()
    .then(() => {
      console.log('🎉 Search index generation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Fatal error during search index generation:', error)
      console.warn('⚠️  Exiting with success to continue build process')
      process.exit(0)
    })
}