import { getFormattedDisplayDate } from "@/lib/formatter/date"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/lib/types/content"

interface ContentDateProps {
  content: ContentItem
  className?: string
  variant?: "card" | "detail" | "inline"
}

/**
 * Standardized date component for consistent date rendering across the application.
 * Handles git dates and frontmatter dates with proper fallback logic.
 * 
 * @param content - Content item containing git info and frontmatter date
 * @param className - Additional CSS classes
 * @param variant - Display variant for different contexts
 */
export function ContentDate({ 
  content, 
  className,
  variant = "card",
  ...props
}: ContentDateProps & Record<string, unknown>) {
  const formattedDate = getFormattedDisplayDate(content.git?.createdDate, content.date)
  
  const baseClasses = {
    card: "text-xs text-muted-foreground",
    detail: "text-sm",
    inline: "text-sm text-muted-foreground"
  }
  
  return (
    <span className={cn(baseClasses[variant], className)} {...props}>
      {formattedDate}
    </span>
  )
}