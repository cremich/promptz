import {
  isLocalStorageAvailable,
  loadProgress,
  saveProgress,
  resetProgress,
} from '@/lib/workshop-progress'
import type { ProgressState } from '@/lib/workshop-progress'

const STORAGE_KEY = 'promptz-workshop-progress'

// Helper to create a mock localStorage
function createMockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key])
    }),
    get length() {
      return Object.keys(store).length
    },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
    _store: store,
  }
}

describe('workshop-progress', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    mockStorage = createMockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('isLocalStorageAvailable', () => {
    test('returns true when localStorage is accessible', () => {
      expect(isLocalStorageAvailable()).toBe(true)
    })

    test('returns false when localStorage throws on setItem', () => {
      mockStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
      expect(isLocalStorageAvailable()).toBe(false)
    })

    test('returns false when localStorage throws on removeItem', () => {
      mockStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError')
      })
      expect(isLocalStorageAvailable()).toBe(false)
    })
  })

  describe('loadProgress', () => {
    test('returns default empty state when localStorage is empty', () => {
      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns stored progress when valid data exists', () => {
      const stored: ProgressState = {
        completedScenarios: [
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
          { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
        ],
        currentScenarioIndex: 2,
      }
      mockStorage._store[STORAGE_KEY] = JSON.stringify(stored)

      const result = loadProgress()
      expect(result).toEqual(stored)
    })

    test('returns default state when stored JSON is corrupted', () => {
      mockStorage._store[STORAGE_KEY] = '{invalid json!!!'

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns default state when stored data has wrong shape', () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({
        completedScenarios: 'not-an-array',
        currentScenarioIndex: 0,
      })

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns default state when currentScenarioIndex is missing', () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({
        completedScenarios: [],
      })

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns default state when completedScenarios has invalid items', () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({
        completedScenarios: [{ scenarioId: 123, correctOnFirstAttempt: 'yes' }],
        currentScenarioIndex: 0,
      })

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns default state when currentScenarioIndex is negative', () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({
        completedScenarios: [],
        currentScenarioIndex: -1,
      })

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })

    test('returns default state when localStorage is unavailable', () => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('SecurityError')
        },
        configurable: true,
      })

      const result = loadProgress()
      expect(result).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })
  })

  describe('saveProgress', () => {
    test('serializes state to localStorage under the correct key', () => {
      const state: ProgressState = {
        completedScenarios: [
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
        ],
        currentScenarioIndex: 1,
      }

      saveProgress(state)

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(state)
      )
    })

    test('silently fails when localStorage is unavailable', () => {
      mockStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      // Should not throw
      expect(() => {
        saveProgress({
          completedScenarios: [],
          currentScenarioIndex: 0,
        })
      }).not.toThrow()
    })
  })

  describe('resetProgress', () => {
    test('removes the storage key from localStorage', () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })

      resetProgress()

      expect(mockStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    test('silently fails when localStorage is unavailable', () => {
      mockStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError')
      })

      // Should not throw
      expect(() => resetProgress()).not.toThrow()
    })
  })

  describe('round-trip', () => {
    test('saveProgress then loadProgress returns equivalent state', () => {
      const state: ProgressState = {
        completedScenarios: [
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
          { scenarioId: 'scenario-3', correctOnFirstAttempt: false },
        ],
        currentScenarioIndex: 3,
      }

      saveProgress(state)
      const loaded = loadProgress()

      expect(loaded).toEqual(state)
    })

    test('resetProgress then loadProgress returns default state', () => {
      saveProgress({
        completedScenarios: [
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
        ],
        currentScenarioIndex: 1,
      })

      resetProgress()
      const loaded = loadProgress()

      expect(loaded).toEqual({
        completedScenarios: [],
        currentScenarioIndex: 0,
      })
    })
  })
})
