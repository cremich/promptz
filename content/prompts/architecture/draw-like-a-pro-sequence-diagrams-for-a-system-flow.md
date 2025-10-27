---
authors:
  - Vinay Nadig
categories:
  - architecture
description: Better prompts for drawing sequence diagram
draft: false
howToUse:
  Copy the prompt and replace <ENTER YOUR FLOW> with the desired system flow
  that you would like to capture in the sequence diagram
images: []
title: "Draw like a Pro : Sequence Diagrams for a system flow"
aliases:
  [
    "/prompts/prompt/draw-like-a-pro-sequence-diagrams-for-a-system-flow-33ece251",
  ]
tags:
  ["sequence-diagrams", "mermaid", "system-flow", "architecture", "diagrams"]
createdAt: "2025-03-06T17:42:11.632Z"
updatedAt: "2025-03-06T17:42:11.632Z"
---

@workspace Analyze the code in the workspace and create a mermaid sequence diagram that illustrates the <ENTER YOUR FLOW> with these specifications:

Layout and Structure:
Arrange participants (actors/systems) horizontally from left to right based on their order of interaction
Position the initiating actor/system on the far left
Group related systems next to each other
Maintain consistent spacing between lifelines

Participant Styling:
Use distinct colors for different types of participants:
User/External Actors: Light Orange (#FFE4B5)
API/Controllers: Light Blue (#ADD8E6)
Services: Light Green (#90EE90)
Databases: Light Yellow (#FFFFE0)
External Services: Light Purple (#E6E6FA)
Use clear, descriptive names for participants
Add stereotypes to indicate participant types (<<API>>, <<Service>>, etc.)

Message Representation:
Use appropriate arrow types:
Solid arrows (→) for synchronous calls
Dotted arrows (-->) for asynchronous calls
Open arrows (->) for responses
Bold arrows (=>) for critical path operations
Keep messages short but descriptive
Include important parameters in message labels
Show return values where significant

Flow Organization:
Break long sequences into logical segments using dividers
Use activation boxes to show processing time
Include alt/opt/loop fragments for conditional flows
Show parallel processing using par fragments
Highlight error paths using alt fragments

Documentation and Clarity:
Add notes for complex logic or important conditions
Include timing information where relevant
Show retry/timeout mechanisms
Document error handling paths
Add sequence numbers for key steps

Optimization:
Focus on main success scenario first
Show alternative paths separately if too complex
Limit diagram to one main business transaction
Collapse repetitive sequences into loop fragments
Hide unnecessary technical details

Additional Details:
Include HTTP methods for API calls
Show important status codes/responses
Indicate async/await patterns clearly
Mark critical validation points
Show transaction boundaries
Please generate a sequence diagram that captures the main flow while maintaining readability and providing sufficient detail for understanding the interaction pattern
