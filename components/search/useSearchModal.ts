'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { FuseResult } from 'fuse.js'
import Fuse from 'fuse.js'
import type { SearchIndexItem, SearchIndex } from '@/lib/types/content'
import type { SearchError } from '@/lib/search'
import { validateSearchIndex, createSearchError } from '@/lib/search'

const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'content', weight: 0.2 },
    { name: 'keywords', weight: 0.1 }
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true
}

export interface UseSearchModalOptions {
  isOpen: boolean
  onNavigate: (path: string) => void
  onClose: () => void
  loadSearchIndex?: () => Promise<SearchIndex>
}

export interface UseSearchModalReturn {
  query: string
  setQuery: (query: string) => void
  results: FuseResult<SearchIndexItem>[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  isLoading: boolean
  error: SearchError | null
  hasPartialData: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  resultsRef: React.RefObject<HTMLDivElement | null>
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleResultClick: (result: FuseResult<SearchIndexItem>, index: number) => void
}

async function defaultLoadSearchIndex(): Promise<SearchIndex> {
  const searchIndexModule = await import('@/data/search-index.json')
  return searchIndexModule.default as SearchIndex
}

export function useSearchModal({
  isOpen,
  onNavigate,
  onClose,
  loadSearchIndex = defaultLoadSearchIndex
}: UseSearchModalOptions): UseSearchModalReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FuseResult<SearchIndexItem>[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SearchError | null>(null)
  const [hasPartialData, setHasPartialData] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  // Initialize Fuse.js when modal opens
  useEffect(() => {
    if (!isOpen || isInitializedRef.current || isLoading) return

    const initializeFuse = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const searchIndexData = await loadSearchIndex()
        const { items, isPartial, validationErrors } = validateSearchIndex(searchIndexData)

        if (items.length === 0 && validationErrors.length > 0) {
          throw new Error('Search index is malformed or empty')
        }

        if (isPartial) {
          setHasPartialData(true)
          setError(createSearchError('partial_data'))
        }

        setFuse(new Fuse(items, FUSE_OPTIONS))
        isInitializedRef.current = true
      } catch (loadError) {
        const errorType = loadError instanceof SyntaxError
          ? 'index_malformed'
          : 'index_load_failed'
        setError(createSearchError(errorType, loadError))
        setFuse(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeFuse()
  }, [isOpen, loadSearchIndex, isLoading])

  // Focus input when modal opens
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (isOpen) return
    setQuery('')
    setResults([])
    setSelectedIndex(0)
  }, [isOpen])

  // Debounced search when query changes
  useEffect(() => {
    if (!fuse) return

    const timeoutId = setTimeout(() => {
      if (!query.trim()) {
        setResults([])
        setSelectedIndex(0)
        return
      }

      try {
        const searchResults = fuse.search(query, { limit: 10 })
        setResults(searchResults)
        setSelectedIndex(0)
      } catch {
        setResults([])
      }
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [query, fuse])

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current || results.length === 0) return
    const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
    selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedIndex, results.length])

  const handleResultSelect = useCallback((result: FuseResult<SearchIndexItem>) => {
    onClose()
    onNavigate(result.item.path)
  }, [onClose, onNavigate])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        event.preventDefault()
        if (results[selectedIndex]) {
          handleResultSelect(results[selectedIndex])
        }
        break
    }
  }, [results, selectedIndex, handleResultSelect])

  const handleResultClick = useCallback((result: FuseResult<SearchIndexItem>, index: number) => {
    setSelectedIndex(index)
    handleResultSelect(result)
  }, [handleResultSelect])

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    isLoading,
    error,
    hasPartialData,
    inputRef,
    resultsRef,
    handleKeyDown,
    handleResultClick
  }
}
