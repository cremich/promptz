import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Technique } from '@/lib/workshop-data'

interface TechniqueCardProps {
  technique: Technique
  id: string
  className?: string
}

/**
 * Maps risk level to Badge variant and custom styling.
 * Color-coded from green (Low) through orange to red (High).
 */
function getRiskBadgeProps(riskLevel: Technique['riskLevel']): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className: string
  label: string
} {
  switch (riskLevel) {
    case 'High':
      return {
        variant: 'destructive',
        className: '',
        label: 'High Risk',
      }
    case 'Medium-High':
      return {
        variant: 'destructive',
        className: 'bg-orange-600 dark:bg-orange-500',
        label: 'Medium-High Risk',
      }
    case 'Medium':
      return {
        variant: 'secondary',
        className: '',
        label: 'Medium Risk',
      }
    case 'Low-Medium':
      return {
        variant: 'outline',
        className: '',
        label: 'Low-Medium Risk',
      }
    case 'Low':
      return {
        variant: 'default',
        className: '',
        label: 'Low Risk',
      }
  }
}

export function TechniqueCard({ technique, id, className }: TechniqueCardProps) {
  const riskBadge = getRiskBadgeProps(technique.riskLevel)

  return (
    <Card
      id={id}
      className={cn(
        'bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5',
        'scroll-mt-20',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>
            <h3 className="text-lg font-semibold">{technique.name}</h3>
          </CardTitle>
          <Badge
            variant={riskBadge.variant}
            className={cn('shrink-0', riskBadge.className)}
            aria-label={`Risk level: ${technique.riskLevel}`}
          >
            {technique.riskLevel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{technique.description}</p>

        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Example Prompt
          </h4>
          <pre
            className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed"
            aria-label={`Example prompt for ${technique.name}`}
          >
            {technique.example}
          </pre>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mitigated Example
          </h4>
          <pre
            className="whitespace-pre-wrap rounded-md bg-emerald-500/10 p-3 text-xs leading-relaxed"
            aria-label={`Mitigated example prompt for ${technique.name}`}
          >
            {technique.mitigatedExample}
          </pre>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold">Primary Hallucination Risk Vulnerability:</span>
          <span>{technique.primaryVulnerability}</span>
        </div>
      </CardContent>
    </Card>
  )
}
