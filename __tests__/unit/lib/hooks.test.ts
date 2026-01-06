import { getAllHooks, getLatestHooks, getHookById } from '@/lib/hooks'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/hooks.json', () => jest.requireActual('../../../__mocks__/data/hooks.json'))

describe('getAllHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all hooks from JSON data', async () => {
    const result = await getAllHooks()

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('hook-1')
    expect(result[1].id).toBe('hook-2')
    expect(result[2].id).toBe('hook-3')
  })

  test('should return hooks sorted by creation date (newest first)', async () => {
    const result = await getAllHooks()

    // Should be sorted by git creation date (newest first): hook-1 (2024-01-15), hook-2 (2024-01-14), hook-3 (2024-01-13)
    expect(result[0].date).toBe('2024-01-15')
    expect(result[1].date).toBe('2024-01-14')
    expect(result[2].date).toBe('2024-01-13')
  })

  test('should return empty array when JSON processing fails', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/hooks.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getAllHooks: getAllHooksWithError } = await import('@/lib/hooks')
    
    const result = await getAllHooksWithError()

    expect(result).toHaveLength(0)
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should use git creation date for sorting when available', async () => {
    const result = await getAllHooks()

    // Hook 1 has git info, should be sorted by git creation date
    expect(result[0].git?.createdDate).toBe('2024-01-15T10:00:00Z')
  })

  test('should fallback to frontmatter date when git creation date is not available', async () => {
    // Mock data with mixed git availability
    const mockDataWithMixedGit = [
      {
        type: 'hook',
        id: 'hook-with-git',
        title: 'Hook With Git',
        author: 'Author',
        date: '2024-01-10',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'userTriggered',
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
        type: 'hook',
        id: 'hook-without-git',
        title: 'Hook Without Git',
        author: 'Author',
        date: '2024-01-25',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'onFileSave'
        // No git property
      }
    ]

    jest.doMock('@/data/hooks.json', () => mockDataWithMixedGit)
    jest.resetModules()
    const { getAllHooks: getAllHooksWithMixedGit } = await import('@/lib/hooks')

    const result = await getAllHooksWithMixedGit()

    expect(result).toHaveLength(2)
    // Hook without git should be first (2024-01-25 > 2024-01-20)
    expect(result[0].id).toBe('hook-without-git')
    expect(result[1].id).toBe('hook-with-git')
  })

  test('should sort by frontmatter date when both hooks lack git creation date', async () => {
    // Mock data with no git information
    const mockDataWithoutGit = [
      {
        type: 'hook',
        id: 'hook-older',
        title: 'Older Hook',
        author: 'Author',
        date: '2024-01-10',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'userTriggered'
        // No git property
      },
      {
        type: 'hook',
        id: 'hook-newer',
        title: 'Newer Hook',
        author: 'Author',
        date: '2024-01-20',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'onFileSave'
        // No git property
      }
    ]

    jest.doMock('@/data/hooks.json', () => mockDataWithoutGit)
    jest.resetModules()
    const { getAllHooks: getAllHooksWithoutGit } = await import('@/lib/hooks')

    const result = await getAllHooksWithoutGit()

    expect(result).toHaveLength(2)
    // Newer hook should be first (2024-01-20 > 2024-01-10)
    expect(result[0].id).toBe('hook-newer')
    expect(result[1].id).toBe('hook-older')
  })

  test('should cover dateB fallback when first item has git but second does not', async () => {
    // Mock data specifically to test dateB fallback (line 22)
    const mockDataForDateBFallback = [
      {
        type: 'hook',
        id: 'hook-without-git',
        title: 'Hook Without Git',
        author: 'Author',
        date: '2024-01-15',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'userTriggered'
        // No git property - this will be dateA
      },
      {
        type: 'hook',
        id: 'hook-with-git',
        title: 'Hook With Git',
        author: 'Author',
        date: '2024-01-25',
        path: 'test/path',
        content: 'content',
        description: 'description',
        trigger: 'onFileSave',
        git: {
          author: 'Git Author',
          authorEmail: 'git@example.com',
          createdDate: '2024-01-10T10:00:00Z',
          lastModifiedDate: '2024-01-10T10:00:00Z',
          commitHash: 'abc123',
          commitMessage: 'commit'
        }
      }
    ]

    jest.doMock('@/data/hooks.json', () => mockDataForDateBFallback)
    jest.resetModules()
    const { getAllHooks: getAllHooksDateBTest } = await import('@/lib/hooks')

    const result = await getAllHooksDateBTest()

    expect(result).toHaveLength(2)
    // Hook without git should be first (2024-01-15 > 2024-01-10)
    expect(result[0].id).toBe('hook-without-git')
    expect(result[1].id).toBe('hook-with-git')
  })
})

describe('getLatestHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all hooks when no limit specified', async () => {
    const result = await getLatestHooks()

    expect(result).toHaveLength(3)
  })

  test('should return limited number of hooks when limit specified', async () => {
    const result = await getLatestHooks(2)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('hook-1') // Should be the newest
    expect(result[1].id).toBe('hook-2')
  })

  test('should return all hooks when limit is larger than available hooks', async () => {
    const result = await getLatestHooks(10)

    expect(result).toHaveLength(3)
  })

  test('should return empty array when limit is 0', async () => {
    const result = await getLatestHooks(0)

    expect(result).toEqual([])
  })

  test('should return empty array when limit is negative', async () => {
    const result = await getLatestHooks(-1)

    expect(result).toEqual([])
  })

  test('should handle errors gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/hooks.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getLatestHooks: getLatestHooksWithError } = await import('@/lib/hooks')

    const result = await getLatestHooksWithError(5)

    expect(result).toHaveLength(0)
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should return empty array when no hooks available', async () => {
    // Mock empty array
    jest.doMock('@/data/hooks.json', () => [])
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getLatestHooks: getLatestHooksEmpty } = await import('@/lib/hooks')

    const result = await getLatestHooksEmpty(5)

    expect(result).toEqual([])
  })
})

describe('getHookById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return hook when found by ID', async () => {
    const result = await getHookById('hook-1')

    expect(result).not.toBeNull()
    expect(result?.id).toBe('hook-1')
    expect(result?.title).toBe('Test Hook 1')
  })

  test('should return null when hook not found', async () => {
    const result = await getHookById('non-existent-hook')

    expect(result).toBeNull()
  })

  test('should handle errors gracefully and return null', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/hooks.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getHookById: getHookByIdWithError } = await import('@/lib/hooks')

    const result = await getHookByIdWithError('hook-1')

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })
})