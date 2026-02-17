'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScenarioCard } from '@/components/scenario-card'
import { ProgressIndicator } from '@/components/progress-indicator'
import type { Scenario, Technique } from '@/lib/workshop-data'
import type { ScenarioResult } from '@/lib/workshop-progress'

interface WorkshopExerciseProps {
  scenarios: Scenario[]
  techniques: Technique[]
  completedScenarios: ScenarioResult[]
  currentScenarioIndex: number
  onProgress: (result: ScenarioResult, nextIndex: number) => void
  onComplete: () => void
  onViewTechnique?: (techniqueId: string) => void
}

/**
 * Manages the exercise flow: displays the current scenario, tracks
 * completion, and provides navigation between scenarios. Composes
 * ScenarioCard and ProgressIndicator.
 */
export function WorkshopExercise({
  scenarios,
  techniques,
  completedScenarios,
  currentScenarioIndex,
  onProgress,
  onComplete,
  onViewTechnique,
}: WorkshopExerciseProps) {
  const [scenarioAnswered, setScenarioAnswered] = useState(false)
  const [lastResult, setLastResult] = useState<ScenarioResult | null>(null)

  const totalScenarios = scenarios.length
  const completedCount = completedScenarios.length
  const currentScenario = scenarios[currentScenarioIndex]
  const isLastScenario = currentScenarioIndex >= totalScenarios - 1

  const handleScenarioComplete = useCallback(
    (correctOnFirstAttempt: boolean) => {
      if (!currentScenario) return

      const result: ScenarioResult = {
        scenarioId: currentScenario.id,
        correctOnFirstAttempt,
      }

      setLastResult(result)
      setScenarioAnswered(true)
    },
    [currentScenario]
  )

  const handleNext = useCallback(() => {
    if (!lastResult) return

    if (isLastScenario) {
      onProgress(lastResult, currentScenarioIndex)
      onComplete()
    } else {
      const nextIndex = currentScenarioIndex + 1
      onProgress(lastResult, nextIndex)
      setScenarioAnswered(false)
      setLastResult(null)
    }
  }, [lastResult, isLastScenario, currentScenarioIndex, onProgress, onComplete])

  if (!currentScenario) {
    return null
  }

  return (
    <div className="space-y-6">
      <ProgressIndicator completed={completedCount} total={totalScenarios} />

      <ScenarioCard
        key={currentScenario.id}
        scenario={currentScenario}
        techniques={techniques}
        onComplete={handleScenarioComplete}
        onViewTechnique={onViewTechnique}
      />

      {scenarioAnswered && (
        <div className="flex justify-end">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:from-[#4338CA] hover:to-[#6D28D9]"
            onClick={handleNext}
            aria-label={
              isLastScenario ? 'Finish workshop' : 'Go to next scenario'
            }
          >
            {isLastScenario ? 'Finish Workshop' : 'Next Scenario →'}
          </Button>
        </div>
      )}
    </div>
  )
}
