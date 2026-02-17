import { render, screen, fireEvent, act } from '@testing-library/react'
import { WorkshopPage } from '@/components/workshop-page'
import * as workshopProgress from '@/lib/workshop-progress'
import * as workshopData from '@/lib/workshop-data'

// Mock the child components to isolate WorkshopPage logic
jest.mock('@/components/taxonomy-reference', () => ({
  TaxonomyReference: function MockTaxonomyReference({
    idPrefix,
  }: {
    idPrefix?: string
  }) {
    return <div data-testid="taxonomy-reference" data-id-prefix={idPrefix} />
  },
}))

jest.mock('@/components/workshop-exercise', () => ({
  WorkshopExercise: function MockWorkshopExercise({
    completedScenarios,
    currentScenarioIndex,
    onProgress,
    onComplete,
  }: {
    scenarios: workshopData.Scenario[]
    techniques: workshopData.Technique[]
    completedScenarios: workshopProgress.ScenarioResult[]
    currentScenarioIndex: number
    onProgress: (result: workshopProgress.ScenarioResult, nextIndex: number) => void
    onComplete: () => void
  }) {
    return (
      <div
        data-testid="workshop-exercise"
        data-completed={completedScenarios.length}
        data-index={currentScenarioIndex}
      >
        <button
          onClick={() =>
            onProgress({ scenarioId: 'scenario-1', correctOnFirstAttempt: true }, 1)
          }
        >
          Mock Progress
        </button>
        <button onClick={onComplete}>Mock Complete</button>
      </div>
    )
  },
}))

jest.mock('@/components/workshop-results', () => ({
  WorkshopResults: function MockWorkshopResults({
    results,
    onRestart,
  }: {
    results: workshopProgress.ScenarioResult[]
    scenarios: workshopData.Scenario[]
    techniques: workshopData.Technique[]
    onRestart: () => void
  }) {
    return (
      <div
        data-testid="workshop-results"
        data-results={results.length}
      >
        <button onClick={onRestart}>Mock Restart</button>
      </div>
    )
  },
}))

// Mock workshop-progress module
jest.mock('@/lib/workshop-progress', () => ({
  loadProgress: jest.fn(),
  saveProgress: jest.fn(),
  resetProgress: jest.fn(),
}))

const mockLoadProgress = workshopProgress.loadProgress as jest.MockedFunction<
  typeof workshopProgress.loadProgress
>
const mockSaveProgress = workshopProgress.saveProgress as jest.MockedFunction<
  typeof workshopProgress.saveProgress
>
const mockResetProgress = workshopProgress.resetProgress as jest.MockedFunction<
  typeof workshopProgress.resetProgress
>

function clickPracticeTab() {
  const practiceTab = screen.getByRole('tab', { name: /Practice/ })
  act(() => {
    practiceTab.focus()
    fireEvent.click(practiceTab)
  })
}

describe('WorkshopPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLoadProgress.mockReturnValue({
      completedScenarios: [],
      currentScenarioIndex: 0,
    })
  })

  it('renders the page title as h1', () => {
    render(<WorkshopPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Prompt Engineering Workshop',
        level: 1,
      })
    ).toBeInTheDocument()
  })

  it('renders a description paragraph below the title', () => {
    render(<WorkshopPage />)

    expect(
      screen.getByText(/Master 15 prompt engineering techniques/)
    ).toBeInTheDocument()
  })

  it('renders Reference and Practice tabs', () => {
    render(<WorkshopPage />)

    expect(screen.getByRole('tab', { name: /Reference/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Practice/ })).toBeInTheDocument()
  })

  it('shows TaxonomyReference in the Reference tab by default', () => {
    render(<WorkshopPage />)

    expect(screen.getByTestId('taxonomy-reference')).toBeInTheDocument()
  })

  it('shows WorkshopExercise in the Practice tab when not complete', () => {
    render(<WorkshopPage />)

    clickPracticeTab()

    expect(screen.getByTestId('workshop-exercise')).toBeInTheDocument()
  })

  it('loads progress from localStorage on mount', () => {
    render(<WorkshopPage />)

    expect(mockLoadProgress).toHaveBeenCalledTimes(1)
  })

  it('passes loaded progress to WorkshopExercise', () => {
    mockLoadProgress.mockReturnValue({
      completedScenarios: [
        { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      ],
      currentScenarioIndex: 1,
    })

    render(<WorkshopPage />)
    clickPracticeTab()

    const exercise = screen.getByTestId('workshop-exercise')
    expect(exercise).toHaveAttribute('data-completed', '1')
    expect(exercise).toHaveAttribute('data-index', '1')
  })

  it('saves progress to localStorage when onProgress is called', () => {
    render(<WorkshopPage />)
    clickPracticeTab()

    fireEvent.click(screen.getByText('Mock Progress'))

    expect(mockSaveProgress).toHaveBeenCalledWith({
      completedScenarios: [
        { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      ],
      currentScenarioIndex: 1,
    })
  })

  it('shows WorkshopResults when onComplete is called', () => {
    render(<WorkshopPage />)
    clickPracticeTab()

    fireEvent.click(screen.getByText('Mock Complete'))

    expect(screen.getByTestId('workshop-results')).toBeInTheDocument()
  })

  it('shows WorkshopResults when loaded progress has all scenarios completed', () => {
    const allCompleted = workshopData.SCENARIOS.map((s) => ({
      scenarioId: s.id,
      correctOnFirstAttempt: true,
    }))

    mockLoadProgress.mockReturnValue({
      completedScenarios: allCompleted,
      currentScenarioIndex: workshopData.SCENARIOS.length,
    })

    render(<WorkshopPage />)
    clickPracticeTab()

    expect(screen.getByTestId('workshop-results')).toBeInTheDocument()
  })

  it('resets progress when onRestart is called', () => {
    mockLoadProgress.mockReturnValue({
      completedScenarios: workshopData.SCENARIOS.map((s) => ({
        scenarioId: s.id,
        correctOnFirstAttempt: true,
      })),
      currentScenarioIndex: workshopData.SCENARIOS.length,
    })

    render(<WorkshopPage />)
    clickPracticeTab()

    // Should show results since all scenarios are complete
    expect(screen.getByTestId('workshop-results')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Mock Restart'))

    expect(mockResetProgress).toHaveBeenCalledTimes(1)
    // After restart, should show exercise again
    expect(screen.getByTestId('workshop-exercise')).toBeInTheDocument()
  })

  it('passes idPrefix to TaxonomyReference', () => {
    render(<WorkshopPage />)

    expect(screen.getByTestId('taxonomy-reference')).toHaveAttribute(
      'data-id-prefix',
      'technique-'
    )
  })
})
