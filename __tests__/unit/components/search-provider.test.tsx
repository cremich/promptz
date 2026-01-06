import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchProvider, useSearch } from '@/components/search-provider'

// Test component to access the search context
function TestComponent() {
  const { isOpen, openSearch, closeSearch } = useSearch()
  
  return (
    <div>
      <div data-testid="modal-state">{isOpen ? 'open' : 'closed'}</div>
      <button data-testid="open-button" onClick={openSearch}>
        Open Search
      </button>
      <button data-testid="close-button" onClick={closeSearch}>
        Close Search
      </button>
    </div>
  )
}

describe('SearchProvider', () => {
  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = 'unset'
  })

  afterEach(() => {
    // Clean up body overflow style after each test
    document.body.style.overflow = 'unset'
  })

  it('should provide search context to children', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    expect(screen.getByTestId('modal-state')).toHaveTextContent('closed')
  })

  it('should open search modal when openSearch is called', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    const openButton = screen.getByTestId('open-button')
    fireEvent.click(openButton)

    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')
  })

  it('should close search modal when closeSearch is called', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    const openButton = screen.getByTestId('open-button')
    const closeButton = screen.getByTestId('close-button')
    
    fireEvent.click(openButton)
    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')
    
    fireEvent.click(closeButton)
    expect(screen.getByTestId('modal-state')).toHaveTextContent('closed')
  })

  it('should open search modal when CMD+K is pressed', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')
  })

  it('should open search modal when CTRL+K is pressed', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')
  })

  it('should close search modal when ESC is pressed and modal is open', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    const openButton = screen.getByTestId('open-button')
    fireEvent.click(openButton)
    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByTestId('modal-state')).toHaveTextContent('closed')
  })

  it('should prevent body scroll when modal is open', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    const openButton = screen.getByTestId('open-button')
    fireEvent.click(openButton)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore body scroll when modal is closed', () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    )

    const openButton = screen.getByTestId('open-button')
    const closeButton = screen.getByTestId('close-button')
    
    fireEvent.click(openButton)
    expect(document.body.style.overflow).toBe('hidden')
    
    fireEvent.click(closeButton)
    expect(document.body.style.overflow).toBe('unset')
  })

  it('should throw error when useSearch is used outside SearchProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useSearch must be used within a SearchProvider')
    
    consoleSpy.mockRestore()
  })
})