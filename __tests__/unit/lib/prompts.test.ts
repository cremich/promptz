import { getAllPrompts, getLatestPrompts, getPromptById } from '@/lib/prompts'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/prompts.json', () => jest.requireActual('../../../__mocks__/data/prompts.json'))

describe('Prompt utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPrompts', () => {
    it('should fetch prompts from JSON data and sort by date', async () => {
      const result = await getAllPrompts()

      expect(result).toHaveLength(3)
      // Should be sorted by date (newest first): B (2024-01-16), A (2024-01-15), C (2024-01-14)
      expect(result[0].id).toBe('prompt-b')
      expect(result[1].id).toBe('prompt-a')
      expect(result[2].id).toBe('prompt-c')
    })

    it('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/prompts.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllPrompts: getAllPromptsWithError } = await import('@/lib/prompts')
      
      const result = await getAllPromptsWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should fallback to frontmatter date when git creation date is not available', async () => {
      // Mock data with mixed git availability - specifically testing dateB fallback
      const mockDataWithMixedGit = [
        {
          type: 'prompt',
          id: 'prompt-with-git',
          title: 'Prompt With Git',
          author: 'Author',
          date: '2024-01-25',
          path: 'test/path',
          content: 'content',
          description: 'description',
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
          type: 'prompt',
          id: 'prompt-without-git',
          title: 'Prompt Without Git',
          author: 'Author',
          date: '2024-01-30',
          path: 'test/path',
          content: 'content',
          description: 'description'
          // No git property - this will test the dateB fallback
        }
      ]

      jest.doMock('@/data/prompts.json', () => mockDataWithMixedGit)
      jest.resetModules()
      const { getAllPrompts: getAllPromptsWithMixedGit } = await import('@/lib/prompts')

      const result = await getAllPromptsWithMixedGit()

      expect(result).toHaveLength(2)
      // Prompt without git should be first (2024-01-30 > 2024-01-20)
      expect(result[0].id).toBe('prompt-without-git')
      expect(result[1].id).toBe('prompt-with-git')
    })

    it('should sort by frontmatter date when both prompts lack git creation date', async () => {
      // Mock data with no git information
      const mockDataWithoutGit = [
        {
          type: 'prompt',
          id: 'prompt-older',
          title: 'Older Prompt',
          author: 'Author',
          date: '2024-01-10',
          path: 'test/path',
          content: 'content',
          description: 'description'
          // No git property
        },
        {
          type: 'prompt',
          id: 'prompt-newer',
          title: 'Newer Prompt',
          author: 'Author',
          date: '2024-01-20',
          path: 'test/path',
          content: 'content',
          description: 'description'
          // No git property
        }
      ]

      jest.doMock('@/data/prompts.json', () => mockDataWithoutGit)
      jest.resetModules()
      const { getAllPrompts: getAllPromptsWithoutGit } = await import('@/lib/prompts')

      const result = await getAllPromptsWithoutGit()

      expect(result).toHaveLength(2)
      // Newer prompt should be first (2024-01-20 > 2024-01-10)
      expect(result[0].id).toBe('prompt-newer')
      expect(result[1].id).toBe('prompt-older')
    })
  })

  describe('getLatestPrompts', () => {
    it('should return all prompts when no limit is specified', async () => {
      const result = await getLatestPrompts()

      expect(result).toHaveLength(3)
    })

    it('should limit results when limit is specified', async () => {
      const result = await getLatestPrompts(2)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('prompt-b')
      expect(result[1].id).toBe('prompt-a')
    })

    it('should return all prompts when limit is larger than available prompts', async () => {
      const result = await getLatestPrompts(10)

      expect(result).toHaveLength(3)
    })

    it('should handle zero or negative limits gracefully', async () => {
      const resultZero = await getLatestPrompts(0)
      const resultNegative = await getLatestPrompts(-1)

      expect(resultZero).toHaveLength(3) // Should return all when limit is 0
      expect(resultNegative).toHaveLength(3) // Should return all when limit is negative
    })

    it('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/prompts.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestPrompts: getLatestPromptsWithError } = await import('@/lib/prompts')

      const result = await getLatestPromptsWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getPromptById', () => {
    it('should return prompt when found by ID', async () => {
      const result = await getPromptById('prompt-a')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('prompt-a')
      expect(result?.title).toBe('Prompt A')
    })

    it('should return null when prompt not found', async () => {
      const result = await getPromptById('non-existent-prompt')

      expect(result).toBeNull()
    })

    it('should handle errors gracefully and return null', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/prompts.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getPromptById: getPromptByIdWithError } = await import('@/lib/prompts')

      const result = await getPromptByIdWithError('prompt-a')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})