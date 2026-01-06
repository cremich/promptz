import { getAllPowers, getLatestPowers, getPowerById } from '@/lib/powers'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/powers.json', () => jest.requireActual('../../../__mocks__/data/powers.json'))

describe('Powers Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPowers', () => {
    test('should fetch powers from JSON data and sort by date', async () => {
      const result = await getAllPowers()

      expect(result).toHaveLength(2)
      // Should be sorted by git creation date (newest first): kiro-power (2024-01-20), promptz-power (2024-01-15)
      expect(result[0].id).toBe('kiro-power')
      expect(result[1].id).toBe('promptz-power')
    })

    test('should sort powers by creation date (newest first)', async () => {
      const result = await getAllPowers()

      expect(result).toHaveLength(2)
      // Verify git dates are used for sorting
      expect(result[0].git?.createdDate).toBe('2024-01-20T10:00:00Z')
      expect(result[1].git?.createdDate).toBe('2024-01-15T10:00:00Z')
    })

    test('should fallback to frontmatter date when git creation date is not available', async () => {
      // Mock data with mixed git availability
      const mockDataWithMixedGit = [
        {
          type: 'power',
          id: 'power-with-git',
          title: 'Power With Git',
          author: 'Author',
          date: '2024-01-10',
          path: 'test/path',
          content: 'content',
          description: 'description',
          keywords: ['test'],
          git: {
            author: 'Git Author',
            authorEmail: 'git@example.com',
            createdDate: '2024-01-20T10:00:00Z',
            lastModifiedDate: '2024-01-20T10:00:00Z',
            commitHash: 'abc123',
            commitMessage: 'commit'
          }
        },
        {
          type: 'power',
          id: 'power-without-git',
          title: 'Power Without Git',
          author: 'Author',
          date: '2024-01-25',
          path: 'test/path',
          content: 'content',
          description: 'description',
          keywords: ['test']
          // No git property
        }
      ]

      jest.doMock('@/data/powers.json', () => mockDataWithMixedGit)
      jest.resetModules()
      const { getAllPowers: getAllPowersWithMixedGit } = await import('@/lib/powers')

      const result = await getAllPowersWithMixedGit()

      expect(result).toHaveLength(2)
      // Power without git should be first (2024-01-25 > 2024-01-20)
      expect(result[0].id).toBe('power-without-git')
      expect(result[1].id).toBe('power-with-git')
    })

    test('should sort by frontmatter date when both powers lack git creation date', async () => {
      // Mock data with no git information
      const mockDataWithoutGit = [
        {
          type: 'power',
          id: 'power-older',
          title: 'Older Power',
          author: 'Author',
          date: '2024-01-10',
          path: 'test/path',
          content: 'content',
          description: 'description',
          keywords: ['test']
          // No git property
        },
        {
          type: 'power',
          id: 'power-newer',
          title: 'Newer Power',
          author: 'Author',
          date: '2024-01-20',
          path: 'test/path',
          content: 'content',
          description: 'description',
          keywords: ['test']
          // No git property
        }
      ]

      jest.doMock('@/data/powers.json', () => mockDataWithoutGit)
      jest.resetModules()
      const { getAllPowers: getAllPowersWithoutGit } = await import('@/lib/powers')

      const result = await getAllPowersWithoutGit()

      expect(result).toHaveLength(2)
      // Newer power should be first (2024-01-20 > 2024-01-10)
      expect(result[0].id).toBe('power-newer')
      expect(result[1].id).toBe('power-older')
    })

    test('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/powers.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllPowers: getAllPowersWithError } = await import('@/lib/powers')
      
      const result = await getAllPowersWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getLatestPowers', () => {
    test('should return all powers when no limit is specified', async () => {
      const result = await getLatestPowers()

      expect(result).toHaveLength(2)
    })

    test('should return all powers when limit is undefined', async () => {
      const result = await getLatestPowers(undefined)

      expect(result).toHaveLength(2)
    })

    test('should limit results when limit is specified', async () => {
      const result = await getLatestPowers(1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('kiro-power') // Should be the newest
    })

    test('should handle limit larger than available powers', async () => {
      const result = await getLatestPowers(10)

      expect(result).toHaveLength(2)
    })

    test('should handle limit of 0', async () => {
      const result = await getLatestPowers(0)

      expect(result).toHaveLength(2) // Returns all when limit is 0
    })

    test('should handle negative limit', async () => {
      const result = await getLatestPowers(-1)

      expect(result).toHaveLength(2) // Returns all when limit is negative
    })

    test('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/powers.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestPowers: getLatestPowersWithError } = await import('@/lib/powers')

      const result = await getLatestPowersWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getPowerById', () => {
    test('should return power when found by ID', async () => {
      const result = await getPowerById('kiro-power')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('kiro-power')
      expect(result?.title).toBe('Kiro Power')
    })

    test('should return null when power not found', async () => {
      const result = await getPowerById('non-existent-power')

      expect(result).toBeNull()
    })

    test('should handle errors gracefully and return null', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/powers.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getPowerById: getPowerByIdWithError } = await import('@/lib/powers')

      const result = await getPowerByIdWithError('kiro-power')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})