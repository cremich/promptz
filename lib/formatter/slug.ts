/**
 * Utility functions for converting between content IDs and URL-friendly slugs
 */

/**
 * Convert a content ID to a URL-friendly slug
 * Example: "promptz/prompts/java-heap-dump-analysis" -> "promptz-prompt-java-heap-dump-analysis"
 */
export function idToSlug(id: string): string {
  const parts = id.split('/')
  if (parts.length !== 3) {
    throw new Error(`Invalid ID format: ${id}. Expected format: library/type/name`)
  }
  
  const [library, type, name] = parts
  
  // Convert plural type to singular for cleaner URLs
  const singularType = type.endsWith('s') ? type.slice(0, -1) : type
  
  return `${library}-${singularType}-${name}`
}

/**
 * Convert a URL slug back to a content ID
 * Example: "promptz-prompt-java-heap-dump-analysis" -> "promptz/prompts/java-heap-dump-analysis"
 */
export function slugToId(slug: string): string {
  const parts = slug.split('-')
  if (parts.length < 3) {
    throw new Error(`Invalid slug format: ${slug}. Expected format: library-type-name`)
  }
  
  // We need to identify where the library name ends and type begins
  // We know the valid types, so we can work backwards
  const validTypes = ['prompt', 'agent', 'power', 'steering', 'hook']
  
  let libraryParts: string[] = []
  let type = ''
  let nameParts: string[] = []
  
  // Find the type by looking for valid singular types in the parts
  for (let i = 0; i < parts.length; i++) {
    if (validTypes.includes(parts[i])) {
      libraryParts = parts.slice(0, i)
      type = parts[i]
      nameParts = parts.slice(i + 1)
      break
    }
  }
  
  if (!type || libraryParts.length === 0 || nameParts.length === 0) {
    throw new Error(`Invalid slug format: ${slug}. Could not identify library, type, and name parts`)
  }
  
  const library = libraryParts.join('-')
  const name = nameParts.join('-')
  
  // Convert singular type back to plural for ID lookup
  const pluralType = getPluralType(type)
  
  return `${library}/${pluralType}/${name}`
}

/**
 * Convert singular content type to plural for ID lookup
 */
function getPluralType(singularType: string): string {
  const typeMap: Record<string, string> = {
    'prompt': 'prompts',
    'agent': 'agents',
    'power': 'powers',
    'steering': 'steering', // steering is already plural-like
    'hook': 'hooks'
  }
  
  return typeMap[singularType]
}

/**
 * Validate that a slug can be converted to a valid ID
 */
export function isValidSlug(slug: string): boolean {
  try {
    const id = slugToId(slug)
    const backToSlug = idToSlug(id)
    return backToSlug === slug
  } catch {
    return false
  }
}