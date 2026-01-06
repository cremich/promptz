import { getLibraryName, getAllContent, getLatestContent } from '@/lib/library'

// Mock the content service modules
jest.mock('@/lib/prompts', () => ({
  getAllPrompts: jest.fn(),
  getLatestPrompts: jest.fn()
}))

jest.mock('@/lib/agents', () => ({
  getAllAgents: jest.fn(),
  getLatestAgents: jest.fn()
}))

jest.mock('@/lib/powers', () => ({
  getAllPowers: jest.fn(),
  getLatestPowers: jest.fn()
}))

jest.mock('@/lib/steering', () => ({
  getAllSteering: jest.fn(),
  getLatestSteering: jest.fn()
}))

jest.mock('@/lib/hooks', () => ({
  getAllHooks: jest.fn(),
  getLatestHooks: jest.fn()
}))

// Import mocked modules
import { getAllPrompts, getLatestPrompts } from '@/lib/prompts'
import { getAllAgents, getLatestAgents } from '@/lib/agents'
import { getAllPowers, getLatestPowers } from '@/lib/powers'
import { getAllSteering, getLatestSteering } from '@/lib/steering'
import { getAllHooks, getLatestHooks } from '@/lib/hooks'

const mockGetAllPrompts = getAllPrompts as jest.MockedFunction<typeof getAllPrompts>
const mockGetAllAgents = getAllAgents as jest.MockedFunction<typeof getAllAgents>
const mockGetAllPowers = getAllPowers as jest.MockedFunction<typeof getAllPowers>
const mockGetAllSteering = getAllSteering as jest.MockedFunction<typeof getAllSteering>
const mockGetAllHooks = getAllHooks as jest.MockedFunction<typeof getAllHooks>

const mockGetLatestPrompts = getLatestPrompts as jest.MockedFunction<typeof getLatestPrompts>
const mockGetLatestAgents = getLatestAgents as jest.MockedFunction<typeof getLatestAgents>
const mockGetLatestPowers = getLatestPowers as jest.MockedFunction<typeof getLatestPowers>
const mockGetLatestSteering = getLatestSteering as jest.MockedFunction<typeof getLatestSteering>
const mockGetLatestHooks = getLatestHooks as jest.MockedFunction<typeof getLatestHooks>

describe('getLibraryName', () => {
  it('should extract library name from valid path with libraries directory', () => {
    expect(getLibraryName('libraries/kiro-powers/agents/test-agent')).toBe('kiro-powers')
    expect(getLibraryName('libraries/promptz/prompts/test-prompt')).toBe('promptz')
  })

  it('should handle paths with full directory structure', () => {
    expect(getLibraryName('/full/path/to/libraries/kiro-powers/category/subcategory/test-agent')).toBe('kiro-powers')
    expect(getLibraryName('some/prefix/libraries/promptz/prompts/test-prompt.md')).toBe('promptz')
  })

  it('should return "unknown" for paths without libraries directory', () => {
    expect(getLibraryName('agents/test-agent')).toBe('unknown')
    expect(getLibraryName('prompts/test-prompt')).toBe('unknown')
    expect(getLibraryName('invalid/path/structure')).toBe('unknown')
  })

  it('should return "unknown" for paths with libraries but no library name', () => {
    expect(getLibraryName('libraries/')).toBe('unknown')
    expect(getLibraryName('libraries')).toBe('unknown')
  })

  it('should handle empty library name', () => {
    expect(getLibraryName('libraries//agents/test-agent')).toBe('unknown')
  })

  it('should handle edge cases', () => {
    expect(getLibraryName('')).toBe('unknown')
    expect(getLibraryName('/')).toBe('unknown')
    expect(getLibraryName('libraries')).toBe('unknown')
  })

  it('should handle multiple libraries directories (use first one)', () => {
    expect(getLibraryName('libraries/first-lib/libraries/second-lib/test')).toBe('first-lib')
  })
})


