import { User, Calendar, GitCommit, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GitHubLink } from '@/components/github-link'
import { ContentDate } from '@/components/content-date'
import { getDisplayAuthor } from '@/lib/formatter/content'
import type { ContentItem } from '@/lib/types/content'

interface ContributorInfoProps {
  content: ContentItem
}

function getShortHash(fullHash: string): string {
  return fullHash.substring(0, 7)
}

export function ContributorInfo({ content }: ContributorInfoProps) {
  const displayAuthor = getDisplayAuthor(content)

  return (
    <Card className="mb-8 border-border/40 bg-card/50">
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Metadata grid */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{displayAuthor}</span>
            </div>

            {/* Created date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <ContentDate content={content} variant="detail" />
            </div>

            {/* Last modified */}
            {content.git?.lastModifiedDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Updated </span>
                <ContentDate
                  content={{
                    ...content,
                    git: { ...content.git, createdDate: content.git.lastModifiedDate },
                  }}
                  variant="detail"
                />
              </div>
            )}

            {/* Commit hash */}
            {content.git?.commitHash && (
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4" />
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {getShortHash(content.git.commitHash)}
                </code>
              </div>
            )}
          </div>

          {/* GitHub link */}
          <GitHubLink content={content} />
        </div>
      </CardContent>
    </Card>
  )
}
