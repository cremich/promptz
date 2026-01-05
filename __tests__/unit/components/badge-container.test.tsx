import { render, screen } from '@testing-library/react'
import { BadgeContainer } from '@/components/badge-container'

describe('BadgeContainer', () => {
  const mockChildren = (
    <>
      <span data-testid="badge-1">Badge 1</span>
      <span data-testid="badge-2">Badge 2</span>
      <span data-testid="badge-3">Badge 3</span>
    </>
  )

  describe('card-header context', () => {
    it('should render all children in card-header context', () => {
      render(<BadgeContainer context="card-header">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

    describe('detail-header context', () => {
    it('should render all children in detail-header context', () => {
      render(<BadgeContainer context="detail-header">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('should apply custom className along with context classes', () => {
      render(
        <BadgeContainer context="card-header" className="custom-class">
          {mockChildren}
        </BadgeContainer>
      )
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('custom-class')
    })

  })

  describe('children rendering', () => {
    it('should render single child', () => {
      render(
        <BadgeContainer>
          <span data-testid="single-badge">Single Badge</span>
        </BadgeContainer>
      )
      
      expect(screen.getByTestId('single-badge')).toBeInTheDocument()
      expect(screen.getByTestId('single-badge')).toHaveTextContent('Single Badge')
    })

    it('should render multiple children', () => {
      render(<BadgeContainer>{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })

    it('should render complex children with nested elements', () => {
      render(
        <BadgeContainer>
          <div data-testid="complex-child">
            <span>Nested content</span>
            <button>Button</button>
          </div>
        </BadgeContainer>
      )
      
      const complexChild = screen.getByTestId('complex-child')
      expect(complexChild).toBeInTheDocument()
      expect(complexChild).toHaveTextContent('Nested content')
      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
    })
  })
})