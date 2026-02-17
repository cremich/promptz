'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TaxonomyReference } from '@/components/taxonomy-reference'
import { WorkshopExercise } from '@/components/workshop-exercise'
import { WorkshopResults } from '@/components/workshop-results'
import { TECHNIQUES, SCENARIOS } from '@/lib/workshop-data'
import {
  loadProgress,
  saveProgress,
  resetProgress,
} from '@/lib/workshop-progress'
import type { ProgressState, ScenarioResult } from '@/lib/workshop-progress'
import { BookOpen, FlaskConical, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const TECHNIQUE_ID_PREFIX = 'technique-'

/**
 * Root client component for the Prompt Engineering Workshop page.
 * Manages tab navigation between Reference and Practice sections,
 * loads/saves progress from localStorage, and orchestrates child
 * components: TaxonomyReference, WorkshopExercise, and WorkshopResults.
 */
export function WorkshopPage() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [workshopComplete, setWorkshopComplete] = useState(false)
  const [activeTab, setActiveTab] = useState('reference')
  const [expandedTechniqueId, setExpandedTechniqueId] = useState<string | null>(null)

  function handleProgress(result: ScenarioResult, nextIndex: number) {
    setProgress(function updateProgress(prev) {
      const newState: ProgressState = {
        completedScenarios: [...prev.completedScenarios, result],
        currentScenarioIndex: nextIndex,
      }
      saveProgress(newState)
      return newState
    })
  }

  function handleComplete() {
    setWorkshopComplete(true)
  }

  function handleRestart() {
    resetProgress()
    setProgress({ completedScenarios: [], currentScenarioIndex: 0 })
    setWorkshopComplete(false)
  }

  function handleViewTechnique(techniqueId: string) {
    setExpandedTechniqueId(techniqueId)
    setActiveTab('reference')
    setTimeout(function scrollToTechnique() {
      const el = document.getElementById(`${TECHNIQUE_ID_PREFIX}${techniqueId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const showResults =
    workshopComplete ||
    progress.completedScenarios.length >= SCENARIOS.length

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Prompt Engineering Workshop
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Master 15 prompt engineering techniques through an interactive
          reference guide and hands-on exercises. Browse the taxonomy, study
          hallucination risks and mitigation strategies, then test your
          knowledge with realistic scenarios.
        </p>
      </header>

      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-16 rounded-xl border bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 p-1">
          <TabsTrigger
            value="reference"
            className="gap-2 rounded-lg px-6 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4F46E5] data-[state=active]:to-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Reference
          </TabsTrigger>
          <TabsTrigger
            value="practice"
            className="gap-2 rounded-lg px-6 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4F46E5] data-[state=active]:to-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <FlaskConical className="size-4" aria-hidden="true" />
            Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reference">
          <TaxonomyReference idPrefix={TECHNIQUE_ID_PREFIX} expandedTechniqueId={expandedTechniqueId} />
        </TabsContent>

        <TabsContent value="practice">
          {showResults ? (
            <WorkshopResults
              results={progress.completedScenarios}
              scenarios={SCENARIOS}
              techniques={TECHNIQUES}
              onRestart={handleRestart}
              onViewTechnique={handleViewTechnique}
            />
          ) : (
            <WorkshopExercise
              scenarios={SCENARIOS}
              techniques={TECHNIQUES}
              completedScenarios={progress.completedScenarios}
              currentScenarioIndex={progress.currentScenarioIndex}
              onProgress={handleProgress}
              onComplete={handleComplete}
              onViewTechnique={handleViewTechnique}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Sources link */}
      <footer className="pt-8">
        <Link
          href="/workshop/sources"
          className="group flex items-center gap-4 rounded-xl border border-border/40 bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 px-6 py-4 transition-all hover:border-[#818CF8]/40 hover:from-[#4F46E5]/20 hover:to-[#7C3AED]/20"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white shadow-sm">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-foreground">
              Sources and References
            </span>
            <p className="text-xs text-muted-foreground">
              36 academic papers, provider docs, and practitioner guides backing this taxonomy
            </p>
          </div>
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[#818CF8]"
            aria-hidden="true"
          />
        </Link>
      </footer>
    </div>
  )
}
