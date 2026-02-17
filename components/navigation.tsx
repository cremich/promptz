'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SearchIcon, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/components/search-provider'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navLinks = [
  { href: '/library', label: 'Libraries' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/agents', label: 'Agents' },
  { href: '/powers', label: 'Powers' },
  { href: '/steering', label: 'Steering' },
  { href: '/hooks', label: 'Hooks' },
  { href: '/workshop', label: 'Workshop' },
]

const contributeLink = { href: '/contribute', label: 'Contribute' }

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { openSearch } = useSearch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

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

        {/* Mobile menu button and Search Button */}
        <div className="flex items-center gap-2">
          {/* Enhanced Contribute Button - Desktop only */}
          <Link
            href={contributeLink.href}
            className="hidden md:inline-flex rounded-md bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4  py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            {contributeLink.label}
          </Link>

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

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="lg"
            className="md:hidden"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleMobileLinkClick}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {/* Enhanced Contribute Link for Mobile */}
              <Link
                href={contributeLink.href}
                onClick={handleMobileLinkClick}
                className="mt-2 rounded-md bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {contributeLink.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
