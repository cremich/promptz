import { render, screen, fireEvent } from '@testing-library/react'
import { WorkshopExercise } from '@/components/workshop-exercise'
import type { Scenario, Technique } from '@/lib/workshop-data'

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

describe('WorkshopExercise', () => {
  it('renders the progress indicator with correct counts', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: /0 of 3 scenarios completed/ })
    ).toBeInTheDocument()
  })

  it('renders the current scenario description', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByText(scenarios[0].description)).toBeInTheDocument()
  })

  it('does not show the Next button before answering', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(
      screen.queryByRole('button', { name: /next scenario/i })
    ).not.toBeInTheDocument()
  })

  it('shows the Next Scenario button after answering correctly', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    expect(
      screen.getByRole('button', { name: /next scenario/i })
    ).toBeInTheDocument()
  })

  it('calls onProgress with result and next index when Next is clicked', () => {
    const onProgress = jest.fn()
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={onProgress}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))
    fireEvent.click(screen.getByRole('button', { name: /next scenario/i }))

    expect(onProgress).toHaveBeenCalledWith(
      { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
      1
    )
  })

  it('calls onProgress with correctOnFirstAttempt false after wrong then right', () => {
    const onProgress = jest.fn()
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={onProgress}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Few-Shot'))
    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))
    fireEvent.click(screen.getByRole('button', { name: /next scenario/i }))

    expect(onProgress).toHaveBeenCalledWith(
      { scenarioId: 'scenario-1', correctOnFirstAttempt: false },
      1
    )
  })

  it('shows Finish Workshop button on the last scenario', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
          { scenarioId: 'scenario-2', correctOnFirstAttempt: true },
        ]}
        currentScenarioIndex={2}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(
      screen.getByLabelText('Select technique: Persona / Role-Based')
    )

    expect(
      screen.getByRole('button', { name: /finish workshop/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /next scenario/i })
    ).not.toBeInTheDocument()
  })

  it('calls onComplete when Finish Workshop is clicked on last scenario', () => {
    const onComplete = jest.fn()
    const onProgress = jest.fn()
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
          { scenarioId: 'scenario-2', correctOnFirstAttempt: true },
        ]}
        currentScenarioIndex={2}
        onProgress={onProgress}
        onComplete={onComplete}
      />
    )

    fireEvent.click(
      screen.getByLabelText('Select technique: Persona / Role-Based')
    )
    fireEvent.click(screen.getByRole('button', { name: /finish workshop/i }))

    expect(onProgress).toHaveBeenCalledWith(
      { scenarioId: 'scenario-3', correctOnFirstAttempt: true },
      2
    )
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('renders the second scenario when currentScenarioIndex is 1', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
        ]}
        currentScenarioIndex={1}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByText(scenarios[1].description)).toBeInTheDocument()
    expect(screen.queryByText(scenarios[0].description)).not.toBeInTheDocument()
  })

  it('shows completed count from completedScenarios prop', () => {
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[
          { scenarioId: 'scenario-1', correctOnFirstAttempt: true },
          { scenarioId: 'scenario-2', correctOnFirstAttempt: false },
        ]}
        currentScenarioIndex={2}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: /2 of 3 scenarios completed/ })
    ).toBeInTheDocument()
  })

  it('renders nothing when currentScenarioIndex is out of bounds', () => {
    const { container } = render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={99}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    expect(container.innerHTML).toBe('')
  })

  it('passes onViewTechnique through to ScenarioCard', () => {
    const onViewTechnique = jest.fn()
    render(
      <WorkshopExercise
        scenarios={scenarios}
        techniques={techniques}
        completedScenarios={[]}
        currentScenarioIndex={0}
        onProgress={jest.fn()}
        onComplete={jest.fn()}
        onViewTechnique={onViewTechnique}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    const viewButton = screen.getByRole('button', { name: /View Zero-Shot/ })
    fireEvent.click(viewButton)
    expect(onViewTechnique).toHaveBeenCalledWith('zero-shot')
  })
})
