import fs from 'fs'
import matter from 'gray-matter'

export interface ParsedFile {
  content: string
  data: Record<string, unknown>
}

/**
 * Safely read a file and return null if it fails
 * Build-time version without Next.js cache
 */
export async function safeFileRead(filePath: string): Promise<string | null> {
  try {
    return await fs.promises.readFile(filePath, 'utf-8')
  } catch (error) {
    console.warn(`Failed to read file: ${filePath}`, error)
    return null
  }
}

/**
 * Parse YAML frontmatter from markdown content
 */
export function parseYamlFrontmatter(content: string): ParsedFile {
  try {
    const parsed = matter(content)
    return {
      content: parsed.content,
      data: parsed.data
    }
  } catch (error) {
    console.warn('Failed to parse YAML frontmatter', error)
    return {
      content,
      data: {}
    }
  }
}

/**
 * Parse JSON configuration file
 * Build-time version without Next.js cache
 */
export async function parseJsonConfig(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await safeFileRead(filePath)
    if (!content) return null
    
    return JSON.parse(content)
  } catch (error) {
    console.warn(`Failed to parse JSON config: ${filePath}`, error)
    return null
  }
}

/**
 * Check if a directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(dirPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

/**
 * Get all directories in a path
 */
export async function getDirectories(dirPath: string): Promise<string[]> {
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true })
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name)
  } catch (error) {
    console.warn(`Failed to read directories: ${dirPath}`, error)
    return []
  }
}

/**
 * Get all files in a directory with specific extension
 */
export async function getFilesWithExtension(dirPath: string, extension: string): Promise<string[]> {
  try {
    const items = await fs.promises.readdir(dirPath)
    return items.filter(item => item.endsWith(extension))
  } catch (error) {
    console.warn(`Failed to read files in: ${dirPath}`, error)
    return []
  }
}

/**
 * Generate title from filename
 */
export function generateTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
}

/**
 * Generate path-based ID
 */
export function generatePathId(libraryName: string, contentType: string, itemName: string): string {
  return `${libraryName}/${contentType}/${itemName}`
}

/**
 * Convert filename to URL-safe slug
 */
export function filenameToSlug(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
}

/**
 * Strip HTML tags from text to prevent XSS via untrusted submodule content.
 * Applied to titles, authors, and descriptions during build-time data generation.
 */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '')
}