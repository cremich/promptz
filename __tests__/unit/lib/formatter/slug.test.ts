import { idToSlug, slugToId, isValidSlug } from '@/lib/formatter/slug'

describe('slug-utils', () => {
  describe('idToSlug', () => {
    test('should convert valid ID to slug format', () => {
      const result = idToSlug('promptz/prompts/java-heap-dump-analysis')
      expect(result).toBe('promptz-prompt-java-heap-dump-analysis')
    })

    test('should handle different content types', () => {
      expect(idToSlug('kiro-powers/powers/stripe-integration')).toBe('kiro-powers-power-stripe-integration')
      expect(idToSlug('promptz/agents/code-reviewer')).toBe('promptz-agent-code-reviewer')
      expect(idToSlug('library/hooks/auto-format')).toBe('library-hook-auto-format')
      expect(idToSlug('docs/steering/best-practices')).toBe('docs-steering-best-practices')
    })

    test('should handle multi-word library names', () => {
      const result = idToSlug('my-custom-library/prompts/test-prompt')
      expect(result).toBe('my-custom-library-prompt-test-prompt')
    })

    test('should handle multi-word content names', () => {
      const result = idToSlug('promptz/prompts/complex-multi-word-prompt-name')
      expect(result).toBe('promptz-prompt-complex-multi-word-prompt-name')
    })

    test('should throw error for invalid ID format with too few parts', () => {
      expect(() => idToSlug('invalid-id')).toThrow('Invalid ID format: invalid-id. Expected format: library/type/name')
    })

    test('should throw error for invalid ID format with too many parts', () => {
      expect(() => idToSlug('library/type/name/extra')).toThrow('Invalid ID format: library/type/name/extra. Expected format: library/type/name')
    })

    test('should handle types that do not end with s', () => {
      const result = idToSlug('library/steering/guide')
      expect(result).toBe('library-steering-guide')
    })
  })

  describe('slugToId', () => {
    test('should convert valid slug back to ID format', () => {
      const result = slugToId('promptz-prompt-java-heap-dump-analysis')
      expect(result).toBe('promptz/prompts/java-heap-dump-analysis')
    })

    test('should handle different content types', () => {
      expect(slugToId('kiro-powers-power-stripe-integration')).toBe('kiro-powers/powers/stripe-integration')
      expect(slugToId('promptz-agent-code-reviewer')).toBe('promptz/agents/code-reviewer')
      expect(slugToId('library-hook-auto-format')).toBe('library/hooks/auto-format')
      expect(slugToId('docs-steering-best-practices')).toBe('docs/steering/best-practices')
    })

    test('should handle multi-word library names', () => {
      const result = slugToId('my-custom-library-prompt-test-prompt')
      expect(result).toBe('my-custom-library/prompts/test-prompt')
    })

    test('should handle multi-word content names', () => {
      const result = slugToId('promptz-prompt-complex-multi-word-prompt-name')
      expect(result).toBe('promptz/prompts/complex-multi-word-prompt-name')
    })

    test('should throw error for slug with too few parts', () => {
      expect(() => slugToId('invalid-slug')).toThrow('Invalid slug format: invalid-slug. Expected format: library-type-name')
    })

    test('should throw error for slug without valid type', () => {
      expect(() => slugToId('library-invalidtype-name')).toThrow('Invalid slug format: library-invalidtype-name. Could not identify library, type, and name parts')
    })

    test('should throw error for slug with no name parts', () => {
      expect(() => slugToId('library-prompt')).toThrow('Invalid slug format: library-prompt. Expected format: library-type-name')
    })

    test('should handle complex library names with valid types', () => {
      const result = slugToId('my-complex-library-name-prompt-test-content')
      expect(result).toBe('my-complex-library-name/prompts/test-content')
    })
  })

  describe('isValidSlug', () => {
    test('should return true for valid slugs', () => {
      expect(isValidSlug('promptz-prompt-java-heap-dump-analysis')).toBe(true)
      expect(isValidSlug('kiro-powers-power-stripe-integration')).toBe(true)
      expect(isValidSlug('library-agent-code-reviewer')).toBe(true)
      expect(isValidSlug('docs-hook-auto-format')).toBe(true)
      expect(isValidSlug('project-steering-best-practices')).toBe(true)
    })

    test('should return false for invalid slugs', () => {
      expect(isValidSlug('invalid-slug')).toBe(false)
      expect(isValidSlug('library-invalidtype-name')).toBe(false)
      expect(isValidSlug('library-prompt')).toBe(false)
      expect(isValidSlug('')).toBe(false)
    })

    test('should return true for complex valid slugs', () => {
      expect(isValidSlug('my-complex-library-name-prompt-test-content')).toBe(true)
      expect(isValidSlug('multi-word-library-agent-multi-word-agent-name')).toBe(true)
    })

    test('should handle round-trip conversion validation', () => {
      const validSlugs = [
        'promptz-prompt-test',
        'kiro-powers-power-stripe',
        'library-agent-reviewer',
        'docs-hook-formatter',
        'project-steering-guide'
      ]

      validSlugs.forEach(slug => {
        expect(isValidSlug(slug)).toBe(true)
      })
    })
  })
})