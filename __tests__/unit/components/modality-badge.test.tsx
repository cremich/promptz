import { render, screen } from '@testing-library/react'
import { ModalityBadge, getModalitySupport } from '@/components/modality-badge'

describe('ModalityBadge', () => {
  it('renders IDE badge only for IDE support', () => {
    render(<ModalityBadge support="ide" />)
    
    expect(screen.getByText('IDE')).toBeInTheDocument()
    expect(screen.queryByText('CLI')).not.toBeInTheDocument()
  })

  it('renders CLI badge only for CLI support', () => {
    render(<ModalityBadge support="cli" />)
    
    expect(screen.getByText('CLI')).toBeInTheDocument()
    expect(screen.queryByText('IDE')).not.toBeInTheDocument()
  })

  it('renders both badges for both support', () => {
    render(<ModalityBadge support="both" />)
    
    expect(screen.getByText('IDE')).toBeInTheDocument()
    expect(screen.getByText('CLI')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<ModalityBadge support="both" className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('getModalitySupport', () => {
  it('returns "both" for steering content', () => {
    expect(getModalitySupport('steering')).toBe('both')
  })

  it('returns "both" for prompt content', () => {
    expect(getModalitySupport('prompt')).toBe('both')
  })

  it('returns "cli" for agent content', () => {
    expect(getModalitySupport('agent')).toBe('cli')
  })

  it('returns "ide" for hook content', () => {
    expect(getModalitySupport('hook')).toBe('ide')
  })

  it('returns "ide" for power content', () => {
    expect(getModalitySupport('power')).toBe('ide')
  })

  it('returns "both" for unknown content type', () => {
    expect(getModalitySupport('unknown')).toBe('both')
  })
})