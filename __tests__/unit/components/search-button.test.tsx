import { render, screen, fireEvent } from '@testing-library/react'
import { SearchButton } from '@/components/search-button'

// Mock the useSearch hook
const mockOpenSearch = jest.fn()

jest.mock('@/components/search-provider', () => ({
  ...jest.requireActual('@/components/search-provider'),
  useSearch: () => ({
    isOpen: false,
    openSearch: mockOpenSearch,
    closeSearch: jest.fn()
  })
}))

describe('SearchButton', () => {
  beforeEach(() => {
    mockOpenSearch.mockClear()
  })

  it('renders with default props', () => {
    render(<SearchButton />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Search library...')).toBeInTheDocument()
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('renders search icon', () => {
    render(<SearchButton />)
    
    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('calls openSearch when clicked', () => {
    render(<SearchButton />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOpenSearch).toHaveBeenCalledTimes(1)
  })

  it('has correct aria-label for accessibility', () => {
    render(<SearchButton />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Open search dialog')
  })

  it('applies custom className', () => {
    render(<SearchButton className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders with outline variant by default', () => {
    render(<SearchButton />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
  })

  it('renders with lg size by default', () => {
    render(<SearchButton />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('renders with custom variant', () => {
    render(<SearchButton variant="default" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'default')
  })

  it('renders with custom size', () => {
    render(<SearchButton size="sm" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'sm')
  })

  it('displays keyboard shortcut indicator', () => {
    render(<SearchButton />)
    
    const kbd = screen.getByText('⌘K')
    expect(kbd).toBeInTheDocument()
    expect(kbd.tagName.toLowerCase()).toBe('kbd')
  })
})
