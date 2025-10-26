---
title: "Project Intelligence"
aliases: ["/rules/rule/project-intelligence-dbd52e23"]
createdAt: 2025-05-27T20:48:55.815Z
updatedAt: 2025-08-22T10:28:34.699Z
description: >-
  The project intelligence documentation system transforms Amazon Q Developer from a stateless assistant into a persistent development partner by providing comprehensive context about your application across various sessions. Once the rule was added to your repository, you can ask Q Developer to initialize the project intelligence with "Initialize Project Intelligence". If already in place, you can force an update by asking Q "Update Project Intelligence".
draft: false
images: []
authors: ["cremich"]
categories:
  - general
tags: ["IDE", "CLI", "Documentation"]
---

# Amazon Q Developer Project Intelligence

## Guidelines

- Before writing the documentation, ask all relevant questions to understand the context of this codebase.
- The documentation must be specific with a focus on simplicity and clearance.
- Write documentation in prose.
- Prevent repetitions and ambiguity in the documentation.

## Project Intelligence Structure

The Project intelligence consists of required core files and optional context files, all in Markdown format. It is located in `./.amazonq/project-intelligence` folder.
Files build upon each other in a clear hierarchy:

```mermaid
flowchart TD
    PI[Project Intelligence] --> PC[project.md]
    PI --> SP[architecture.md]
    PI --> TC[tech.md]
```

### Required Core Files

1. `project.md`
   - Source of truth for project and business scope. Explains the product vision, features, core requirements, goals and target users.
   - Outlines customer problems being solved and how the product helps to solve the problems of the users.
   - Visualize user journeys using the user journey mermaid syntax.
   - Describes current state of development based on open issues, and the product backlog.

2. `architecture.md`
   - Source of truth for software architecture and software design.
   - Describes system architecture and design patterns.
   - Documents key architecture decisions.
   - Visualize the software architecture using the architecture mermaid syntax.
   - Describes data models, database schemas and APIs.
   - Visualize data models using the entity-relationship-diagram mermaid syntax.
   - Use sequence diagrams in mermaid syntax to visualize processes and interactions between components.

3. `tech.md`
   - Explains the project's directory structure and code organization.
   - Documents the tech stack, technologies, and development tools used.
   - Includes listing of packages and dependencies.

### Additional Context

Create additional files/folders within `./.amazonq/project-intelligence` when they help organize:

- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies
- Deployment procedures
