import { CompactCard, CompactCardSkeleton } from "@/components/compact-card"
import type { ContentItem } from "@/lib/types/content"

interface GridProps {
  items: ContentItem[]
  maxItems?: number
  className?: string
}

export function Grid({ items, maxItems, className = "" }: GridProps) {
  const displayItems = maxItems !== undefined ? items.slice(0, maxItems) : items

  if (displayItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No content available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new content
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayItems.map((item) => (
        <CompactCard key={item.id} item={item} className="h-full" />
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <CompactCardSkeleton key={i} className="h-full" />
      ))}
    </div>
  )
}
