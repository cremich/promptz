import { idToSlug, slugToId, isValidSlug } from '@/lib/formatter/slug'

describe('slug-utils', () => {
  describe('idToSlug', () => {
    it('should convert prompt ID to slug', () => {
      expect(idToSlug('promptz/prompts/java-heap-dump-analysis')).toBe('promptz-prompt-java-heap-dump-analysis')
    })

    it('should convert agent ID to slug', () => {
      expect(idToSlug('promptz/agents/code-reviewer')).toBe('promptz-agent-code-reviewer')
    })

    it('should convert power ID to slug', () => {
      expect(idToSlug('kiro-powers/powers/stripe-integration')).toBe('kiro-powers-power-stripe-integration')
    })

    it('should handle multi-word names with hyphens', () => {
      expect(idToSlug('promptz/prompts/api-testing-best-practices')).toBe('promptz-prompt-api-testing-best-practices')
    })

    it('should throw error for invalid ID format', () => {
      expect(() => idToSlug('invalid-id')).toThrow('Invalid ID format')
      expect(() => idToSlug('too/many/parts/here')).toThrow('Invalid ID format')
    })
  })

  describe('slugToId', () => {
    it('should convert prompt slug to ID', () => {
      expect(slugToId('promptz-prompt-java-heap-dump-analysis')).toBe('promptz/prompts/java-heap-dump-analysis')
    })

    it('should convert agent slug to ID', () => {
      expect(slugToId('promptz-agent-code-reviewer')).toBe('promptz/agents/code-reviewer')
    })

    it('should convert power slug to ID', () => {
      expect(slugToId('kiro-powers-power-stripe-integration')).toBe('kiro-powers/powers/stripe-integration')
    })

    it('should handle multi-word names with hyphens', () => {
      expect(slugToId('promptz-prompt-api-testing-best-practices')).toBe('promptz/prompts/api-testing-best-practices')
    })

    it('should handle steering documents', () => {
      expect(slugToId('promptz-steering-security-guidelines')).toBe('promptz/steering/security-guidelines')
    })

    it('should throw error for invalid slug format', () => {
      expect(() => slugToId('invalid')).toThrow('Invalid slug format')
      expect(() => slugToId('too-short')).toThrow('Invalid slug format')
    })
  })

  describe('isValidSlug', () => {
    it('should validate correct slugs', () => {
      expect(isValidSlug('promptz-prompt-java-heap-dump-analysis')).toBe(true)
      expect(isValidSlug('kiro-powers-power-stripe-integration')).toBe(true)
      expect(isValidSlug('promptz-agent-code-reviewer')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(isValidSlug('invalid')).toBe(false)
      expect(isValidSlug('too-short')).toBe(false)
      expect(isValidSlug('')).toBe(false)
    })
  })

  describe('round-trip conversion', () => {
    it('should maintain consistency in both directions', () => {
      const testIds = [
        'promptz/prompts/java-heap-dump-analysis',
        'kiro-powers/powers/stripe-integration',
        'promptz/agents/code-reviewer',
        'promptz/steering/security-guidelines',
        'promptz/hooks/auto-format'
      ]

      testIds.forEach(id => {
        const slug = idToSlug(id)
        const backToId = slugToId(slug)
        expect(backToId).toBe(id)
      })
    })
  })
})