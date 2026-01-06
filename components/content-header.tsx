import { ContentTypeBadge } from '@/components/content-type-badge'
import { LibraryBadge } from '@/components/library-badge'
import { ModalityBadge, getModalitySupport } from '@/components/modality-badge'
import { BadgeContainer } from '@/components/badge-container'
import type { ContentItem } from '@/lib/types/content'

interface ContentHeaderProps {
  content: ContentItem
}

function getContentTitle(content: ContentItem): string {
  if (content.type === 'power') {
    return content.displayName || content.title
  }
  return content.title
}

function getContentDescription(content: ContentItem): string | undefined {
  // For agents, prioritize config description, fallback to frontmatter description
  if (content.type === 'agent') {
    return content.config.description || content.description
  }
  
  // For other content types, use the description field if it exists
  if ('description' in content) {
    return content.description
  }
  
  return undefined
}

export function ContentHeader({ content }: ContentHeaderProps) {
  const title = getContentTitle(content)
  const description = getContentDescription(content)

  return (
    <div className="mb-6">
      {/* Badges */}
      <BadgeContainer context="detail-header" className="mb-4">
        <ContentTypeBadge contentType={content.type} />
        <LibraryBadge content={content} />
        <ModalityBadge support={getModalitySupport(content.type)} />
      </BadgeContainer>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
