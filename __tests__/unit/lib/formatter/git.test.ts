import { getShortHash } from '@/lib/formatter/git'

describe('git formatter', () => {
  describe('getShortHash', () => {
    test('should return first 7 characters of a full commit hash', () => {
      const fullHash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
      const result = getShortHash(fullHash)
      expect(result).toBe('a1b2c3d')
    })

    test('should handle exactly 7 character hash', () => {
      const sevenCharHash = 'a1b2c3d'
      const result = getShortHash(sevenCharHash)
      expect(result).toBe('a1b2c3d')
    })

    test('should handle hash shorter than 7 characters', () => {
      const shortHash = 'abc123'
      const result = getShortHash(shortHash)
      expect(result).toBe('abc123')
    })

    test('should handle empty string', () => {
      const result = getShortHash('')
      expect(result).toBe('')
    })

    test('should handle typical git commit hash format', () => {
      const gitHash = '2f1acc6c7c3d056c3ca4ea2e9d3b0c8f95956afa'
      const result = getShortHash(gitHash)
      expect(result).toBe('2f1acc6')
    })

    test('should handle hash with mixed case characters', () => {
      const mixedCaseHash = 'A1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0'
      const result = getShortHash(mixedCaseHash)
      expect(result).toBe('A1B2c3D')
    })

    test('should handle hash with numbers only', () => {
      const numericHash = '1234567890123456789012345678901234567890'
      const result = getShortHash(numericHash)
      expect(result).toBe('1234567')
    })

    test('should handle hash with letters only', () => {
      const letterHash = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmn'
      const result = getShortHash(letterHash)
      expect(result).toBe('abcdefg')
    })

    test('should handle single character', () => {
      const singleChar = 'a'
      const result = getShortHash(singleChar)
      expect(result).toBe('a')
    })

    test('should handle special characters in hash', () => {
      const specialHash = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const result = getShortHash(specialHash)
      expect(result).toBe('!@#$%^&')
    })
  })
})