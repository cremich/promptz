import { getAllLibraries, getLibraryById } from '@/lib/libraries'

// Mock fs/promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}))

// Mock the content services
jest.mock('@/lib/prompts', () => ({
  getAllPrompts: jest.fn(() => Promise.resolve([])),
}))

jest.mock('@/lib/agents', () => ({
  getAllAgents: jest.fn(() => Promise.resolve([])),
}))

jest.mock('@/lib/powers', () => ({
  getAllPowers: jest.fn(() => Promise.resolve([])),
}))

jest.mock('@/lib/steering', () => ({
  getAllSteering: jest.fn(() => Promise.resolve([])),
}))

jest.mock('@/lib/hooks', () => ({
  getAllHooks: jest.fn(() => Promise.resolve([])),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockReadFile = require('fs/promises').readFile as jest.MockedFunction<typeof import('fs/promises').readFile>

describe('Libraries Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllLibraries', () => {
    it('should return empty array when .gitmodules is not found', async () => {
      mockReadFile.mockRejectedValue(new Error('File not found'))

      const libraries = await getAllLibraries()
      expect(libraries).toEqual([])
    })

    it('should parse .gitmodules and return library information', async () => {
      const gitmodulesContent = `[submodule "libraries/test-library"]
	path = libraries/test-library
	url = https://github.com/test/test-library.git`

      mockReadFile.mockImplementation((path) => {
        if (path === '.gitmodules') {
          return Promise.resolve(gitmodulesContent)
        }
        if (path.toString().endsWith('README.md')) {
          return Promise.resolve('# Test Library\nA test library for testing purposes.')
        }
        return Promise.reject(new Error('File not found'))
      })

      const libraries = await getAllLibraries()
      
      expect(libraries).toHaveLength(1)
      expect(libraries[0]).toMatchObject({
        id: 'test-library',
        name: 'test-library',
        displayName: 'Test Library',
        description: 'A test library for testing purposes.',
        repositoryUrl: 'https://github.com/test/test-library.git',
        owner: 'test',
        category: 'community',
        contentStats: {
          prompts: 0,
          agents: 0,
          powers: 0,
          steering: 0,
          hooks: 0,
          total: 0,
        },
      })
    })

    it('should categorize libraries correctly', async () => {
      const gitmodulesContent = `[submodule "libraries/kiro-powers"]
	path = libraries/kiro-powers
	url = https://github.com/kirodotdev/powers.git
[submodule "libraries/kiro-best-practices"]
	path = libraries/kiro-best-practices
	url = https://github.com/awsdataarchitect/kiro-best-practices.git
[submodule "libraries/product-teams"]
	path = libraries/product-teams
	url = https://github.com/aws-samples/sample-kiro-cli-prompts-for-product-teams.git`

      mockReadFile.mockImplementation((path) => {
        if (path === '.gitmodules') {
          return Promise.resolve(gitmodulesContent)
        }
        return Promise.reject(new Error('File not found'))
      })

      const libraries = await getAllLibraries()
      
      expect(libraries).toHaveLength(3)
      
      const kiroPowers = libraries.find(lib => lib.id === 'kiro-powers')
      expect(kiroPowers?.category).toBe('official')
      expect(kiroPowers?.owner).toBe('kirodotdev')
      
      const bestPractices = libraries.find(lib => lib.id === 'kiro-best-practices')
      expect(bestPractices?.category).toBe('community')
      expect(bestPractices?.owner).toBe('awsdataarchitect')
      
      const productTeams = libraries.find(lib => lib.id === 'product-teams')
      expect(productTeams?.category).toBe('individual')
      expect(productTeams?.owner).toBe('aws-samples')
    })

    it('should use default description when README is not found', async () => {
      const gitmodulesContent = `[submodule "libraries/test-library"]
	path = libraries/test-library
	url = https://github.com/test/test-library.git`

      mockReadFile.mockImplementation((path) => {
        if (path === '.gitmodules') {
          return Promise.resolve(gitmodulesContent)
        }
        return Promise.reject(new Error('File not found'))
      })

      const libraries = await getAllLibraries()
      
      expect(libraries).toHaveLength(1)
      expect(libraries[0].description).toBe('A library of AI development resources')
    })
  })

  describe('getLibraryById', () => {
    it('should return null for non-existent library', async () => {
      mockReadFile.mockRejectedValue(new Error('File not found'))

      const library = await getLibraryById('non-existent')
      expect(library).toBeNull()
    })

    it('should return library by id', async () => {
      const gitmodulesContent = `[submodule "libraries/test-library"]
	path = libraries/test-library
	url = https://github.com/test/test-library.git`

      mockReadFile.mockImplementation((path) => {
        if (path === '.gitmodules') {
          return Promise.resolve(gitmodulesContent)
        }
        return Promise.reject(new Error('File not found'))
      })

      const library = await getLibraryById('test-library')
      
      expect(library).not.toBeNull()
      expect(library?.id).toBe('test-library')
      expect(library?.name).toBe('test-library')
    })
  })
})