import { Badge } from '@/components/ui/badge'
import { Monitor, Terminal } from 'lucide-react'

export type ModalitySupport = 'ide' | 'cli' | 'both'

interface ModalityBadgeProps {
  support: ModalitySupport
  className?: string
}

export function ModalityBadge({ support, className }: ModalityBadgeProps) {
  const showIDE = support === 'ide' || support === 'both'
  const showCLI = support === 'cli' || support === 'both'

  return (
    <div className={`flex gap-1 ${className || ''}`}>
      {showIDE && (
        <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          <Monitor className="w-3 h-3 mr-1" />
          IDE
        </Badge>
      )}
      {showCLI && (
        <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          <Terminal className="w-3 h-3 mr-1" />
          CLI
        </Badge>
      )}
    </div>
  )
}

// Helper function to determine modality support based on content type
export function getModalitySupport(contentType: string): ModalitySupport {
  switch (contentType) {
    case 'steering':
    case 'prompt':
      return 'both'
    case 'agent':
      return 'cli' // CLI-focused
    case 'hook':
    case 'power':
      return 'ide' // IDE-focused
    default:
      return 'both' // fallback
  }
}