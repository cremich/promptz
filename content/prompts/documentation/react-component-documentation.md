---
authors:
  - cremich
categories:
  - documentation
description:
  Analyzes a React-based application and generates documentation visualizing
  the component hierarchy, component relationships, and key component metadata.
draft: false
howToUse:
  Open your terminal and change directory to the root folder of your repository.
  Then start Q Developer with `q chat` and paste the prompt. You can apply additional
  documentation rules based on your requirements or guidelines.
images: []
tags:
  - CLI
  - Chat
  - Documentation
title: React Component Documentation
createdAt: 2025-03-10T07:59:58.594Z
updatedAt: 2025-03-10T07:59:58.594Z
aliases: ["/prompts/prompt/react-component-documentation-e23f7432"]
---

Analyze the application and generate documentation visualizing the component hierarchy, component relationships, and key component metadata.

Application Context:
This is a Next.js 15 application using React 19 with tailwind CSS and shadcn components. The application structure follows an app router with server components architecture. Components are stored inside the ./app folder. React components have the .tsx filename extension.

Documentation Requirements:

1. General:

- Add the documentation as markdown files in the ./docs folder.
- Analyze in iterations folder by folder.
- You must read every react component within a folder to understand the component structure.
- Update the existing documentation in each iteration based on your analysis results.
- Ignore files that are not react components.

2. Component Hierarchy Visualization
   Create a mermaid flowchart diagram that shows:

- Parent-child relationships between components
- Logical grouping by feature using subgraphs
- Clear distinction between page components and UI components
- Use color coding in the mermaid diagram to distinguish:
  - Server vs Client components
  - Ensure high contrast in the color coding to ensure that the text is readable
- Include a legend explaining the visualization conventions
