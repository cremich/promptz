import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '@/components/navigation'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ alt, ...props }: { alt: string; [key: string]: unknown }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />
  }
})

// Mock search provider
const mockOpenSearch = jest.fn()
jest.mock('@/components/search-provider', () => ({
  useSearch: () => ({
    openSearch: mockOpenSearch
  })
}))

describe('Navigation', () => {
  beforeEach(() => {
    mockOpenSearch.mockClear()
  })

  it('renders logo with link to home', () => {
    render(<Navigation />)
    
    const logoLink = screen.getByRole('link', { name: /promptz/i })
    expect(logoLink).toHaveAttribute('href', '/')
    expect(screen.getByAltText('Promptz')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
    expect(screen.getByRole('link', { name: 'Prompts' })).toHaveAttribute('href', '/prompts')
    expect(screen.getByRole('link', { name: 'Agents' })).toHaveAttribute('href', '/agents')
    expect(screen.getByRole('link', { name: 'Powers' })).toHaveAttribute('href', '/powers')
    expect(screen.getByRole('link', { name: 'Steering' })).toHaveAttribute('href', '/steering')
    expect(screen.getByRole('link', { name: 'Hooks' })).toHaveAttribute('href', '/hooks')
  })

  it('renders search button', () => {
    render(<Navigation />)
    
    const searchButton = screen.getByRole('button', { name: /open search/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('calls openSearch when search button is clicked', () => {
    render(<Navigation />)
    
    const searchButton = screen.getByRole('button', { name: /open search/i })
    fireEvent.click(searchButton)
    
    expect(mockOpenSearch).toHaveBeenCalledTimes(1)
  })

  it('renders keyboard shortcut indicator', () => {
    render(<Navigation />)
    
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Navigation className="custom-nav" />)
    
    const header = container.querySelector('header')
    expect(header).toHaveClass('custom-nav')
  })

  it('has sticky positioning', () => {
    const { container } = render(<Navigation />)
    
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky')
    expect(header).toHaveClass('top-0')
  })
})
