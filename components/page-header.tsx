import { ReactNode } from 'react'
import { PixelParticles } from '@/components/animations/pixel-particles'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description: string
  children?: ReactNode
  showLibraryLegend?: boolean
}

export function PageHeader({ title, description, children, showLibraryLegend = false }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />
      
      {/* Pixel particles effect */}
      <PixelParticles />

      {/* Content */}
      <div className="container relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base text-muted-foreground md:text-lg">
            {description}
          </p>

          {/* Library Legend */}
          {showLibraryLegend && <LibraryLegend />}

          {/* Optional children (e.g., filters, nav) */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  )
}

/**
 * LibraryLegend component that explains the different library badge types
 */
function LibraryLegend() {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3">
      <Info className="mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="space-y-2 text-sm">
        <p className="font-medium text-foreground">Library Sources:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                "text-xs font-medium",
                "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
              )}
            >
              kiro-powers
            </Badge>
            <span className="text-muted-foreground">Official Kiro library</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                "text-xs font-medium",
                "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
              )}
            >
              promptz
            </Badge>
            <span className="text-muted-foreground">Community library</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                "text-xs font-medium",
                "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
              )}
            >
              kiro-best-practices
            </Badge>
            <span className="text-muted-foreground">Best practices</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                "text-xs font-medium",
                "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
              )}
            >
              product-teams
            </Badge>
            <span className="text-muted-foreground">AWS Samples</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for emphasized text
export function Emphasis({ children }: { children: ReactNode }) {
  return <span className="text-gradient">{children}</span>
}