import type { ContentItem } from '@/lib/types/content'

/**
 * Get the display author for content, prioritizing frontmatter over git
 * Follows the hierarchy: frontmatter author → git author → fallback
 */
export function getDisplayAuthor(content: ContentItem, fallback = 'Unknown Author'): string {
  return content.author || content.git?.author || fallback
}

/**
 * Get the display title for content, handling power-specific display names
 */
export function getDisplayTitle(content: ContentItem): string {
  if (content.type === 'power') {
    return content.displayName || content.title
  }
  return content.title
}

/**
 * Get content description with fallback
 */
export function getDisplayDescription(content: ContentItem): string {
  if ('description' in content) {
    return content.description
  }
  return ''
}