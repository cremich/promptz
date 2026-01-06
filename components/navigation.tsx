'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/components/search-provider'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/library', label: 'Library' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/agents', label: 'Agents' },
  { href: '/powers', label: 'Powers' },
  { href: '/steering', label: 'Steering' },
  { href: '/hooks', label: 'Hooks' },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { openSearch } = useSearch()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl',
        className
      )}
    >
      <nav className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/promptz_logo.png"
            alt="Promptz"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-lg font-semibold tracking-tight">promptz</span>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Button */}
        <Button
          variant="outline"
          onClick={openSearch}
          className="gap-2"
          aria-label="Open search"
          size={'lg'}
        >
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search library...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </Button>
      </nav>
    </header>
  )
}