describe('getAllContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should combine all content types and sort by date', async () => {
    const mockPrompt = {
      id: 'prompt-1',
      type: 'prompt' as const,
      title: 'Test Prompt',
      author: 'Author',
      date: '2024-01-01',
      path: 'libraries/promptz/prompts/test',
      content: 'content'
    }
    
    const mockAgent = {
      id: 'agent-1',
      type: 'agent' as const,
      title: 'Test Agent',
      author: 'Author',
      date: '2024-01-03',
      path: 'libraries/promptz/agents/test',
      description: 'desc',
      config: {},
      content: 'content'
    }
    
    const mockPower = {
      id: 'power-1',
      type: 'power' as const,
      title: 'Test Power',
      author: 'Author',
      date: '2024-01-02',
      path: 'libraries/kiro-powers/powers/test',
      keywords: [],
      content: 'content'
    }
    
    const mockSteering = {
      id: 'steering-1',
      type: 'steering' as const,
      title: 'Test Steering',
      author: 'Author',
      date: '2024-01-04',
      path: 'libraries/promptz/steering/test',
      content: 'content'
    }
    
    const mockHook = {
      id: 'hook-1',
      type: 'hook' as const,
      title: 'Test Hook',
      author: 'Author',
      date: '2024-01-05',
      path: 'libraries/promptz/hooks/test',
      trigger: 'onSave' as const,
      content: 'content'
    }

    mockGetAllPrompts.mockResolvedValue([mockPrompt])
    mockGetAllAgents.mockResolvedValue([mockAgent])
    mockGetAllPowers.mockResolvedValue([mockPower])
    mockGetAllSteering.mockResolvedValue([mockSteering])
    mockGetAllHooks.mockResolvedValue([mockHook])

    const result = await getAllContent()

    expect(result).toHaveLength(5)
    // Should be sorted by date, newest first
    expect(result[0].id).toBe('hook-1')
    expect(result[1].id).toBe('steering-1')
    expect(result[2].id).toBe('agent-1')
    expect(result[3].id).toBe('power-1')
    expect(result[4].id).toBe('prompt-1')
  })

  test('should use git createdDate for sorting when available', async () => {
    const mockPromptWithGit = {
      id: 'prompt-1',
      type: 'prompt' as const,
      title: 'Test Prompt',
      author: 'Author',
      date: '2024-01-01',
      path: 'libraries/promptz/prompts/test',
      content: 'content',
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-10T00:00:00Z',
        lastModifiedDate: '2024-01-10T00:00:00Z',
        commitHash: 'abc123',
        commitMessage: 'Initial'
      }
    }
    
    const mockAgent = {
      id: 'agent-1',
      type: 'agent' as const,
      title: 'Test Agent',
      author: 'Author',
      date: '2024-01-05',
      path: 'libraries/promptz/agents/test',
      description: 'desc',
      config: {},
      content: 'content'
    }

    mockGetAllPrompts.mockResolvedValue([mockPromptWithGit])
    mockGetAllAgents.mockResolvedValue([mockAgent])
    mockGetAllPowers.mockResolvedValue([])
    mockGetAllSteering.mockResolvedValue([])
    mockGetAllHooks.mockResolvedValue([])

    const result = await getAllContent()

    expect(result).toHaveLength(2)
    // Prompt with git date (2024-01-10) should come before agent (2024-01-05)
    expect(result[0].id).toBe('prompt-1')
    expect(result[1].id).toBe('agent-1')
  })

  test('should return empty array when all services return empty', async () => {
    mockGetAllPrompts.mockResolvedValue([])
    mockGetAllAgents.mockResolvedValue([])
    mockGetAllPowers.mockResolvedValue([])
    mockGetAllSteering.mockResolvedValue([])
    mockGetAllHooks.mockResolvedValue([])

    const result = await getAllContent()

    expect(result).toEqual([])
  })

  test('should return empty array on error', async () => {
    mockGetAllPrompts.mockRejectedValue(new Error('Test error'))
    mockGetAllAgents.mockResolvedValue([])
    mockGetAllPowers.mockResolvedValue([])
    mockGetAllSteering.mockResolvedValue([])
    mockGetAllHooks.mockResolvedValue([])

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const result = await getAllContent()

    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching all content:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })
})

