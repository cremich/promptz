import { render, screen, fireEvent } from '@testing-library/react'
import { PromptRewriteArea } from '@/components/prompt-rewrite-area'

const defaultProps = {
  originalPrompt: 'Write me a function that sorts an array.',
  sampleImprovedPrompt:
    'Write a TypeScript function that sorts an array of numbers in ascending order using the merge sort algorithm. Include JSDoc comments and handle edge cases like empty arrays.',
}

describe('PromptRewriteArea', () => {
  it('renders the original prompt', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    expect(screen.getByText(defaultProps.originalPrompt)).toBeInTheDocument()
  })

  it('renders a textarea with ARIA label', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    const textarea = screen.getByLabelText('Write your improved prompt')
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('allows the user to type in the textarea', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    const textarea = screen.getByLabelText('Write your improved prompt')
    fireEvent.change(textarea, { target: { value: 'My improved prompt' } })

    expect(textarea).toHaveValue('My improved prompt')
  })

  it('renders a reveal button', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: 'Reveal sample answer' })
    ).toBeInTheDocument()
  })

  it('does not show the sample answer initially', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    expect(screen.queryByText(defaultProps.sampleImprovedPrompt)).not.toBeInTheDocument()
  })

  it('reveals the sample answer when the button is clicked', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Reveal sample answer' }))

    expect(screen.getByText(defaultProps.sampleImprovedPrompt)).toBeInTheDocument()
  })

  it('disables the reveal button after clicking', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Reveal sample answer' }))

    const disabledButton = screen.getByRole('button', { name: 'Sample answer revealed' })
    expect(disabledButton).toBeDisabled()
  })

  it('keeps the sample answer visible once revealed', () => {
    render(<PromptRewriteArea {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Reveal sample answer' }))

    expect(screen.getByText(defaultProps.sampleImprovedPrompt)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sample answer revealed' })).toBeDisabled()
  })
})
