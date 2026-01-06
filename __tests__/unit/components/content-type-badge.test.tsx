import { render, screen } from '@testing-library/react'
import { ContentTypeBadge } from '@/components/content-type-badge'

// Mock the Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode, variant: string, className: string }) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}))

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}))

describe('ContentTypeBadge', () => {
  it('should render prompt badge with secondary variant and brand primary color', () => {
    render(<ContentTypeBadge contentType="prompt" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('prompt')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-[#4F46E5]')
  })

  it('should render agent badge with secondary variant and brand secondary color', () => {
    render(<ContentTypeBadge contentType="agent" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('agent')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-[#7C3AED]')
  })

  it('should render power badge with secondary variant and brand complementary color', () => {
    render(<ContentTypeBadge contentType="power" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('power')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-[#06B6D4]')
  })

  it('should render hook badge with secondary variant and gradient styling', () => {
    render(<ContentTypeBadge contentType="hook" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('hook')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-gradient-to-r')
    expect(badge).toHaveClass('from-[#4F46E5]')
    expect(badge).toHaveClass('to-[#7C3AED]')
  })

  it('should render steering badge with secondary variant and gradient styling', () => {
    render(<ContentTypeBadge contentType="steering" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('steering')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-gradient-to-r')
    expect(badge).toHaveClass('from-[#7C3AED]')
    expect(badge).toHaveClass('to-[#06B6D4]')
  })

  it('should apply custom className', () => {
    render(<ContentTypeBadge contentType="prompt" className="custom-class" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('custom-class')
  })

  it('should use muted styling for unknown content type', () => {
    render(<ContentTypeBadge contentType="unknown" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('bg-muted')
    expect(badge).toHaveClass('text-muted-foreground')
  })

  it('should handle case insensitive content types', () => {
    render(<ContentTypeBadge contentType="PROMPT" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('prompt')
    expect(badge).toHaveClass('bg-[#4F46E5]')
  })
})