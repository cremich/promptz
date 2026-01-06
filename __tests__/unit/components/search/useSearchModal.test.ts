import { renderHook, act } from '@testing-library/react'
import { useSearchModal } from '@/components/search/useSearchModal'
import type { SearchIndex } from '@/lib/types/content'

const createMockSearchIndex = (): SearchIndex => ({
  items: [
    {
      id: 'test/prompt/example',
      type: 'prompt',
      title: 'Test Prompt',
      description: 'A test prompt',
      content: 'Content',
      author: 'Author',
      date: '2024-01-01',
      library: 'test',
      path: '/prompts/example',
      keywords: ['test']
    },
    {
      id: 'test/agent/example',
      type: 'agent',
      title: 'Test Agent',
      description: 'A test agent',
      content: 'Content',
      author: 'Author',
      date: '2024-01-01',
      library: 'test',
      path: '/agents/example',
      keywords: ['agent']
    }
  ],
  metadata: { generatedAt: '2024-01-01', totalItems: 2, itemsByType: { prompt: 1, agent: 1 } }
})

describe('useSearchModal', () => {
  const mockOnNavigate = jest.fn()
  const mockOnClose = jest.fn()
  const mockLoadSearchIndex = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockLoadSearchIndex.mockResolvedValue(createMockSearchIndex())
  })

  test('initializes with default state when closed', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.selectedIndex).toBe(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('starts loading when modal opens', async () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: true,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    expect(result.current.isLoading).toBe(true)

    // Wait for async effects to complete
    await act(async () => {
      await mockLoadSearchIndex()
    })
  })

  test('handles ArrowDown key', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    const mockEvent = { key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent

    act(() => {
      result.current.handleKeyDown(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  test('handles ArrowUp key', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    const mockEvent = { key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent

    act(() => {
      result.current.handleKeyDown(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  test('handles Enter key', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    const mockEvent = { key: 'Enter', preventDefault: jest.fn() } as unknown as React.KeyboardEvent

    act(() => {
      result.current.handleKeyDown(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  test('ignores unhandled keys', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    const mockEvent = { key: 'Escape', preventDefault: jest.fn() } as unknown as React.KeyboardEvent

    act(() => {
      result.current.handleKeyDown(mockEvent)
    })

    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
  })

  test('updates query via setQuery', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    act(() => {
      result.current.setQuery('test')
    })

    expect(result.current.query).toBe('test')
  })

  test('updates selectedIndex via setSelectedIndex', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    act(() => {
      result.current.setSelectedIndex(5)
    })

    expect(result.current.selectedIndex).toBe(5)
  })

  test('provides refs for input and results', () => {
    const { result } = renderHook(() =>
      useSearchModal({
        isOpen: false,
        onNavigate: mockOnNavigate,
        onClose: mockOnClose,
        loadSearchIndex: mockLoadSearchIndex
      })
    )

    expect(result.current.inputRef).toBeDefined()
    expect(result.current.resultsRef).toBeDefined()
  })
})
