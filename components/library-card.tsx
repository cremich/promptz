import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitHubLink } from '@/components/github-link'
import { ExternalLink, Package, Users, FileText, Bot, Zap, BookOpen, Webhook } from 'lucide-react'
import type { LibraryInfo } from '@/lib/libraries'

interface LibraryCardProps {
  library: LibraryInfo
}

const categoryConfig = {
  official: {
    label: 'Official',
    className: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
  },
  community: {
    label: 'Community',
    className: 'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
  },
  individual: {
    label: 'Individual',
    className: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
  },
}

const contentTypeIcons = {
  prompts: FileText,
  agents: Bot,
  powers: Zap,
  steering: BookOpen,
  hooks: Webhook,
}

function ContentStats({ stats }: { stats: LibraryInfo['contentStats'] }) {
  const types = [
    { key: 'prompts' as const, label: 'Prompts' },
    { key: 'agents' as const, label: 'Agents' },
    { key: 'powers' as const, label: 'Powers' },
    { key: 'steering' as const, label: 'Steering' },
    { key: 'hooks' as const, label: 'Hooks' },
  ]

  const hasContent = types.some(type => stats[type.key] > 0)

  if (!hasContent) {
    return (
      <div className="text-sm text-muted-foreground">
        No content available
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(type => {
        const count = stats[type.key]
        if (count === 0) return null

        const Icon = contentTypeIcons[type.key]
        return (
          <div
            key={type.key}
            className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-xs font-medium"
          >
            <Icon className="h-3 w-3" />
            <span>{count} {type.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function LibraryCard({ library }: LibraryCardProps) {
  const categoryInfo = categoryConfig[library.category]
  
  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <CardTitle className="text-lg font-semibold truncate">
                {library.displayName}
              </CardTitle>
            </div>
            <CardDescription className="line-clamp-2">
              {library.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={categoryInfo.className}>
            {categoryInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Statistics */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Content</span>
            <Badge variant="secondary" className="text-xs">
              {library.contentStats.total} items
            </Badge>
          </div>
          <ContentStats stats={library.contentStats} />
        </div>

        {/* Repository Information */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{library.owner}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <GitHubLink 
              url={library.repositoryUrl}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            />
            <Link
              href={`/library/${library.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Browse
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </Card>
  )
}