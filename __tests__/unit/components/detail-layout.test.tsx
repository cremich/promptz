import { render, screen } from '@testing-library/react'
import { DetailLayout, DetailSkeleton } from '@/components/detail-layout'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock PixelParticles component
jest.mock('@/components/animations/pixel-particles', () => ({
  PixelParticles: () => <div data-testid="pixel-particles" />
}))

describe('DetailLayout', () => {
  it('renders back navigation with correct href and label', () => {
    render(
      <DetailLayout backHref="/prompts" backLabel="Back to Prompts">
        <div>Content</div>
      </DetailLayout>
    )
    
    const backLink = screen.getByRole('link', { name: /back to prompts/i })
    expect(backLink).toHaveAttribute('href', '/prompts')
  })

  it('renders children content', () => {
    render(
      <DetailLayout backHref="/agents" backLabel="Back to Agents">
        <div data-testid="child-content">Test Child Content</div>
      </DetailLayout>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Test Child Content')).toBeInTheDocument()
  })

  it('renders pixel particles effect', () => {
    render(
      <DetailLayout backHref="/powers" backLabel="Back to Powers">
        <div>Content</div>
      </DetailLayout>
    )
    
    expect(screen.getByTestId('pixel-particles')).toBeInTheDocument()
  })

  it('renders gradient background', () => {
    const { container } = render(
      <DetailLayout backHref="/steering" backLabel="Back to Steering">
        <div>Content</div>
      </DetailLayout>
    )
    
    const gradientDiv = container.querySelector('.bg-gradient-to-br')
    expect(gradientDiv).toBeInTheDocument()
  })
})

describe('DetailSkeleton', () => {
  it('renders skeleton structure', () => {
    const { container } = render(<DetailSkeleton />)
    
    // Check for animate-pulse elements
    const pulsingElements = container.querySelectorAll('.animate-pulse')
    expect(pulsingElements.length).toBeGreaterThan(0)
  })

  it('renders pixel particles effect', () => {
    render(<DetailSkeleton />)
    
    expect(screen.getByTestId('pixel-particles')).toBeInTheDocument()
  })

  it('renders gradient background', () => {
    const { container } = render(<DetailSkeleton />)
    
    const gradientDiv = container.querySelector('.bg-gradient-to-br')
    expect(gradientDiv).toBeInTheDocument()
  })
})
