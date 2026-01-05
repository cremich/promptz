import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { idToSlug } from '@/lib/formatter/slug'
import { getDisplayAuthor, getDisplayTitle } from '@/lib/formatter/content'
import { ContentTypeBadge } from '@/components/content-type-badge'
import { LibraryBadge } from '@/components/library-badge'
import { BadgeContainer } from '@/components/badge-container'
import { GitHash } from '@/components/git-hash'
import { ContentDate } from '@/components/content-date'
import { cn } from '@/lib/utils'
import type { ContentItem } from '@/lib/types/content'

interface CompactCardProps {
  item: ContentItem
  className?: string
}

const typeConfig = {
  prompt: {
    href: '/prompts',
    gradient: 'from-[#4F46E5]/10 to-[#7C3AED]/10',
    hoverGradient: 'hover:from-[#4F46E5]/20 hover:to-[#7C3AED]/20',
  },
  agent: {
    href: '/agents',
    gradient: 'from-[#7C3AED]/10 to-[#06B6D4]/10',
    hoverGradient: 'hover:from-[#7C3AED]/20 hover:to-[#06B6D4]/20',
  },
  power: {
    href: '/powers',
    gradient: 'from-[#06B6D4]/10 to-[#4F46E5]/10',
    hoverGradient: 'hover:from-[#06B6D4]/20 hover:to-[#4F46E5]/20',
  },
  steering: {
    href: '/steering',
    gradient: 'from-[#4F46E5]/10 to-[#06B6D4]/10',
    hoverGradient: 'hover:from-[#4F46E5]/20 hover:to-[#06B6D4]/20',
  },
  hook: {
    href: '/hooks',
    gradient: 'from-[#7C3AED]/10 to-[#4F46E5]/10',
    hoverGradient: 'hover:from-[#7C3AED]/20 hover:to-[#4F46E5]/20',
  },
}

export function CompactCard({ item, className }: CompactCardProps) {
  const config = typeConfig[item.type]
  const title = getDisplayTitle(item)
  const displayAuthor = getDisplayAuthor(item)

  return (
    <Link href={`${config.href}/${idToSlug(item.id)}`} className="block h-full">
      <Card
        className={cn(
          'h-full bg-gradient-to-br transition-all duration-300 ease-out',
          'hover:shadow-lg hover:shadow-[#4F46E5]/5',
          'transform hover:scale-[1.02]',
          config.gradient,
          config.hoverGradient,
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {title}
            </CardTitle>
            <BadgeContainer context="card-header">
              <ContentTypeBadge contentType={item.type} />
              <LibraryBadge content={item} />
            </BadgeContainer>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">ID:</span> {item.id}
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Author:</span> {displayAuthor}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-4 mt-auto">
          <ContentDate content={item} />
          <GitHash git={item.git} />
        </CardFooter>
      </Card>
    </Link>
  )
}

export function CompactCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('h-full bg-gradient-to-br from-muted/50 to-muted/30', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-1 shrink-0">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/30 pt-4 mt-auto">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </CardFooter>
    </Card>
  )
}
