import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Scenario, Technique } from '@/lib/workshop-data'
import type { ScenarioResult } from '@/lib/workshop-progress'

interface WorkshopResultsProps {
  results: ScenarioResult[]
  scenarios: Scenario[]
  techniques: Technique[]
  onRestart: () => void
  onViewTechnique?: (techniqueId: string) => void
}

/**
 * Computes the total score as the count of results where
 * correctOnFirstAttempt is true out of total results.
 */
function computeScore(results: ScenarioResult[]): {
  correct: number
  total: number
} {
  const correct = results.filter((r) => r.correctOnFirstAttempt).length
  return { correct, total: results.length }
}

/**
 * Partitions techniques into "identified correctly" and "missed" sets
 * based on scenario results. Maps each result to its scenario to find
 * the correctTechniqueId, then groups by first-attempt correctness.
 */
function partitionTechniques(
  results: ScenarioResult[],
  scenarios: Scenario[],
  techniques: Technique[]
): { identified: Technique[]; missed: Technique[] } {
  const scenarioMap = new Map<string, Scenario>()
  for (const s of scenarios) {
    scenarioMap.set(s.id, s)
  }

  const techniqueMap = new Map<string, Technique>()
  for (const t of techniques) {
    techniqueMap.set(t.id, t)
  }

  const identifiedIds = new Set<string>()
  const missedIds = new Set<string>()

  for (const result of results) {
    const scenario = scenarioMap.get(result.scenarioId)
    if (!scenario) continue

    const techniqueId = scenario.correctTechniqueId
    if (result.correctOnFirstAttempt) {
      identifiedIds.add(techniqueId)
    } else {
      missedIds.add(techniqueId)
    }
  }

  // A technique that was both identified and missed across different
  // scenarios should appear in both lists, but per the design the sets
  // should not overlap. If a technique appears in both, prioritise
  // "missed" so the user reviews it.
  for (const id of missedIds) {
    identifiedIds.delete(id)
  }

  const identified: Technique[] = []
  const missed: Technique[] = []

  for (const id of identifiedIds) {
    const technique = techniqueMap.get(id)
    if (technique) identified.push(technique)
  }

  for (const id of missedIds) {
    const technique = techniqueMap.get(id)
    if (technique) missed.push(technique)
  }

  return { identified, missed }
}

/**
 * Displays the workshop results summary after all scenarios are completed.
 * Shows total score, per-technique breakdown with correctly identified
 * and missed techniques, links to technique cards for missed ones,
 * and a restart button.
 */
export function WorkshopResults({
  results,
  scenarios,
  techniques,
  onRestart,
  onViewTechnique,
}: WorkshopResultsProps) {
  const { correct, total } = computeScore(results)
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  const { identified, missed } = partitionTechniques(results, scenarios, techniques)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10">
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl font-semibold">Workshop Results</h2>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Total score */}
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <span className="text-4xl font-bold text-foreground">
              {correct} / {total}
            </span>
            <span className="text-sm text-muted-foreground">
              correct on first attempt ({percentage}%)
            </span>
          </div>

          {/* Per-technique breakdown */}
          <div className="space-y-4">
            {/* Correctly identified */}
            {identified.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-emerald-400">
                  ✓ Correctly Identified
                </h3>
                <div className="flex flex-wrap gap-2">
                  {identified.map((technique) => (
                    <Badge
                      key={technique.id}
                      variant="outline"
                      className={cn(
                        'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      )}
                    >
                      {technique.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missed techniques */}
            {missed.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-red-400">
                  ✗ Needs Review
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missed.map((technique) => (
                    <button
                      type="button"
                      key={technique.id}
                      onClick={() => onViewTechnique?.(technique.id)}
                      className={cn(
                        'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium',
                        'border-red-500/30 bg-red-500/10 text-red-400',
                        'underline underline-offset-4 transition-colors',
                        'hover:bg-red-500/20 hover:text-red-300'
                      )}
                      aria-label={`Review ${technique.name} technique card`}
                    >
                      {technique.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Perfect score message */}
            {missed.length === 0 && total > 0 && (
              <p className="text-sm text-emerald-400">
                🎉 Perfect score! You identified every technique correctly on the
                first attempt.
              </p>
            )}
          </div>

          {/* Restart button */}
          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:from-[#4338CA] hover:to-[#6D28D9]"
              onClick={onRestart}
              aria-label="Restart workshop"
            >
              Restart Workshop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
