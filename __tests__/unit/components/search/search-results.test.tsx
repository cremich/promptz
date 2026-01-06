import { render, screen, fireEvent } from '@testing-library/react'
import type { FuseResult } from 'fuse.js'
import type { SearchIndexItem } from '@/lib/types/content'
import type { SearchError } from '@/lib/search'
import {
  SearchResults,
  SearchErrorDisplay,
  SearchEmptyState,
  SearchNoResults,
  SearchLoading
} from '@/components/search/search-results'

jest.mock('next/link', () => {
  return function MockLink({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) {
    return <a href={href} onClick={onClick}>{children}</a>
  }
})

const createMockResult = (overrides: Partial<SearchIndexItem> = {}): FuseResult<SearchIndexItem> => ({
  item: {
    id: 'test-1',
    type: 'prompt',
    title: 'Test Prompt',
    description: 'A test prompt description',
    content: 'Test content',
    author: 'Test Author',
    date: '2024-01-01',
    library: 'test-library',
    path: '/prompts/test',
    ...overrides
  },
  refIndex: 0,
  score: 0.1,
  matches: [{ key: 'title', value: 'Test Prompt', indices: [[0, 3]], refIndex: 0 }]
})

describe('SearchResults', () => {
  const mockOnResultClick = jest.fn()
  const mockOnSelectedIndexChange = jest.fn()
  const mockResultsRef = { current: null }

  beforeEach(() => {
    mockOnResultClick.mockClear()
    mockOnSelectedIndexChange.mockClear()
  })

  it('renders empty when no results', () => {
    render(
      <SearchResults
        results={[]}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('renders search results with correct content', () => {
    render(
      <SearchResults
        results={[createMockResult()]}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    const promptBadges = screen.getAllByText('Prompt')
    expect(promptBadges.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('A test prompt description')).toBeInTheDocument()
    expect(screen.getByText('test-library')).toBeInTheDocument()
    expect(screen.getByText('by Test Author')).toBeInTheDocument()
    expect(screen.getByText('90% match')).toBeInTheDocument()
  })

  it('calls onResultClick when result is clicked', () => {
    const results = [createMockResult()]
    render(
      <SearchResults
        results={results}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    const resultItem = screen.getByText('A test prompt description').closest('div[class*="cursor-pointer"]')
    fireEvent.click(resultItem!)
    expect(mockOnResultClick).toHaveBeenCalledWith(results[0], 0)
  })

  it('calls onSelectedIndexChange on mouse enter', () => {
    render(
      <SearchResults
        results={[createMockResult()]}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    const resultItem = screen.getByText('A test prompt description').closest('div[class*="cursor-pointer"]')
    fireEvent.mouseEnter(resultItem!)
    expect(mockOnSelectedIndexChange).toHaveBeenCalledWith(0)
  })

  it('renders all content types correctly', () => {
    const types: Array<SearchIndexItem['type']> = ['prompt', 'agent', 'power', 'steering', 'hook']
    const results = types.map((type, index) =>
      createMockResult({ id: `test-${index}`, type, title: `Test ${type}` })
    )
    render(
      <SearchResults
        results={results}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    expect(screen.getByText('Prompt')).toBeInTheDocument()
    expect(screen.getByText('Agent')).toBeInTheDocument()
    expect(screen.getByText('Power')).toBeInTheDocument()
    expect(screen.getByText('Steering')).toBeInTheDocument()
    expect(screen.getByText('Hook')).toBeInTheDocument()
  })

  it('handles result without score', () => {
    const result = createMockResult()
    delete (result as { score?: number }).score
    render(
      <SearchResults
        results={[result]}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    expect(screen.queryByText(/% match/)).not.toBeInTheDocument()
  })

  it('handles unknown content type with fallback', () => {
    render(
      <SearchResults
        results={[createMockResult({ type: 'unknown' as SearchIndexItem['type'] })]}
        selectedIndex={0}
        onResultClick={mockOnResultClick}
        onSelectedIndexChange={mockOnSelectedIndexChange}
        resultsRef={mockResultsRef}
      />
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('SearchErrorDisplay', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders error message', () => {
    render(
      <SearchErrorDisplay
        error={{ type: 'index_load_failed', message: 'Failed', userMessage: 'Unable to load search data.', canRetry: true }}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Unable to load search data.')).toBeInTheDocument()
  })

  it('renders fallback browse links', () => {
    render(
      <SearchErrorDisplay
        error={{ type: 'index_load_failed', message: 'Failed', userMessage: 'Error', canRetry: true }}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Browse content directly:')).toBeInTheDocument()
    expect(screen.getByText('Prompts')).toBeInTheDocument()
    expect(screen.getByText('Agents')).toBeInTheDocument()
    expect(screen.getByText('Powers')).toBeInTheDocument()
    expect(screen.getByText('Steering')).toBeInTheDocument()
    expect(screen.getByText('Hooks')).toBeInTheDocument()
  })

  it('calls onClose when browse link is clicked', () => {
    render(
      <SearchErrorDisplay
        error={{ type: 'index_load_failed', message: 'Failed', userMessage: 'Error', canRetry: true }}
        onClose={mockOnClose}
      />
    )
    fireEvent.click(screen.getByText('Prompts'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('has correct href for browse links', () => {
    render(
      <SearchErrorDisplay
        error={{ type: 'index_load_failed', message: 'Failed', userMessage: 'Error', canRetry: true }}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Prompts').closest('a')).toHaveAttribute('href', '/prompts')
    expect(screen.getByText('Agents').closest('a')).toHaveAttribute('href', '/agents')
    expect(screen.getByText('Powers').closest('a')).toHaveAttribute('href', '/powers')
    expect(screen.getByText('Steering').closest('a')).toHaveAttribute('href', '/steering')
    expect(screen.getByText('Hooks').closest('a')).toHaveAttribute('href', '/hooks')
  })
})

describe('SearchEmptyState', () => {
  it('renders default empty state message', () => {
    render(<SearchEmptyState hasPartialData={false} error={null} />)
    expect(screen.getByText('Start typing to search across all libraries...')).toBeInTheDocument()
  })

  it('shows partial data warning when hasPartialData is true and error type is partial_data', () => {
    const error: SearchError = {
      type: 'partial_data',
      message: 'Some data missing',
      userMessage: 'Some content may not appear in search results.',
      canRetry: false
    }
    render(<SearchEmptyState hasPartialData={true} error={error} />)
    expect(screen.getByText('Some content may not appear in search results.')).toBeInTheDocument()
  })

  it('does not show partial data warning when hasPartialData is false', () => {
    const error: SearchError = {
      type: 'partial_data',
      message: 'Some data missing',
      userMessage: 'Some content may not appear in search results.',
      canRetry: false
    }
    render(<SearchEmptyState hasPartialData={false} error={error} />)
    expect(screen.queryByText('Some content may not appear in search results.')).not.toBeInTheDocument()
  })
})

describe('SearchNoResults', () => {
  it('renders no results message with query', () => {
    render(<SearchNoResults query="test query" />)
    expect(screen.getByText(/No results found for/)).toBeInTheDocument()
    expect(screen.getByText(/test query/)).toBeInTheDocument()
  })

  it('renders suggestion text', () => {
    render(<SearchNoResults query="test" />)
    expect(screen.getByText('Try different keywords or check spelling')).toBeInTheDocument()
  })
})

describe('SearchLoading', () => {
  it('renders loading message', () => {
    render(<SearchLoading />)
    expect(screen.getByText('Loading search index...')).toBeInTheDocument()
  })
})
