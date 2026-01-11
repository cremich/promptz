import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getLibraryName } from "@/lib/library"
import type { VariantProps } from "class-variance-authority"
import type { badgeVariants } from "@/components/ui/badge"
import type { ContentItem } from "@/lib/types/content"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

interface LibraryBadgeProps {
  content: ContentItem
  className?: string
}

/**
 * Get the appropriate badge variant and styling for library source badges
 */
function getLibraryBadgeVariant(libraryName: string): {
  variant: BadgeVariant
  className?: string
} {
  switch (libraryName.toLowerCase()) {
    case 'promptz':
      return { 
        variant: 'outline',
        className: 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300'
      }
    case 'kiro-powers':
      return { 
        variant: 'outline',
        className: 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300'
      }
    case 'kiro-best-practices':
      return { 
        variant: 'outline',
        className: 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-300'
      }
    case 'product-teams':
      return { 
        variant: 'outline',
        className: 'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'
      }
    default:
      return { variant: 'outline' }
  }
}

/**
 * LibraryBadge component for displaying library source badges with consistent styling
 */
export function LibraryBadge({ content, className }: LibraryBadgeProps) {
  const libraryName = getLibraryName(content.path)
  const badgeConfig = getLibraryBadgeVariant(libraryName)
  
  return (
    <Badge 
      variant={badgeConfig.variant}
      className={cn(
        "text-xs font-medium",
        badgeConfig.className,
        className
      )}
    >
      {libraryName}
    </Badge>
  )
}