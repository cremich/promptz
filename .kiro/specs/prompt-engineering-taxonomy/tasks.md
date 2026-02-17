# Implementation Plan: Prompt Engineering Workshop

## Overview

Build the `/workshop` page with taxonomy reference content and interactive exercises. Implementation proceeds bottom-up: types and data first, then logic modules, then UI components, then page wiring and navigation integration.

## Tasks

- [x] 1. Define types and static data
  - [x] 1.1 Create `lib/workshop-data.ts` with Technique, Scenario, MitigationStrategy interfaces and all static data arrays
    - Define `Technique` interface with id, name, description, example, mitigatedExample, riskLevel, primaryVulnerability
    - Define `Scenario` interface with id, description, correctTechniqueId, distractorTechniqueIds, feedback, incorrectHints, optional promptRewrite
    - Define `MitigationStrategy` interface with title and description
    - Export `TECHNIQUES` array with all 15 techniques sourced from `docs/prompt-engineering-taxonomy-compact.md`
    - Export `SCENARIOS` array with minimum 10 scenarios covering a variety of techniques
    - Export `MITIGATION_STRATEGIES` array with all 7 strategies
    - Export `CROSS_PROVIDER_CONSENSUS` string array with all 5 principles
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

  - [ ]* 1.2 Write property test for exercise data structural integrity
    - **Property 2: Exercise data structural integrity**
    - For any Scenario in SCENARIOS: non-empty description, correctTechniqueId references valid Technique.id, at least 3 distractorTechniqueIds each referencing valid Technique.ids, non-empty feedback, and if promptRewrite exists it has non-empty originalPrompt and sampleImprovedPrompt
    - **Validates: Requirements 2.2, 2.3, 2.4**

  - [ ]* 1.3 Write unit tests for workshop data
    - TECHNIQUES array has exactly 15 entries
    - SCENARIOS array has at least 10 entries
    - MITIGATION_STRATEGIES array has exactly 7 entries
    - CROSS_PROVIDER_CONSENSUS array has exactly 5 entries
    - Each technique has all required fields populated
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.1_

- [x] 2. Implement progress tracking module
  - [x] 2.1 Create `lib/workshop-progress.ts` with ProgressState, ScenarioResult types and localStorage functions
    - Define `ScenarioResult` interface with scenarioId and correctOnFirstAttempt
    - Define `ProgressState` interface with completedScenarios array and currentScenarioIndex
    - Implement `isLocalStorageAvailable()` that safely checks localStorage access
    - Implement `loadProgress()` that parses stored JSON, validates shape, returns default empty state on failure
    - Implement `saveProgress(state)` that serializes to localStorage under key `promptz-workshop-progress`
    - Implement `resetProgress()` that removes the localStorage entry
    - Storage key: `promptz-workshop-progress`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.2 Write property test for progress state localStorage round-trip
    - **Property 7: Progress state localStorage round-trip**
    - For any valid ProgressState object, saveProgress then loadProgress produces an equivalent ProgressState
    - **Validates: Requirements 4.3**

  - [ ]* 2.3 Write property test for progress state records completions accurately
    - **Property 5: Progress state records completions accurately**
    - For any sequence of scenario completions, the resulting ProgressState contains exactly one ScenarioResult per completed scenario with correct scenarioId and correctOnFirstAttempt
    - **Validates: Requirements 4.1**

  - [ ]* 2.4 Write unit tests for workshop progress edge cases
    - loadProgress returns default state when localStorage is empty
    - loadProgress returns default state when stored JSON is corrupted
    - resetProgress clears stored data
    - isLocalStorageAvailable returns false when localStorage throws
    - _Requirements: 4.4, 4.5_

