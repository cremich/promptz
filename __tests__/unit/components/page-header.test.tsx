import { render, screen } from '@testing-library/react'
import { PageHeader, Emphasis } from '@/components/page-header'

// Mock PixelParticles component
jest.mock('@/components/animations/pixel-particles', () => ({
  PixelParticles: () => <div data-testid="pixel-particles" />
}))

describe('PageHeader', () => {
  it('renders title as string', () => {
    render(<PageHeader title="Test Title" description="Test description" />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title')
  })

  it('renders title as ReactNode', () => {
    render(
      <PageHeader 
        title={<><Emphasis>Highlighted</Emphasis> Title</>} 
        description="Test description" 
      />
    )
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Highlighted Title')
  })

  it('renders description', () => {
    render(<PageHeader title="Title" description="This is a test description" />)
    
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('renders children when provided', () => {
    render(
      <PageHeader title="Title" description="Description">
        <div data-testid="child-content">Child Content</div>
      </PageHeader>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('renders pixel particles effect', () => {
    render(<PageHeader title="Title" description="Description" />)
    
    expect(screen.getByTestId('pixel-particles')).toBeInTheDocument()
  })

  it('does not render library legend by default', () => {
    render(<PageHeader title="Title" description="Description" />)
    
    expect(screen.queryByText('Library Sources:')).not.toBeInTheDocument()
  })

  it('renders library legend when showLibraryLegend is true', () => {
    render(<PageHeader title="Title" description="Description" showLibraryLegend />)
    
    expect(screen.getByText('Library Sources:')).toBeInTheDocument()
    expect(screen.getByText('kiro-powers')).toBeInTheDocument()
    expect(screen.getByText('Official Kiro library')).toBeInTheDocument()
    expect(screen.getByText('promptz')).toBeInTheDocument()
    expect(screen.getByText('Community library')).toBeInTheDocument()
  })
})
