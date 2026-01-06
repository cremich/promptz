import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface KeywordsProps {
  keywords: string[]
  className?: string
}

export function Keywords({ keywords, className }: KeywordsProps) {
  if (!keywords || keywords.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {keywords.map((keyword) => (
        <Badge key={keyword} variant="secondary" className="text-xs">
          {keyword}
        </Badge>
      ))}
    </div>
  )
}