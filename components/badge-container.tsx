import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeContainerProps {
  children: ReactNode
  context?: 'card-header' | 'detail-header'
  className?: string
  maxBadges?: number
}

/**
 * Get badge arrangement configuration for different display contexts
 */
function getBadgeArrangement(context: 'card-header' | 'detail-header') {
  switch (context) {
    case 'card-header':
      return {
        containerClasses: 'flex flex-wrap gap-1 shrink-0',
        maxBadges: 3
      }
    case 'detail-header':
    default:
      return {
        containerClasses: 'flex flex-wrap gap-2',
        maxBadges: 5
      }
  }
}

/**
 * BadgeContainer component for consistent badge arrangement and spacing
 */
export function BadgeContainer({ 
  children, 
  context = 'detail-header', 
  className
}: BadgeContainerProps) {
  const arrangement = getBadgeArrangement(context)
  
  return (
    <div className={cn(arrangement.containerClasses, className)}>
      {children}
    </div>
  )
}