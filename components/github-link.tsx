import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContentItem } from '@/lib/types/content'
import { getLibraryName } from '@/lib/library'

interface GitHubLinkProps {
  content: ContentItem
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function constructGitHubUrl(content: ContentItem): string {
  const libraryName = getLibraryName(content.path)
  
  // Map library names to their GitHub repository URLs
  const libraryUrlMap: Record<string, string> = {
    'kiro-powers': 'https://github.com/kirodotdev/powers/blob/main',
    'promptz': 'https://github.com/cremich/promptz.lib/blob/main',
    'kiro-best-practices': 'https://github.com/awsdataarchitect/kiro-best-practices/blob/main',
  }
  
  // Default to promptz.lib for unknown libraries
  const baseUrl = libraryUrlMap[libraryName] || 'https://github.com/cremich/promptz.lib/blob/main'

  // Extract relative path from the full path
  const pathParts = content.path.split('/')
  const libraryIndex = pathParts.findIndex((part) => part === libraryName)
  const relativePath = pathParts.slice(libraryIndex + 1).join('/')

  return `${baseUrl}/${relativePath}`
}

export function GitHubLink({
  content,
  className,
  variant = 'outline',
  size = 'sm',
}: GitHubLinkProps) {
  const githubUrl = constructGitHubUrl(content)

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer">
        <GitHubIcon className="h-4 w-4" />
        View on GitHub
        <ExternalLink className="h-3 w-3" />
      </a>
    </Button>
  )
}
