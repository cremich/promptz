---
authors:
  - walmsles
categories:
  - python
description:
  "Some rules defining strict ways of working, encouraging specifications
  to be completed, and a detailed development plan including AI prompts.

  The main components are enforcing a TDD approach where tests are written first and
  any test failures means we need to focus on the code (not change the tests)."
draft: false
images: []
tags:
  - Python
title: Python Programming Rules
featured: true
createdAt: 2025-05-21T14:16:44.197Z
updatedAt: 2025-05-21T14:35:52.229Z
aliases: ["/rules/rule/python-programming-rules-ea5dcae3"]
---

This file contains Python programming rules for clean coding and project maintenance.

## Important Rules

- uv will be the package manager of choice.
- use `uv add <package>` to add dependencies to the project.
- run the project using `uv run python <main-file.py>`
- we will use `ruff` for linting and code formatting
- We will use `pytest` for testing framework.
- We MUST always think about the tests we need before writing code.
- All tests must be written first and then the code.
- When tests fail - its because the code is invalid and the code must be fixed.
- We MUST Strictly follow a TEST first approach to coding otherwise we will get in a mess.

## Before Coding

- Our design and implementation planning is in the `plan` folder.
- Before starting any coding make sure we have a design.md file created with the project details. If you can't find it ask about what should go in it, you will need to understand the entire project so keep asking questions until the design is done.
- Once the design is done, create a development_approach.md. It must contain the phases of development.
- For each phase in the development_approach - create a detailed phaseN_tasks,md file. These must be all the tasks to be completed for each phase, and include an AI Prompt so AI can work on the project.
  As we progress through each phase and complete each task, the task header must be updated to include a completion marker `[Completed]`. That way, we know where we are and can carry on from where we left off.

## Ways of Working

- The plan folder has details of the project.
- design.md - is the overall design of what we are building
- development_approach.md - contains the breakdown and plan for building the game.
- phaseN_tasks.md - contains detailed tasks with prompts for AI to create the outcome.
- We must work through each task in phase1_tasks.md first and then sequentially through the other files, one at a time.
- When a task is complete, it will be marked up as a strike through - so update the file so we know where we are up to.
- We are NOT finished until our Definition of Done is complete

## Definition of Done

- We MUST have 100% code coverage with our testing.
- The code must be formatted using `ruff`
- The code must have no linting errors or warnings
- ALL our tests MUST pass with no errors or warnings
