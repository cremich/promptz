import { render, screen, fireEvent } from '@testing-library/react'
import { WorkshopResults } from '@/components/workshop-results'
import type { Scenario, Technique } from '@/lib/workshop-data'
import type { ScenarioResult } from '@/lib/workshop-progress'

const techniques: Technique[] = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot',
    description: 'No examples provided.',
    example: 'Write a commit message.',
    mitigatedExample: 'Write a commit message using Conventional Commits.',
    riskLevel: 'High',
    primaryVulnerability: 'No anchoring examples',
  },
  {
    id: 'few-shot',
    name: 'Few-Shot',
    description: 'Multiple examples provided.',
    example: 'Classify sentiment.',
    mitigatedExample: 'Classify sentiment with ambiguity handling.',
    riskLevel: 'Medium',
    primaryVulnerability: 'Example quality determines output quality',
  },
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought',
    description: 'Step-by-step reasoning.',
    example: 'Analyze the code step by step.',
    mitigatedExample: 'Analyze the code step by step with verification.',
    riskLevel: 'Low-Medium',
    primaryVulnerability: 'Diminishing returns',
  },
  {
    id: 'persona',
    name: 'Persona / Role-Based',
    description: 'Assigns a specific identity.',
    example: 'You are a security engineer.',
    mitigatedExample: 'You are a security engineer with constraints.',
    riskLevel: 'Medium-High',
    primaryVulnerability: 'Fabricates knowledge to stay in character',
  },
]

const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    description: 'A developer asks their AI to summarize a PR with no examples.',
    correctTechniqueId: 'zero-shot',
    distractorTechniqueIds: ['few-shot', 'chain-of-thought', 'persona'],
    feedback: 'This is Zero-Shot because no examples are provided.',
    incorrectHints: {
      'few-shot': 'Few-Shot requires multiple examples.',
      'chain-of-thought': 'Chain-of-Thought asks for step-by-step reasoning.',
      'persona': 'Persona assigns an identity.',
    },
  },
  {
    id: 'scenario-2',
    description: 'A team lead provides three examples of converting Jira tickets.',
    correctTechniqueId: 'few-shot',
    distractorTechniqueIds: ['zero-shot', 'chain-of-thought', 'persona'],
    feedback: 'This is Few-Shot because multiple examples are provided.',
    incorrectHints: {
      'zero-shot': 'Zero-Shot uses no examples.',
      'chain-of-thought': 'Chain-of-Thought is about reasoning steps.',
      'persona': 'Persona assigns a role.',
    },
  },
  {
    id: 'scenario-3',
    description: 'A developer writes a prompt assigning a senior security engineer role.',
    correctTechniqueId: 'persona',
    distractorTechniqueIds: ['zero-shot', 'few-shot', 'chain-of-thought'],
    feedback: 'This is Persona because it assigns a specific identity.',
    incorrectHints: {
      'zero-shot': 'Zero-Shot is about no examples.',
      'few-shot': 'Few-Shot uses multiple examples.',
      'chain-of-thought': 'Chain-of-Thought is about step-by-step reasoning.',
    },
  },
]

describe('WorkshopResults', () => {
  it('displays the total score as correct first attempts out of total', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
      { scenarioId: 'scenario-3', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText(/correct on first attempt/)).toBeInTheDocument()
    expect(screen.getByText(/67%/)).toBeInTheDocument()
  })

  it('displays correctly identified techniques with badges', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
      { scenarioId: 'scenario-3', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('✓ Correctly Identified')).toBeInTheDocument()
    // Zero-Shot and Persona were correct on first attempt
    const identifiedSection = screen.getByText('✓ Correctly Identified').closest('div')!
    expect(identifiedSection).toHaveTextContent('Zero-Shot')
    expect(identifiedSection).toHaveTextContent('Persona / Role-Based')
  })

  it('displays missed techniques with links to technique cards', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
      { scenarioId: 'scenario-3', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('✗ Needs Review')).toBeInTheDocument()
    // Few-Shot was missed (scenario-2 correctOnFirstAttempt: false)
    const missedButton = screen.getByRole('button', { name: /Review Few-Shot technique card/ })
    expect(missedButton).toBeInTheDocument()
  })

  it('calls onViewTechnique when a missed technique is clicked', () => {
    const onViewTechnique = jest.fn()
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
        onViewTechnique={onViewTechnique}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Review Few-Shot technique card/ }))
    expect(onViewTechnique).toHaveBeenCalledWith('few-shot')
  })

  it('calls onRestart when the restart button is clicked', () => {
    const onRestart = jest.fn()
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={onRestart}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /restart workshop/i }))
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('shows perfect score message when all are correct on first attempt', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      { scenarioId: 'scenario-2', correctOnFirstAttempt: true },
      { scenarioId: 'scenario-3', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    expect(screen.getByText(/100%/)).toBeInTheDocument()
    expect(screen.getByText(/Perfect score/)).toBeInTheDocument()
    expect(screen.queryByText('✗ Needs Review')).not.toBeInTheDocument()
  })

  it('shows all techniques as missed when none are correct on first attempt', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: false },
      { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
      { scenarioId: 'scenario-3', correctOnFirstAttempt: false },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('0 / 3')).toBeInTheDocument()
    expect(screen.getByText(/0%/)).toBeInTheDocument()
    expect(screen.queryByText('✓ Correctly Identified')).not.toBeInTheDocument()
    expect(screen.getByText('✗ Needs Review')).toBeInTheDocument()
  })

  it('handles empty results gracefully', () => {
    render(
      <WorkshopResults
        results={[]}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('0 / 0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /restart workshop/i })).toBeInTheDocument()
  })

  it('renders the Workshop Results heading', () => {
    const results: ScenarioResult[] = [
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Workshop Results', level: 2 })
    ).toBeInTheDocument()
  })

  it('prioritises missed over identified when a technique appears in both', () => {
    // Two scenarios with the same correctTechniqueId: one correct, one missed
    const duplicateScenarios: Scenario[] = [
      {
        ...scenarios[0],
        id: 'dup-1',
        correctTechniqueId: 'zero-shot',
      },
      {
        ...scenarios[0],
        id: 'dup-2',
        correctTechniqueId: 'zero-shot',
      },
    ]

    const results: ScenarioResult[] = [
      { scenarioId: 'dup-1', correctOnFirstAttempt: true },
      { scenarioId: 'dup-2', correctOnFirstAttempt: false },
    ]

    render(
      <WorkshopResults
        results={results}
        scenarios={duplicateScenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    // Zero-Shot should appear as missed (needs review), not identified
    const missedButton = screen.getByRole('button', { name: /Review Zero-Shot technique card/ })
    expect(missedButton).toBeInTheDocument()
  })

  it('has an accessible restart button with aria-label', () => {
    render(
      <WorkshopResults
        results={[]}
        scenarios={scenarios}
        techniques={techniques}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByLabelText('Restart workshop')).toBeInTheDocument()
  })
})
