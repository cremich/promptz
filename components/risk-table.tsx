import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TECHNIQUES, type Technique } from '@/lib/workshop-data'

/**
 * Maps risk level to Badge variant and custom styling.
 * Matches the color mapping used in TechniqueCard.
 */
function getRiskBadgeProps(riskLevel: Technique['riskLevel']): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className: string
} {
  switch (riskLevel) {
    case 'High':
      return { variant: 'destructive', className: '' }
    case 'Medium-High':
      return { variant: 'destructive', className: 'bg-orange-600 dark:bg-orange-500' }
    case 'Medium':
      return { variant: 'secondary', className: '' }
    case 'Low-Medium':
      return { variant: 'outline', className: '' }
    case 'Low':
      return { variant: 'default', className: '' }
  }
}

export function RiskTable() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Hallucination Risk Summary</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Technique</th>
              <th className="px-4 py-3 text-left font-semibold">Risk Level</th>
              <th className="px-4 py-3 text-left font-semibold">Primary Vulnerability</th>
            </tr>
          </thead>
          <tbody>
            {TECHNIQUES.map(function (technique) {
              const badge = getRiskBadgeProps(technique.riskLevel)
              return (
                <tr
                  key={technique.id}
                  className="border-b last:border-b-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {technique.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={badge.variant}
                      className={cn('shrink-0', badge.className)}
                    >
                      {technique.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {technique.primaryVulnerability}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
