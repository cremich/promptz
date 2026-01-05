import { render, screen } from '@testing-library/react'
import { LibraryBadge } from '@/components/library-badge'
import type { ContentItem } from '@/lib/types/content'

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

// Mock the getLibraryName function
jest.mock('@/lib/library', () => ({
  getLibraryName: jest.fn((path: string) => {
    if (path.includes('promptz')) return 'promptz'
    if (path.includes('kiro-powers')) return 'kiro-powers'
    return 'unknown-lib'
  })
}))

describe('LibraryBadge', () => {
  const createMockContent = (path: string): ContentItem => ({
    id: 'test-id',
    title: 'Test Content',
    author: 'Test Author',
    date: '2024-01-01',
    path,
    type: 'prompt'
  } as ContentItem)

  it('should render promptz library with blue styling', () => {
    const content = createMockContent('libraries/promptz/prompts/test-prompt')
    render(<LibraryBadge content={content} />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('promptz')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveClass('dark:border-blue-800 dark:text-blue-300')
  })

  it('should render kiro-powers library with purple styling', () => {
    const content = createMockContent('libraries/kiro-powers/powers/test-power')
    render(<LibraryBadge content={content} />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('kiro-powers')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveClass('dark:border-purple-800 dark:text-purple-300')
  })

  it('should render unknown library with default styling', () => {
    const content = createMockContent('some/unknown/path')
    render(<LibraryBadge content={content} />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('unknown-lib')
    expect(badge).toHaveAttribute('data-variant', 'outline')
  })

  it('should be case insensitive for library names', () => {
    const content = createMockContent('libraries/PROMPTZ/prompts/test-prompt')
    // Mock getLibraryName to return uppercase
    const mockGetLibraryName = jest.requireMock('@/lib/library').getLibraryName
    mockGetLibraryName.mockReturnValueOnce('PROMPTZ')
    
    render(<LibraryBadge content={content} />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('PROMPTZ')
  })

  it('should apply custom className', () => {
    const content = createMockContent('libraries/promptz/prompts/test-prompt')
    render(<LibraryBadge content={content} className="custom-class" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('custom-class')
  })
})