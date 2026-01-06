import { getAllSteering, getLatestSteering, getSteeringById } from '@/lib/steering'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/steering.json', () => jest.requireActual('../../../__mocks__/data/steering.json'))

describe('Steering utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllSteering', () => {
    test('should fetch steering documents from JSON data and sort by date', async () => {
      const result = await getAllSteering()

      expect(result).toHaveLength(3)
      // Should be sorted by git creation date (newest first): steering-b (2024-01-16), steering-a (2024-01-15), steering-c (2024-01-14)
      expect(result[0].id).toBe('steering-b')
      expect(result[1].id).toBe('steering-a')
      expect(result[2].id).toBe('steering-c')
    })

    test('should use git creation date for sorting when available', async () => {
      const result = await getAllSteering()

      // Verify git dates are used for sorting
      expect(result[0].git?.createdDate).toBe('2024-01-16T10:00:00Z')
      expect(result[1].git?.createdDate).toBe('2024-01-15T10:00:00Z')
    })

    test('should fall back to frontmatter date when git info is not available', async () => {
      const result = await getAllSteering()

      // Document C has no git info, should use frontmatter date
      const docC = result.find(doc => doc.id === 'steering-c')
      expect(docC?.git).toBeUndefined()
      expect(docC?.date).toBe('2024-01-14')
    })

    test('should fallback to frontmatter date when git creation date is not available', async () => {
      // Mock data with mixed git availability
      const mockDataWithMixedGit = [
        {
          type: 'steering',
          id: 'steering-with-git',
          title: 'Steering With Git',
          author: 'Author',
          date: '2024-01-10',
          path: 'test/path',
          content: 'content',
          description: 'description',
          category: 'test',
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
          type: 'steering',
          id: 'steering-without-git',
          title: 'Steering Without Git',
          author: 'Author',
          date: '2024-01-25',
          path: 'test/path',
          content: 'content',
          description: 'description',
          category: 'test'
          // No git property
        }
      ]

      jest.doMock('@/data/steering.json', () => mockDataWithMixedGit)
      jest.resetModules()
      const { getAllSteering: getAllSteeringWithMixedGit } = await import('@/lib/steering')

      const result = await getAllSteeringWithMixedGit()

      expect(result).toHaveLength(2)
      // Steering without git should be first (2024-01-25 > 2024-01-20)
      expect(result[0].id).toBe('steering-without-git')
      expect(result[1].id).toBe('steering-with-git')
    })

    test('should sort by frontmatter date when both steering documents lack git creation date', async () => {
      // Mock data with no git information
      const mockDataWithoutGit = [
        {
          type: 'steering',
          id: 'steering-older',
          title: 'Older Steering',
          author: 'Author',
          date: '2024-01-10',
          path: 'test/path',
          content: 'content',
          description: 'description',
          category: 'test'
          // No git property
        },
        {
          type: 'steering',
          id: 'steering-newer',
          title: 'Newer Steering',
          author: 'Author',
          date: '2024-01-20',
          path: 'test/path',
          content: 'content',
          description: 'description',
          category: 'test'
          // No git property
        }
      ]

      jest.doMock('@/data/steering.json', () => mockDataWithoutGit)
      jest.resetModules()
      const { getAllSteering: getAllSteeringWithoutGit } = await import('@/lib/steering')

      const result = await getAllSteeringWithoutGit()

      expect(result).toHaveLength(2)
      // Newer steering should be first (2024-01-20 > 2024-01-10)
      expect(result[0].id).toBe('steering-newer')
      expect(result[1].id).toBe('steering-older')
    })

    test('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/steering.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllSteering: getAllSteeringWithError } = await import('@/lib/steering')
      
      const result = await getAllSteeringWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching steering documents:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getLatestSteering', () => {
    test('should return all steering documents when no limit is specified', async () => {
      const result = await getLatestSteering()

      expect(result).toHaveLength(3)
    })

    test('should limit results when limit is specified', async () => {
      const result = await getLatestSteering(2)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('steering-b')
      expect(result[1].id).toBe('steering-a')
    })

    test('should return all steering documents when limit is larger than available', async () => {
      const result = await getLatestSteering(10)

      expect(result).toHaveLength(3)
    })

    test('should handle zero or negative limits gracefully', async () => {
      const resultZero = await getLatestSteering(0)
      const resultNegative = await getLatestSteering(-1)

      expect(resultZero).toHaveLength(3) // Should return all when limit is 0
      expect(resultNegative).toHaveLength(3) // Should return all when limit is negative
    })

    test('should maintain sorting order when limiting results', async () => {
      const result = await getLatestSteering(1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('steering-b') // Should be the newest
    })

    test('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/steering.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestSteering: getLatestSteeringWithError } = await import('@/lib/steering')

      const result = await getLatestSteeringWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching steering documents:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getSteeringById', () => {
    test('should return steering document when found by ID', async () => {
      const result = await getSteeringById('steering-a')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('steering-a')
      expect(result?.title).toBe('Steering A')
    })

    test('should return null when steering document not found', async () => {
      const result = await getSteeringById('non-existent-steering')

      expect(result).toBeNull()
    })

    test('should handle errors gracefully and return null', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/steering.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getSteeringById: getSteeringByIdWithError } = await import('@/lib/steering')

      const result = await getSteeringByIdWithError('steering-a')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching steering documents:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})