'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PromptRewriteAreaProps {
  originalPrompt: string
  sampleImprovedPrompt: string
}

/**
 * Textarea for the user to write an improved prompt, with a reveal button
 * to show the sample improved prompt for comparison.
 */
export function PromptRewriteArea({
  originalPrompt,
  sampleImprovedPrompt,
}: PromptRewriteAreaProps) {
  const [userPrompt, setUserPrompt] = useState('')
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Original Prompt
        </h4>
        <pre
          className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed"
          aria-label="Original prompt to improve"
        >
          {originalPrompt}
        </pre>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your Improved Prompt
        </h4>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Write your improved version of the prompt…"
          aria-label="Write your improved prompt"
          className="min-h-24"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setRevealed(true)}
        disabled={revealed}
        aria-label={revealed ? 'Sample answer revealed' : 'Reveal sample answer'}
      >
        {revealed ? 'Sample Answer Revealed' : 'Reveal Sample Answer'}
      </Button>

      {revealed && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sample Improved Prompt
          </h4>
          <pre
            className={cn(
              'whitespace-pre-wrap rounded-md p-3 text-xs leading-relaxed',
              'bg-emerald-500/10'
            )}
            aria-label="Sample improved prompt"
          >
            {sampleImprovedPrompt}
          </pre>
        </div>
      )}
    </div>
  )
}
