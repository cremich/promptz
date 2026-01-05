'use client'

import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useSearch } from '@/components/search-provider'
import { cn } from '@/lib/utils'

interface SearchButtonProps {
  className?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

/**
 * Search button component that opens the global search modal.
 * Displays a search icon, placeholder text, and keyboard shortcut indicator.
 * 
 * @param className - Additional CSS classes to apply
 * @param variant - Button variant (default or outline)
 * @param size - Button size (default, sm, or lg)
 */
export function SearchButton({ 
  className, 
  variant = 'outline',
  size = 'lg'
}: SearchButtonProps) {
  const { openSearch } = useSearch()
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={openSearch}
      className={cn(
        'w-full justify-start gap-2 text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label="Open search dialog"
    >
      <SearchIcon className="h-4 w-4 shrink-0" data-icon="inline-start" />
      <span className="flex-1 text-left">Search library...</span>
      <Kbd className="ml-auto">⌘K</Kbd>
    </Button>
  )
}