- [x] 3. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Build reference section components
  - [x] 4.1 Create `components/technique-card.tsx`
    - Renders technique name, description, example prompt, risk level badge (color-coded), mitigated example, and primary vulnerability
    - Uses Shadcn Card and Badge components
    - Accepts a `Technique` prop and an `id` prop for scroll-to anchoring
    - Responsive layout with proper heading hierarchy
    - _Requirements: 1.2, 7.1, 7.4_

  - [ ]* 4.2 Write property test for technique card rendering
    - **Property 1: Technique card renders all required fields**
    - For any valid Technique object, rendering TechniqueCard produces output containing name, description, example, risk rating, and mitigated example
    - **Validates: Requirements 1.2**

  - [x] 4.3 Create `components/risk-table.tsx`
    - Renders a table of all 15 techniques with name, risk level (color-coded badge), and primary vulnerability
    - Uses semantic HTML table elements
    - Responsive: horizontal scroll on small viewports
    - _Requirements: 1.3, 7.1_

  - [x] 4.4 Create `components/taxonomy-reference.tsx`
    - Composes TechniqueCard list, RiskTable, mitigation strategies section, and cross-provider consensus section
    - Uses Shadcn Accordion for collapsible technique details
    - Renders all 7 mitigation strategies and all 5 consensus principles
    - Accepts an `id` prefix for technique card anchoring
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 4.5 Write unit tests for reference components
    - RiskTable renders all 15 technique rows
    - TaxonomyReference renders mitigation strategies section with 7 items
    - TaxonomyReference renders cross-provider consensus section with 5 items
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 5. Build exercise and results components
  - [x] 5.1 Create `components/progress-indicator.tsx`
    - Displays completed count out of total with a visual progress bar
    - Uses Shadcn Progress or a simple styled div
    - _Requirements: 4.2_

  - [ ]* 5.2 Write property test for progress indicator accuracy
    - **Property 6: Progress indicator reflects completed count**
    - For any ProgressState with N completed out of T total, the indicator displays N and T accurately
    - **Validates: Requirements 4.2**

  - [x] 5.3 Create `components/prompt-rewrite-area.tsx`
    - Textarea for user's improved prompt with a reveal button for sample answer
    - Uses Shadcn Textarea and Button
    - ARIA label on textarea
    - _Requirements: 3.5, 7.3_

  - [x] 5.4 Create `components/scenario-card.tsx`
    - Renders scenario description, technique option buttons, feedback area, optional PromptRewriteArea
    - Handles correct/incorrect selection states with visual feedback
    - On correct: shows feedback message and link to technique card
    - On incorrect: shows hint without revealing correct answer
    - Keyboard navigable option buttons with ARIA labels
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.2, 7.3_

  - [ ]* 5.5 Write property test for incorrect hint safety
    - **Property 4: Incorrect answer hint does not reveal correct answer**
    - For any Scenario and any incorrect technique selection, the hint text does not contain the correct technique name
    - **Validates: Requirements 3.4**

  - [ ]* 5.6 Write property test for correct answer feedback
    - **Property 3: Correct answer feedback includes explanation and technique link**
    - For any Scenario, when the correct technique is selected, the feedback contains the scenario's feedback message and a reference to the corresponding technique
    - **Validates: Requirements 3.3**

  - [x] 5.7 Create `components/workshop-exercise.tsx`
    - Manages exercise flow: current scenario index, answer state, navigation between scenarios
    - Receives onComplete and onProgress callbacks from parent
    - Composes ScenarioCard and ProgressIndicator
    - Advance to next scenario control after completion
    - _Requirements: 3.1, 3.6, 4.1_

  - [x] 5.8 Create `components/workshop-results.tsx`
    - Total score display (correct first attempts / total)
    - Per-technique breakdown: correctly identified vs missed
    - Links to technique cards for missed techniques
    - Restart button
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 5.9 Write property test for results total score computation
    - **Property 8: Results total score computation**
    - For any set of ScenarioResult objects, the total score equals the count where correctOnFirstAttempt is true out of total entries
    - **Validates: Requirements 5.1**

  - [ ]* 5.10 Write property test for results per-technique breakdown accuracy
    - **Property 9: Results per-technique breakdown accuracy**
    - For any set of ScenarioResults mapped to Scenarios, techniques are correctly partitioned into "identified" and "missed" sets with no overlap
    - **Validates: Requirements 5.2**

- [x] 6. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Wire up the workshop page
  - [x] 7.1 Create `app/workshop/layout.tsx`
    - Layout with gradient background matching existing static pages (contribute, faq)
    - _Requirements: 7.1_

  - [x] 7.2 Create `app/workshop/page.tsx` server component with metadata
    - Export metadata (title, description, openGraph)
    - Render the client-side WorkshopPage component
    - _Requirements: 1.1_

  - [x] 7.3 Create `components/workshop-page.tsx` root client component
    - `'use client'` directive
    - Shadcn Tabs switching between "Reference" and "Practice" sections
    - Load progress from localStorage on mount (with fallback to in-memory state)
    - Orchestrate TaxonomyReference, WorkshopExercise, and WorkshopResults
    - Show WorkshopResults in place of exercise section when all scenarios complete
    - Reset progress handler
    - Semantic heading hierarchy (h1 for page title, h2 for sections)
    - _Requirements: 1.1, 3.1, 4.3, 4.4, 4.5, 5.4, 7.1, 7.2, 7.3, 7.4_

- [x] 8. Integrate with site navigation and sitemap
  - [x] 8.1 Add `/workshop` link to `components/navigation.tsx`
    - Add Workshop entry to the `navLinks` array
    - _Requirements: 6.1_

  - [x] 8.2 Add `/workshop` entry to `app/sitemap.ts`
    - Add static route with weekly changeFrequency and 0.7 priority
    - _Requirements: 6.2_

- [x] 9. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with minimum 100 iterations per property
- All components go in `components/` (flat structure per project convention)
- Data/logic modules go in `lib/` per project convention
- Tests go in `__tests__/unit/` mirroring source structure
