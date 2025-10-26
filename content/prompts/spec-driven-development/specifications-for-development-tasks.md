---
authors:
  - cremich
categories:
  - spec-driven-development
description:
  Use Amazon Q Developer to assist you in creating a step-by-step specification
  for a feature idea.
draft: false
howToUse:
  "1. Setup your project intelligence using the project rule as described
  here: https://www.promptz.dev/rules/rule/project-intelligence-dbd52e23

  2. Open a new chat inside your IDE

  3. Copy-pase the prompt into your chat

  4. Answer all questions as detailed and specific as possible

  5. Review and update the generated specification

  6. Once finalized, ask Q to save the specification as markdown file. You can choose
  to add it as additional files in your existing documentation folder or in a separate
  specs folder. I recommend grouping the specs separated by feature (e.g. specs/featureA/spec.md,
  specs/featureB/spec.md)"
images: []
tags:
  - IDE
  - Chat
  - Design
  - Documentation
  - Requirements
  - Plan
title: Specifications for development tasks
createdAt: 2025-03-22T10:53:45.925Z
updatedAt: 2025-05-27T21:15:20.155Z
featured: true
aliases: ["/prompts/prompt/specifications-for-development-tasks-24b69aa8"]
---

You are acting as an experienced software engineer and technical writer. Your task is to assist me in creating a technical specification document for a feature idea. To complete the task, you must

- Read ALL files in the .amazonq/rules folder to understand the guidelines and standards associated with this project.
- Read ALL files in the project-intelligence folder to understand the project and the associated problem domain.
- Keep asking relevant questions until you have gathered all relevant information and requirements.
- Compile your findings into a comprehensive, developer-ready technical specification.

Your goal is to write a developer-ready technical specification I can hand off to a developer.

There are 11 essential parts the technical specification must contain. If a section is not applicable, keep the section in the specification and write why it is not applicable.

1. Summary: Brief overview of the feature, the user problem it solves, and the proposed solution in a few sentences. It must be written so that any stakeholder can quickly understand the feature’s purpose and value. Sets the context for the rest of the specification
2. Goals: What the feature wants to achieve (goals) and what is explicitly out of scope (non-goals).
3. User-Stories / Use Cases: User-centric descriptions of how the feature will be used, often in the format: “As a [user], I want [feature], so that [benefit]”. Ensures the feature is grounded in real user needs and scenarios.
4. Functional Requirements: A Detailed list of feature requirements, including expected behaviors, inputs, outputs, and edge cases. Details what the feature must do, including edge cases and error handling. Should be testable and unambiguous to guide development and QA.
5. Non-functional Requirements: Performance, security, privacy, accessibility, and other quality attributes relevant to the feature. Addresses how the feature should perform rather than what it should do.
6. Solution Design: Technical details of the implementation. Includes architecture diagrams, data flows, data models, APIs, UI/UX changes, and the rationale for design decisions. May reference relevant technical standards, protocols, or frameworks used. Focus on describing how the solution addresses the defined problems instead of showing implementation details. Use pseudocode instead of concrete implementations. Use mermaid syntax to visualize data flows as flow charts, data models as entity-relationship diagrams, or processes as sequence diagrams.
7. Dependencies and Constraints: Identifies any technical, business, or external dependencies and constraints that impact the feature. Dependencies can be other systems, teams, or features the implementation relies on. Constraints mean limitations such as legacy systems, regulatory requirements, or resource restrictions.
8. Risks and Mitigations: Document known risks, potential issues, and proposed mitigation strategies. Helps teams proactively address challenges and avoid project delays or failures.
9. Testing & Acceptance Criteria: Defines how the feature will be validated and what constitutes completion. Includes test plans, specific test cases, and clear acceptance criteria to ensure the feature meets requirements and is ready for release.
10. Impact Assessment: Briefly describe the impact on users, systems, and stakeholders, including cost/benefit where relevant. May include cost/benefit analysis, user experience implications, or effects on other features or services.
11. Open Questions: List of unresolved issues or decisions that need further input. Keeps track of what still needs clarification and prompts timely stakeholder engagement.
