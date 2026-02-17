'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PromptRewriteArea } from '@/components/prompt-rewrite-area'
import { cn } from '@/lib/utils'
import type { Scenario, Technique } from '@/lib/workshop-data'

interface ScenarioCardProps {
  scenario: Scenario
  techniques: Technique[]
  onComplete: (correctOnFirstAttempt: boolean) => void
  onViewTechnique?: (techniqueId: string) => void
}

/**
 * Deterministic shuffle using scenario id as seed.
 * Produces a consistent order for the same scenario so options
 * don't jump around on re-render.
 */
function shuffleWithSeed(ids: string[], seed: string): string[] {
  const arr = [...ids]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0
    const j = ((hash >>> 0) % (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Renders a single workshop scenario with technique option buttons,
 * feedback on correct/incorrect selections, and an optional prompt
 * rewrite area after the correct answer is found.
 */
export function ScenarioCard({
  scenario,
  techniques,
  onComplete,
  onViewTechnique,
}: ScenarioCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [firstAttempt, setFirstAttempt] = useState(true)
  const [answered, setAnswered] = useState(false)

  const optionIds = useMemo(() => {
    const allIds = [scenario.correctTechniqueId, ...scenario.distractorTechniqueIds]
    return shuffleWithSeed(allIds, scenario.id)
  }, [scenario.correctTechniqueId, scenario.distractorTechniqueIds, scenario.id])

  const techniqueMap = useMemo(() => {
    const map = new Map<string, Technique>()
    for (const t of techniques) {
      map.set(t.id, t)
    }
    return map
  }, [techniques])

  const correctTechnique = techniqueMap.get(scenario.correctTechniqueId)

  function handleSelect(techniqueId: string) {
    if (answered) return

    setSelectedId(techniqueId)
    const correct = techniqueId === scenario.correctTechniqueId
    setIsCorrect(correct)

    if (correct) {
      setAnswered(true)
      onComplete(firstAttempt)
    } else {
      setFirstAttempt(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5">
      <CardHeader>
        <CardTitle>
          <h3 className="text-lg font-semibold">Scenario</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {scenario.description}
        </p>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Which technique is being used?
          </h4>
          <div
            className="grid gap-2 sm:grid-cols-2"
            role="group"
            aria-label="Technique options"
          >
            {optionIds.map((id) => {
              const technique = techniqueMap.get(id)
              if (!technique) return null

              const isSelected = selectedId === id
              const wasIncorrect = isSelected && isCorrect === false
              const wasCorrect = isSelected && isCorrect === true

              return (
                <Button
                  key={id}
                  variant="outline"
                  size="lg"
                  className={cn(
                    'h-auto min-h-10 whitespace-normal px-4 py-2.5 text-left',
                    wasCorrect &&
                      'border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-400',
                    wasIncorrect &&
                      'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:text-red-400',
                    answered &&
                      id === scenario.correctTechniqueId &&
                      !isSelected &&
                      'border-emerald-500/30 bg-emerald-500/5'
                  )}
                  onClick={() => handleSelect(id)}
                  disabled={answered}
                  aria-label={`Select technique: ${technique.name}`}
                  aria-pressed={isSelected}
                >
                  {technique.name}
                </Button>
              )
            })}
          </div>
        </div>

        {isCorrect === true && (
          <div
            className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-emerald-400">
                ✓ Correct!
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {scenario.feedback}
            </p>
            {correctTechnique && (
              <button
                type="button"
                onClick={() => onViewTechnique?.(scenario.correctTechniqueId)}
                className="inline-block text-sm font-medium text-[#818CF8] underline underline-offset-4 hover:text-[#A78BFA]"
                aria-label={`View ${correctTechnique.name} technique card`}
              >
                View {correctTechnique.name} →
              </button>
            )}
          </div>
        )}

        {isCorrect === false && selectedId && (
          <div
            className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm font-semibold text-red-400">
              ✗ Not quite
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {scenario.incorrectHints[selectedId] ??
                'That\'s not the best fit. Try another technique.'}
            </p>
          </div>
        )}

        {answered && scenario.promptRewrite && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bonus: Prompt Rewrite Exercise
            </h4>
            <PromptRewriteArea
              originalPrompt={scenario.promptRewrite.originalPrompt}
              sampleImprovedPrompt={scenario.promptRewrite.sampleImprovedPrompt}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
