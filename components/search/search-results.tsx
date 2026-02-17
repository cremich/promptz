'use client'

import React from 'react'
import Link from 'next/link'
import type { FuseResult } from 'fuse.js'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SearchIndexItem } from '@/lib/types/content'
import type { SearchError } from '@/lib/search'
import { highlightMatches, contentTypeConfig } from '@/lib/search'

interface SearchResultsProps {
  results: FuseResult<SearchIndexItem>[]
  selectedIndex: number
  onResultClick: (result: FuseResult<SearchIndexItem>, index: number) => void
  onSelectedIndexChange: (index: number) => void
  resultsRef: React.RefObject<HTMLDivElement | null>
}

export function SearchResults({
  results,
  selectedIndex,
  onResultClick,
  onSelectedIndexChange,
  resultsRef
}: SearchResultsProps) {
  return (
    <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
      {results.map((result, index) => {
        const config = contentTypeConfig[result.item.type] || { badge: 'Content', color: 'gray' }

        return (
          <div
            key={result.item.id}
            className={`p-3 cursor-pointer border-b border-border last:border-b-0 transition-colors ${
              index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
            }`}
            onClick={() => onResultClick(result, index)}
            onMouseEnter={() => onSelectedIndexChange(index)}
          >
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0">
                {config.badge}
              </Badge>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate mb-1">
                  {highlightMatches(result.item.title, result.matches)}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {result.item.description}
                </p>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {result.item.library}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    by {result.item.author}
                  </span>
                  {result.score && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {Math.round((1 - result.score) * 100)}% match
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface SearchErrorDisplayProps {
  error: SearchError
  onClose: () => void
}

export function SearchErrorDisplay({ error, onClose }: SearchErrorDisplayProps) {
  return (
    <div className="p-8 text-center">
      <div className="flex justify-center mb-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="text-sm text-destructive mb-4">
        {error.userMessage}
      </div>
      <div className="border-t border-border pt-4">
        <div className="text-xs text-muted-foreground mb-3">
          Browse content directly:
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/prompts" onClick={onClose}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              Prompts
            </Badge>
          </Link>
          <Link href="/agents" onClick={onClose}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              Agents
            </Badge>
          </Link>
          <Link href="/powers" onClick={onClose}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              Powers
            </Badge>
          </Link>
          <Link href="/steering" onClick={onClose}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              Steering
            </Badge>
          </Link>
          <Link href="/hooks" onClick={onClose}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
              Hooks
            </Badge>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface SearchEmptyStateProps {
  hasPartialData: boolean
  error: SearchError | null
}

export function SearchEmptyState({ hasPartialData, error }: SearchEmptyStateProps) {
  return (
    <div className="p-8 text-center">
      {hasPartialData && error?.type === 'partial_data' && (
        <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <div className="text-xs text-yellow-700 dark:text-yellow-400">
            {error.userMessage}
          </div>
        </div>
      )}
      <div className="text-muted-foreground text-sm">
        Start typing to search across all libraries...
      </div>
    </div>
  )
}

interface SearchNoResultsProps {
  query: string
}

export function SearchNoResults({ query }: SearchNoResultsProps) {
  return (
    <div className="p-8 text-center">
      <div className="text-muted-foreground text-sm mb-2">
        No results found for &ldquo;{query}&rdquo;
      </div>
      <div className="text-xs text-muted-foreground">
        Try different keywords or check spelling
      </div>
    </div>
  )
}

export function SearchLoading() {
  return (
    <div className="p-8 text-center">
      <div className="text-sm text-muted-foreground mb-2">
        Loading search index...
      </div>
    </div>
  )
}