describe('getLatestContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return limited content sorted by date', async () => {
    const mockPrompt = {
      id: 'prompt-1',
      type: 'prompt' as const,
      title: 'Test Prompt',
      author: 'Author',
      date: '2024-01-01',
      path: 'libraries/promptz/prompts/test',
      content: 'content'
    }
    
    const mockAgent = {
      id: 'agent-1',
      type: 'agent' as const,
      title: 'Test Agent',
      author: 'Author',
      date: '2024-01-03',
      path: 'libraries/promptz/agents/test',
      description: 'desc',
      config: {},
      content: 'content'
    }

    mockGetLatestPrompts.mockResolvedValue([mockPrompt])
    mockGetLatestAgents.mockResolvedValue([mockAgent])
    mockGetLatestPowers.mockResolvedValue([])
    mockGetLatestSteering.mockResolvedValue([])
    mockGetLatestHooks.mockResolvedValue([])

    const result = await getLatestContent(2)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('agent-1')
    expect(result[1].id).toBe('prompt-1')
  })

  test('should use default limit of 6', async () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: `prompt-${i}`,
      type: 'prompt' as const,
      title: `Test Prompt ${i}`,
      author: 'Author',
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      path: `libraries/promptz/prompts/test-${i}`,
      content: 'content'
    }))

    mockGetLatestPrompts.mockResolvedValue(items)
    mockGetLatestAgents.mockResolvedValue([])
    mockGetLatestPowers.mockResolvedValue([])
    mockGetLatestSteering.mockResolvedValue([])
    mockGetLatestHooks.mockResolvedValue([])

    const result = await getLatestContent()

    expect(result).toHaveLength(6)
  })

  test('should use git createdDate for sorting when available', async () => {
    const mockPromptWithGit = {
      id: 'prompt-1',
      type: 'prompt' as const,
      title: 'Test Prompt',
      author: 'Author',
      date: '2024-01-01',
      path: 'libraries/promptz/prompts/test',
      content: 'content',
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-10T00:00:00Z',
        lastModifiedDate: '2024-01-10T00:00:00Z',
        commitHash: 'abc123',
        commitMessage: 'Initial'
      }
    }
    
    const mockAgent = {
      id: 'agent-1',
      type: 'agent' as const,
      title: 'Test Agent',
      author: 'Author',
      date: '2024-01-05',
      path: 'libraries/promptz/agents/test',
      description: 'desc',
      config: {},
      content: 'content'
    }

    mockGetLatestPrompts.mockResolvedValue([mockPromptWithGit])
    mockGetLatestAgents.mockResolvedValue([mockAgent])
    mockGetLatestPowers.mockResolvedValue([])
    mockGetLatestSteering.mockResolvedValue([])
    mockGetLatestHooks.mockResolvedValue([])

    const result = await getLatestContent(2)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('prompt-1')
    expect(result[1].id).toBe('agent-1')
  })

  test('should return empty array on error', async () => {
    mockGetLatestPrompts.mockRejectedValue(new Error('Test error'))
    mockGetLatestAgents.mockResolvedValue([])
    mockGetLatestPowers.mockResolvedValue([])
    mockGetLatestSteering.mockResolvedValue([])
    mockGetLatestHooks.mockResolvedValue([])

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const result = await getLatestContent()

    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching latest content:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should return empty array when all services return empty', async () => {
    mockGetLatestPrompts.mockResolvedValue([])
    mockGetLatestAgents.mockResolvedValue([])
    mockGetLatestPowers.mockResolvedValue([])
    mockGetLatestSteering.mockResolvedValue([])
    mockGetLatestHooks.mockResolvedValue([])

    const result = await getLatestContent()

    expect(result).toEqual([])
  })
})
