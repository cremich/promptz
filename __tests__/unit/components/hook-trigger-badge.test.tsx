import { render, screen } from '@testing-library/react'
import { HookTriggerBadge } from '@/components/hook-trigger-badge'

describe('HookTriggerBadge', () => {
  it('should render trigger badge when trigger is provided', () => {
    render(<HookTriggerBadge trigger="on-save" />)
    
    const badge = screen.getByText('on-save')
    expect(badge).toBeInTheDocument()
  })

  it('should render nothing when trigger is not provided', () => {
    const { container } = render(<HookTriggerBadge />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when trigger is empty string', () => {
    const { container } = render(<HookTriggerBadge trigger="" />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should apply custom className when provided', () => {
    render(<HookTriggerBadge trigger="on-message" className="custom-class" />)
    
    const badge = screen.getByText('on-message')
    expect(badge).toHaveClass('custom-class')
  })

  it('should render different trigger values correctly', () => {
    const triggers = ['on-save', 'on-message', 'on-session-create', 'manual']
    
    triggers.forEach(trigger => {
      const { rerender } = render(<HookTriggerBadge trigger={trigger} />)
      
      const badge = screen.getByText(trigger)
      expect(badge).toBeInTheDocument()
      
      rerender(<HookTriggerBadge />)
    })
  })
})