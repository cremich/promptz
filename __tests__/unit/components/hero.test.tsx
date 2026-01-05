import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/hero'

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

describe('Hero', () => {
  it('renders badge with community message', () => {
    render(<Hero />)
    
    expect(screen.getByText('The community library for Kiro')).toBeInTheDocument()
  })

  it('renders headline with gradient text', () => {
    render(<Hero />)
    
    expect(screen.getByText('Unlock')).toBeInTheDocument()
    expect(screen.getByText(/the full/)).toBeInTheDocument()
    expect(screen.getByText(/power of Kiro/)).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Discover and share prompts, powers, agents, and steering documents/)).toBeInTheDocument()
  })

  it('renders Contribute CTA with external link', () => {
    render(<Hero />)
    
    const contributeLink = screen.getByRole('link', { name: /Contribute/i })
    expect(contributeLink).toHaveAttribute('href', 'https://github.com/cremich/promptz.lib/blob/main/CONTRIBUTING.md')
    expect(contributeLink).toHaveAttribute('target', '_blank')
    expect(contributeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Browse Library CTA with internal link', () => {
    render(<Hero />)
    
    const browseLink = screen.getByRole('link', { name: 'Browse Library' })
    expect(browseLink).toHaveAttribute('href', '/library')
  })

  it('renders pixel particles effect', () => {
    render(<Hero />)
    
    expect(screen.getByTestId('pixel-particles')).toBeInTheDocument()
  })

  it('renders gradient background', () => {
    const { container } = render(<Hero />)
    
    const gradientDiv = container.querySelector('.bg-gradient-to-br')
    expect(gradientDiv).toBeInTheDocument()
  })
})
