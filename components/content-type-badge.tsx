import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentTypeBadgeProps {
  contentType: string
  className?: string
}

/**
 * Get the appropriate styling for content type badges using brand colors
 * Each content type gets a distinct color from the brand palette
 */
function getContentTypeStyles(contentType: string): string {
  switch (contentType.toLowerCase()) {
    case 'prompt':
      // Primary brand color (indigo)
      return 'bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-gray-900 border-transparent'
    case 'agent':
      // Secondary brand color (violet)
      return 'bg-[#7C3AED] text-white dark:bg-[#A78BFA] dark:text-gray-900 border-transparent'
    case 'power':
      // Complementary brand color (cyan)
      return 'bg-[#06B6D4] text-white dark:bg-[#06B6D4] dark:text-gray-900 border-transparent'
    case 'hook':
      // Gradient using primary and secondary
      return 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white dark:from-[#818CF8] dark:to-[#A78BFA] dark:text-gray-900 border-transparent'
    case 'steering':
      // Gradient using secondary and complementary
      return 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white dark:from-[#A78BFA] dark:to-[#06B6D4] dark:text-gray-900 border-transparent'
    default:
      // Fallback to muted styling
      return 'bg-muted text-muted-foreground border-transparent'
  }
}

/**
 * ContentTypeBadge component for displaying content type badges with brand color styling
 * Each content type has a distinct color to ensure clear visual separation
 */
export function ContentTypeBadge({ contentType, className }: ContentTypeBadgeProps) {
  const contentTypeStyles = getContentTypeStyles(contentType)
  
  return (
    <Badge 
      variant="secondary" // Use secondary as base, override with custom colors
      className={cn(
        "text-xs font-medium",
        contentTypeStyles,
        className
      )}
    >
      {contentType.toLowerCase()}
    </Badge>
  )
}