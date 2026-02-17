// Workshop progress: localStorage persistence for scenario completion tracking

const STORAGE_KEY = 'promptz-workshop-progress'

export interface ScenarioResult {
  scenarioId: string
  correctOnFirstAttempt: boolean
}

export interface ProgressState {
  completedScenarios: ScenarioResult[]
  currentScenarioIndex: number
}

const DEFAULT_STATE: ProgressState = {
  completedScenarios: [],
  currentScenarioIndex: 0,
}

/**
 * Safely checks whether localStorage is available and writable.
 * Returns false in private browsing, SSR, or when quota is exceeded.
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Validates that a parsed value conforms to the ProgressState shape.
 */
function isValidProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== 'object') return false

  const obj = value as Record<string, unknown>

  if (!Array.isArray(obj.completedScenarios)) return false
  if (typeof obj.currentScenarioIndex !== 'number') return false
  if (obj.currentScenarioIndex < 0) return false

  return obj.completedScenarios.every(
    (item: unknown) =>
      item !== null &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).scenarioId === 'string' &&
      typeof (item as Record<string, unknown>).correctOnFirstAttempt === 'boolean'
  )
}

/**
 * Loads progress from localStorage, validates shape, and returns default
 * empty state on any failure (missing key, corrupted JSON, invalid shape).
 */
export function loadProgress(): ProgressState {
  if (!isLocalStorageAvailable()) {
    return { ...DEFAULT_STATE, completedScenarios: [] }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return { ...DEFAULT_STATE, completedScenarios: [] }
    }

    const parsed: unknown = JSON.parse(raw)

    if (isValidProgressState(parsed)) {
      return {
        completedScenarios: [...parsed.completedScenarios],
        currentScenarioIndex: parsed.currentScenarioIndex,
      }
    }

    return { ...DEFAULT_STATE, completedScenarios: [] }
  } catch {
    return { ...DEFAULT_STATE, completedScenarios: [] }
  }
}

/**
 * Serializes progress state to localStorage under the workshop storage key.
 * Silently fails if localStorage is unavailable.
 */
export function saveProgress(state: ProgressState): void {
  if (!isLocalStorageAvailable()) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or other write failure — silently ignore
  }
}

/**
 * Removes the workshop progress entry from localStorage.
 * Silently fails if localStorage is unavailable.
 */
export function resetProgress(): void {
  if (!isLocalStorageAvailable()) return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently ignore removal failures
  }
}
