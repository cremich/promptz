'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { TechniqueCard } from '@/components/technique-card'
import { Badge } from '@/components/ui/badge'
import {
  TECHNIQUES,
  MITIGATION_STRATEGIES,
} from '@/lib/workshop-data'
import { Shield, PenTool, Wrench, Server } from 'lucide-react'

interface TaxonomyReferenceProps {
  idPrefix?: string
  expandedTechniqueId?: string | null
}

export function TaxonomyReference({ idPrefix = 'technique-', expandedTechniqueId }: TaxonomyReferenceProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [dismissedExternalId, setDismissedExternalId] = useState<string | null>(null)

  const shouldInjectExternal =
    expandedTechniqueId &&
    expandedTechniqueId !== dismissedExternalId &&
    !openItems.includes(expandedTechniqueId)

  const effectiveOpenItems = shouldInjectExternal
    ? [...openItems, expandedTechniqueId]
    : openItems

  function handleValueChange(value: string[]) {
    if (expandedTechniqueId && !value.includes(expandedTechniqueId) && effectiveOpenItems.includes(expandedTechniqueId)) {
      setDismissedExternalId(expandedTechniqueId)
    }
    setOpenItems(value)
  }

  return (
    <div className="space-y-12">
      {/* Defense in Depth Section */}
      <section aria-labelledby="defense-heading">
        <h2
          id="defense-heading"
          className="mb-3 text-2xl font-bold tracking-tight"
        >
          Hallucination Defense in Depth
        </h2>
        <p className="mb-6 text-base text-muted-foreground">
          Effective hallucination mitigation works across three complementary
          layers. Each catches what the others miss.
        </p>
        <p className="mb-6 rounded-md border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-cyan-400">Remember:</span>{' '}
          Hallucination is a fundamental property of how language models work,
          not a bug to patch. These layers reduce it significantly but cannot
          eliminate it entirely. All major AI providers agree on this.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-3 rounded-lg border bg-gradient-to-br from-[#4F46E5]/20 to-[#4F46E5]/5 p-5">
            <div className="flex items-center gap-2">
              <PenTool className="size-5 text-indigo-400" aria-hidden="true" />
              <h3 className="text-sm font-bold">Prompt-Level</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pre-generation strategies you write into your prompts to shape
              what the model produces. You control these directly.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Encourage abstention</li>
              <li>• Ground in sources</li>
              <li>• Constrain output</li>
              <li>• Verification loops</li>
            </ul>
          </div>
          <div className="space-y-3 rounded-lg border bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/5 p-5">
            <div className="flex items-center gap-2">
              <Wrench className="size-5 text-violet-400" aria-hidden="true" />
              <h3 className="text-sm font-bold">Context-Level</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Tooling that enriches the model&apos;s context before generation.
              Reduces hallucination by giving the model better information.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Steering files</li>
              <li>• Specs &amp; design docs</li>
              <li>• MCP servers</li>
              <li>• RAG pipelines</li>
            </ul>
          </div>
          <div className="space-y-3 rounded-lg border bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 p-5">
            <div className="flex items-center gap-2">
              <Server className="size-5 text-cyan-400" aria-hidden="true" />
              <h3 className="text-sm font-bold">Infrastructure-Level</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Post-generation filters that evaluate output against source
              material and block or flag unsupported claims.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Bedrock Guardrails</li>
              <li>• Contextual grounding checks</li>
              <li>• Content filters</li>
              <li>• Human-in-the-loop review</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technique Cards Section */}
      <section aria-labelledby="techniques-heading">
        <h2
          id="techniques-heading"
          className="mb-6 text-2xl font-bold tracking-tight"
        >
          Prompt Engineering Techniques
        </h2>
        <p className="mb-6 text-base text-muted-foreground">
          Browse all 15 prompt engineering techniques. Expand each to see
          descriptions, example prompts, risk profiles, and mitigated examples.
        </p>
        <Accordion type="multiple" value={effectiveOpenItems} onValueChange={handleValueChange} className="space-y-4">
          {TECHNIQUES.map(function (technique) {
            return (
              <AccordionItem
                key={technique.id}
                value={technique.id}
                id={`${idPrefix}${technique.id}`}
                className="scroll-mt-20 rounded-lg border bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 px-4"
              >
                <AccordionTrigger className="text-base font-semibold hover:no-underline [&>svg]:size-6 [&>svg]:text-foreground">
                  <span className="flex items-center gap-3">
                    <span>{technique.name}</span>
                    <Badge
                      variant={getRiskVariant(technique.riskLevel)}
                      className={getRiskClassName(technique.riskLevel)}
                    >
                      {technique.riskLevel}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <TechniqueCard
                    technique={technique}
                    id={`${idPrefix}${technique.id}-card`}
                  />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </section>

      {/* Mitigation Strategies Section */}
      <section aria-labelledby="mitigation-heading">
        <h2
          id="mitigation-heading"
          className="mb-6 text-2xl font-bold tracking-tight"
        >
          Universal Mitigation Strategies
        </h2>
        <p className="mb-6 text-base text-muted-foreground">
          Seven strategies that reduce hallucination risk across all prompt
          engineering techniques. Expand each to see a concrete example.
        </p>
        <Accordion type="multiple" className="space-y-4">
          {MITIGATION_STRATEGIES.map(function (strategy, index) {
            return (
              <AccordionItem
                key={strategy.title}
                value={strategy.title}
                className="rounded-lg border bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 px-4"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline [&>svg]:size-6 [&>svg]:text-foreground">
                  <span className="flex items-center gap-3">
                    <Shield
                      className="size-5 shrink-0 text-indigo-400"
                      aria-hidden="true"
                    />
                    <span>{index + 1}. {strategy.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-muted-foreground">
                      {strategy.description}
                    </p>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Example Prompt
                      </h4>
                      <pre
                        className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed"
                        aria-label={`Example for ${strategy.title}`}
                      >
                        {strategy.example}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </section>

    </div>
  )
}

function getRiskVariant(
  riskLevel: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (riskLevel) {
    case 'High':
      return 'destructive'
    case 'Medium-High':
      return 'destructive'
    case 'Medium':
      return 'secondary'
    case 'Low-Medium':
      return 'outline'
    case 'Low':
      return 'default'
    default:
      return 'secondary'
  }
}

function getRiskClassName(riskLevel: string): string {
  if (riskLevel === 'Medium-High') {
    return 'bg-orange-600 dark:bg-orange-500'
  }
  return ''
}
