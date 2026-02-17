import { render, screen, fireEvent } from '@testing-library/react'
import { ScenarioCard } from '@/components/scenario-card'
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

const baseScenario: Scenario = {
  id: 'test-scenario-1',
  description: 'A developer asks their AI to summarize a PR with no examples.',
  correctTechniqueId: 'zero-shot',
  distractorTechniqueIds: ['few-shot', 'chain-of-thought', 'persona'],
  feedback: 'This is Zero-Shot because no examples are provided.',
  incorrectHints: {
    'few-shot': 'Few-Shot requires multiple examples. None are given here.',
    'chain-of-thought': 'Chain-of-Thought asks for step-by-step reasoning.',
    'persona': 'Persona assigns an identity. No role is assigned here.',
  },
}

const scenarioWithRewrite: Scenario = {
  ...baseScenario,
  id: 'test-scenario-rewrite',
  promptRewrite: {
    originalPrompt: 'Summarize this PR.',
    sampleImprovedPrompt: 'Summarize this PR using Conventional Commits format.',
  },
}

describe('ScenarioCard', () => {
  it('renders the scenario description', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByText(baseScenario.description)).toBeInTheDocument()
  })

  it('renders all technique option buttons', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /Zero-Shot/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Few-Shot/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chain-of-Thought/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Persona/ })).toBeInTheDocument()
  })

  it('has ARIA labels on option buttons', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    expect(
      screen.getByLabelText('Select technique: Zero-Shot')
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('Select technique: Few-Shot')
    ).toBeInTheDocument()
  })

  it('has a group role with label on the options container', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    expect(screen.getByRole('group', { name: 'Technique options' })).toBeInTheDocument()
  })

  it('shows correct feedback when the right technique is selected', () => {
    const onComplete = jest.fn()
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    expect(screen.getByText('✓ Correct!')).toBeInTheDocument()
    expect(screen.getByText(baseScenario.feedback)).toBeInTheDocument()
  })

  it('calls onViewTechnique on correct answer', () => {
    const onViewTechnique = jest.fn()
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
        onViewTechnique={onViewTechnique}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    const viewButton = screen.getByRole('button', { name: /View Zero-Shot/ })
    expect(viewButton).toBeInTheDocument()
    fireEvent.click(viewButton)
    expect(onViewTechnique).toHaveBeenCalledWith('zero-shot')
  })

  it('calls onViewTechnique with custom technique id', () => {
    const onViewTechnique = jest.fn()
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
        onViewTechnique={onViewTechnique}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    const viewButton = screen.getByRole('button', { name: /View Zero-Shot/ })
    fireEvent.click(viewButton)
    expect(onViewTechnique).toHaveBeenCalledWith('zero-shot')
  })

  it('calls onComplete with true when correct on first attempt', () => {
    const onComplete = jest.fn()
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    expect(onComplete).toHaveBeenCalledWith(true)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows hint on incorrect selection without revealing correct answer', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Few-Shot'))

    expect(screen.getByText('✗ Not quite')).toBeInTheDocument()
    expect(
      screen.getByText('Few-Shot requires multiple examples. None are given here.')
    ).toBeInTheDocument()
    expect(screen.queryByText('✓ Correct!')).not.toBeInTheDocument()
  })

  it('calls onComplete with false when correct after an incorrect attempt', () => {
    const onComplete = jest.fn()
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Few-Shot'))
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))
    expect(onComplete).toHaveBeenCalledWith(false)
  })

  it('disables all buttons after correct answer is found', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    const optionButtons = screen.getAllByRole('button').filter(
      (button) => button.getAttribute('aria-label')?.startsWith('Select technique:')
    )
    optionButtons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('does not show PromptRewriteArea when scenario has no promptRewrite', () => {
    render(
      <ScenarioCard
        scenario={baseScenario}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    expect(screen.queryByText('Bonus: Prompt Rewrite Exercise')).not.toBeInTheDocument()
  })

  it('shows PromptRewriteArea after correct answer when scenario has promptRewrite', () => {
    render(
      <ScenarioCard
        scenario={scenarioWithRewrite}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Zero-Shot'))

    expect(screen.getByText('Bonus: Prompt Rewrite Exercise')).toBeInTheDocument()
    expect(screen.getByText('Summarize this PR.')).toBeInTheDocument()
  })

  it('does not show PromptRewriteArea before correct answer', () => {
    render(
      <ScenarioCard
        scenario={scenarioWithRewrite}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    expect(screen.queryByText('Bonus: Prompt Rewrite Exercise')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Select technique: Few-Shot'))

    expect(screen.queryByText('Bonus: Prompt Rewrite Exercise')).not.toBeInTheDocument()
  })

  it('shows fallback hint when incorrectHints has no entry for selected technique', () => {
    const scenarioMissingHint: Scenario = {
      ...baseScenario,
      incorrectHints: {},
    }

    render(
      <ScenarioCard
        scenario={scenarioMissingHint}
        techniques={techniques}
        onComplete={jest.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText('Select technique: Few-Shot'))

    expect(
      screen.getByText("That's not the best fit. Try another technique.")
    ).toBeInTheDocument()
  })
})
