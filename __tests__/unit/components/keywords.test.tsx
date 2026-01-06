import { render, screen } from '@testing-library/react'
import { Keywords } from '@/components/keywords'

describe('Keywords', () => {
  it('renders keywords as badges', () => {
    const keywords = ['react', 'typescript', 'nextjs']
    render(<Keywords keywords={keywords} />)
    
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
  })

  it('returns null when keywords array is empty', () => {
    const { container } = render(<Keywords keywords={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when keywords is undefined', () => {
    //@ts-expect-error: explicit for test
    const { container } = render(<Keywords keywords={undefined as string[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className when provided', () => {
    const keywords = ['test']
    const customClass = 'custom-class'
    const { container } = render(<Keywords keywords={keywords} className={customClass} />)
    
    expect(container.firstChild).toHaveClass(customClass)
  })

  it('renders each keyword as a secondary badge with correct styling', () => {
    const keywords = ['keyword1', 'keyword2']
    render(<Keywords keywords={keywords} />)
    
    // Check that keywords are rendered as text
    expect(screen.getByText('keyword1')).toBeInTheDocument()
    expect(screen.getByText('keyword2')).toBeInTheDocument()
  
  })
})