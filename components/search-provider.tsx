'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SearchContextValue {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: React.ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const openSearch = () => setIsOpen(true)
  const closeSearch = () => setIsOpen(false)
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // CMD+K on Mac, CTRL+K on Windows/Linux
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        openSearch()
      }
      
      // ESC to close when modal is open
      if (event.key === 'Escape' && isOpen) {
        closeSearch()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  const value = {
    isOpen,
    openSearch,
    closeSearch
  }
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}