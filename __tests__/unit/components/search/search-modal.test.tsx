import React from 'react'
import { render, screen } from '@testing-library/react'
import { SearchModal } from '@/components/search/search-modal'
import { useSearch } from '@/components/search-provider'
import { useSearchModal } from '@/components/search/useSearchModal'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

jest.mock('@/components/search-provider', () => ({
  useSearch: jest.fn()
}))

jest.mock('@/components/search/useSearchModal', () => ({
  useSearchModal: jest.fn()
}))

const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>
const mockUseSearchModal = useSearchModal as jest.MockedFunction<typeof useSearchModal>

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid="dialog" data-open={open}>{children}</div>
  ),
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" className={className}>{children}</div>
  ),
}))

describe('SearchModal', () => {
  const mockCloseSearch = jest.fn()

  const defaultHookReturn = {
    query: '',
    setQuery: jest.fn(),
    results: [],
    selectedIndex: 0,
    setSelectedIndex: jest.fn(),
    isLoading: false,
    error: null,
    hasPartialData: false,
    inputRef: { current: null },
    resultsRef: { current: null },
    handleKeyDown: jest.fn(),
    handleResultClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearch.mockReturnValue({
      isOpen: false,
      openSearch: jest.fn(),
      closeSearch: mockCloseSearch
    })
    mockUseSearchModal.mockReturnValue(defaultHookReturn)
  })

  it('renders when search is closed', () => {
    render(<SearchModal />)
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
  })

  it('renders when search is open', () => {
    mockUseSearch.mockReturnValue({
      isOpen: true,
      openSearch: jest.fn(),
      closeSearch: mockCloseSearch
    })
    render(<SearchModal />)
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
  })

  it('shows loading state', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({ ...defaultHookReturn, isLoading: true })
    render(<SearchModal />)
    expect(screen.getByText('Loading search index...')).toBeInTheDocument()
  })

  it('shows empty state when no query', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    render(<SearchModal />)
    expect(screen.getByText('Start typing to search across all libraries...')).toBeInTheDocument()
  })

  it('shows no results state', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({ ...defaultHookReturn, query: 'nonexistent' })
    render(<SearchModal />)
    expect(screen.getByText(/No results found for/)).toBeInTheDocument()
  })

  it('shows error display when error occurs', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({
      ...defaultHookReturn,
      error: {
        type: 'index_load_failed',
        message: 'Failed',
        userMessage: 'Unable to load search data. Please try again.',
        canRetry: true
      }
    })
    render(<SearchModal />)
    expect(screen.getByText('Unable to load search data. Please try again.')).toBeInTheDocument()
  })

  it('shows results when available', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({
      ...defaultHookReturn,
      query: 'test',
      results: [{
        item: {
          id: 'test-1',
          type: 'prompt',
          title: 'Test Prompt',
          description: 'A test prompt',
          content: 'Content',
          author: 'Author',
          date: '2024-01-01',
          library: 'test',
          path: '/prompts/test',
          keywords: []
        },
        refIndex: 0,
        score: 0.1
      }]
    })
    render(<SearchModal />)
    expect(screen.getByText('A test prompt')).toBeInTheDocument()
  })

  it('shows partial data warning in empty state', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({
      ...defaultHookReturn,
      hasPartialData: true,
      error: {
        type: 'partial_data',
        message: 'Some data missing',
        userMessage: 'Some content may not appear in search results.',
        canRetry: false
      }
    })
    render(<SearchModal />)
    expect(screen.getByText('Some content may not appear in search results.')).toBeInTheDocument()
  })

  it('disables input while loading', () => {
    mockUseSearch.mockReturnValue({ isOpen: true, openSearch: jest.fn(), closeSearch: mockCloseSearch })
    mockUseSearchModal.mockReturnValue({ ...defaultHookReturn, isLoading: true })
    render(<SearchModal />)
    expect(screen.getByPlaceholderText('What are you searching for?')).toBeDisabled()
  })
})
