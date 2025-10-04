---
title: "Setup Workspace Rules"
description: "Amazon Q Developer operates more quickly, more accurately, and consistently when properly configured with information it can load quickly. This prompt instructs Q to learn from your project and create context-efficient files that give Q just what it needs, with references to load-on-demand details based on the interaction."
author: "unknown"
tags:
  [
    "IDE",
    "CLI",
    "Optimize",
    "Documentation",
    "Implement",
    "Test",
    "Operate",
    "Plan",
    "Enhance",
    "Requirements",
    "Design",
    "Chat",
    "Test Agent",
    "Doc Agent",
  ]
---

# Setup Workspace Rules

# Amazon Q Workspace Setup

Help me optimize my development workflow by setting up Amazon Q Developer for this project. I need to create a comprehensive configuration that enables Amazon Q to understand my project's structure, standards, and requirements.

## Configuration Tasks

1. Create an `AmazonQ.md` file at the project root that provides:
   - Project overview and architecture
   - Primary development workflows
   - Key technologies and frameworks
   - Coding standards and conventions

2. Set up `.amazonq/rules/project/*.md` files for specific guidance on:
   - Code implementation patterns
   - Testing strategies and test generation
   - Documentation requirements
   - Library/framework usage
   - Code review standards
   - Common development scenarios
   - Architectural decisions
   - Integration patters
   - Troubleshooting guides

3. Create a `.amazonq/rule-details/project/` directory which will contain the more detailed content for rules, referenced from .amazonq/rules/project/\*.md files

4. In scenarios where rule details are extensive, to save context space, save details of the rule in `.amazonq/rule-details/project/` and reference conditionally from rules. For example:

   Sample rule: `.amazonq/rules/project/python_comments.md`

   ```markdown
   # Python Code Documentation Guide

   When generating comments for python functions and modules, follow the detailed instructions in `.amazonq/rule-details/project/python_documentation_guidelines.md`
   ```

   Sample rule-detail file: `.amazonq/rule-details/project/python_documentation_guidelines.md`

   ```markdown
   # Python Code Documentation Standards

   [detailed description of documentation standards]
   ```

## Implementation Approach

Please implement this configuration in stages:

1. First, analyze the project structure to understand its scope and complexity
2. Create the core configuration files with essential guidance
3. Progressively enhance the configuration as you discover more about the codebase
4. Ensure all documentation cross-references related files appropriately

If the project is large, focus on the most critical aspects first and provide a strategy for incrementally improving the configuration over time.

> Note: If the AmazonQ.md file already exists, update it appropriately without losing critical information from the original version. Take an approach that will maximize the efficient use of context for very large projects.

Finally, create a new rule called .amazonq/rules/learn.md in which you instruct Amazon Q Developer to prompt the user if they want to update rules when Amazon Q Developer is corrected by the user. For instance, if Q generated an incorrect directory structure, or if Q generated code that the user indicated was incorrect and provided new direction, ask if you should update the corresponding rule(s).

## How to Use

Simply run the prompt from the IDE or CLI chat. If you will use with multiple projects, save as a Saved Prompt.
