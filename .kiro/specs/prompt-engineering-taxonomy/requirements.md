# Requirements Document

## Introduction

Create an interactive Prompt Engineering Workshop page at `/workshop` on Promptz.dev that combines the full taxonomy reference content (15 techniques, hallucination risks, mitigation strategies) with hands-on exercises where users practice identifying and applying prompt engineering techniques. The page is a single client-side TSX route with optional localStorage persistence for progress. It follows existing project conventions (flat components, Shadcn UI, Tailwind CSS 4, dark mode first).

## Glossary

- **Workshop_Page**: A client-side interactive page at `/workshop` that combines taxonomy reference content with scenario-based exercises for practicing prompt engineering techniques.
- **Technique**: One of the 15 prompt engineering categories defined in the taxonomy (e.g., Zero-Shot, Chain-of-Thought, ReAct). Each has a description, example prompt, hallucination risk rating, mitigated example prompt, and primary vulnerability.
- **Technique_Card**: A browsable UI element displaying a single Technique's full reference content including description, example, risk profile, and mitigated example.
- **Scenario**: A workshop exercise presenting a situation where the user must identify the appropriate prompt engineering Technique.
- **Exercise_Data**: A static TypeScript file containing all workshop Scenarios, correct answers, distractor options, and explanatory feedback.
- **Progress_State**: Client-side state tracking which Scenarios a user has completed and whether each was answered correctly on the first attempt. Optionally persisted to localStorage.
- **Navigation_Component**: The site-wide sticky header component (`components/navigation.tsx`) containing nav links and search.
- **Sitemap_Generator**: The dynamic sitemap generation function at `app/sitemap.ts`.

## Requirements

### Requirement 1: Taxonomy Reference Content

**User Story:** As a developer, I want to browse all 15 prompt engineering techniques with their descriptions, examples, and risk profiles on the workshop page, so that I can learn about each technique before practicing.

#### Acceptance Criteria

1. WHEN a user navigates to `/workshop`, THE Workshop_Page SHALL render a reference section displaying all 15 Techniques as browsable Technique_Cards.
2. WHEN a Technique_Card is displayed, THE Workshop_Page SHALL show the Technique name, description, example prompt, hallucination risk rating, and mitigated example prompt.
3. THE Workshop_Page SHALL render the hallucination risk summary table listing all 15 Techniques with their risk level and primary vulnerability.
4. THE Workshop_Page SHALL render the universal mitigation strategies section with all 7 strategies.
5. THE Workshop_Page SHALL render the cross-provider consensus section with all 5 principles.

### Requirement 2: Workshop Exercise Data

**User Story:** As a developer, I want the workshop to present realistic prompt engineering scenarios, so that I can practice identifying and applying the right techniques.

#### Acceptance Criteria

1. THE Exercise_Data SHALL contain a minimum of 10 Scenarios covering a variety of the 15 prompt engineering Techniques.
2. WHEN a Scenario is defined, THE Exercise_Data SHALL include a scenario description, the correct Technique answer, at least 3 distractor Technique options, and an explanatory feedback message.
3. THE Exercise_Data SHALL include a reference to the corresponding Technique for each Scenario's correct answer, enabling navigation to the Technique_Card.
4. WHEN a Scenario includes a prompt rewrite sub-exercise, THE Exercise_Data SHALL include a sample improved prompt for comparison.

### Requirement 3: Workshop Scenario Interaction

**User Story:** As a developer, I want to work through workshop scenarios by selecting techniques and optionally rewriting prompts, so that I can test my understanding of prompt engineering.

#### Acceptance Criteria

1. WHEN a user enters the exercise section of the Workshop_Page, THE Workshop_Page SHALL display the current Scenario description and a set of Technique options to choose from.
2. WHEN a user selects a Technique option, THE Workshop_Page SHALL indicate whether the selection is correct or incorrect.
3. WHEN a user selects the correct Technique, THE Workshop_Page SHALL display the explanatory feedback message and a link to the corresponding Technique_Card in the reference section.
4. WHEN a user selects an incorrect Technique, THE Workshop_Page SHALL display a hint explaining why the selected Technique is not the best fit, without revealing the correct answer.
5. WHEN a Scenario includes a prompt rewrite sub-exercise, THE Workshop_Page SHALL display a text area for the user to write an improved prompt and a button to reveal the sample improved prompt for comparison.
6. WHEN a user completes a Scenario, THE Workshop_Page SHALL provide a control to advance to the next Scenario.

### Requirement 4: Workshop Progress Tracking

**User Story:** As a developer, I want my workshop progress to be saved locally, so that I can return later and continue where I left off.

#### Acceptance Criteria

1. WHEN a user completes a Scenario, THE Workshop_Page SHALL update the Progress_State to record the completed Scenario identifier and whether the user answered correctly on the first attempt.
2. THE Workshop_Page SHALL display a progress indicator showing the number of completed Scenarios out of the total.
3. WHEN a user returns to `/workshop`, THE Workshop_Page SHALL restore the Progress_State from localStorage and resume from the first incomplete Scenario.
4. THE Workshop_Page SHALL provide a control to reset all progress and start the workshop from the beginning.
5. IF localStorage is unavailable, THEN THE Workshop_Page SHALL operate in a stateless mode where progress is maintained only for the current session using component state.

### Requirement 5: Workshop Results Summary

**User Story:** As a developer, I want to see a summary of my workshop performance after completing all scenarios, so that I can understand my strengths and areas for improvement.

#### Acceptance Criteria

1. WHEN a user completes all Scenarios, THE Workshop_Page SHALL display a results summary showing the total score as correct first attempts out of total Scenarios.
2. THE Workshop_Page SHALL display a per-Technique breakdown indicating which Techniques the user identified correctly and which were missed.
3. THE Workshop_Page SHALL provide a link to the Technique_Card for each Technique the user missed, enabling targeted review.
4. THE Workshop_Page SHALL provide a control to restart the workshop from the results summary.

### Requirement 6: Page Navigation and Discoverability

**User Story:** As a developer, I want to find the workshop page through site navigation and search engines, so that I can access it easily.

#### Acceptance Criteria

1. WHEN the site navigation renders, THE Navigation_Component SHALL include a link to the `/workshop` page accessible from the navigation menu.
2. WHEN the sitemap is generated, THE Sitemap_Generator SHALL include an entry for `/workshop` with weekly change frequency and appropriate priority.

### Requirement 7: Responsive Layout and Accessibility

**User Story:** As a developer, I want the workshop page to be usable on any device and accessible via keyboard, so that I can use it in any context.

#### Acceptance Criteria

1. THE Workshop_Page SHALL render correctly on viewport widths from 320px to 1920px using responsive Tailwind CSS classes.
2. THE Workshop_Page SHALL support full keyboard navigation, including selecting Technique options and advancing between Scenarios using Tab, Enter, and arrow keys.
3. THE Workshop_Page SHALL use appropriate ARIA labels on interactive elements including Technique option buttons, the prompt rewrite text area, and navigation controls.
4. THE Workshop_Page SHALL use semantic HTML heading hierarchy (h1, h2, h3) for page structure and section headings.
