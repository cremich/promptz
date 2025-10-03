# Development Workflow

This project is managed and built with npm.

The user will provide you with severel software engineering tasks to develop and maintain this application. Strictly follow these steps:

1. Read user input carefully and to the letter.
2. In case the user input is unclear, or ambiguous ask relevant questions.
3. Plan out your task. Then decide: What tools to use? What sources to look for? How to evaluate the task was successful?
4. Describe your process, including what tools you plan to use, what sources you look for, and how you evaluate your task.
5. Wait for confirmation by the user to proceed.
6. Execute.
7. Summarize your work in a final report.

## Development Workflow Commands

`npm i`: Add a dependency to the project
`npm uninstall`: Remove a dependency from the project.
`npm run build`: Build the project into distribution archives.
`npm run lint`: Linting
`npm run test`: Run unit and integration tests
`npm run e2e`: Run playwright end-to-end tests

Use the `gh` CLI to interact with GitHub.

## MEMORY:

You have access to the project documentation in `.amazonq/project-intelligence`. Use this to retrieve information about the project, the techstack and architecture. The project-intelligence is your long-term memory.

## Core Philosophy

**TEST-DRIVEN DEVELOPMENT IS NON-NEGOTIABLE.** Every single line of production code must be written in response to a failing test. No exceptions. This is not a suggestion or a preference - it is the fundamental practice that enables all other principles in this document. Follow the TDD Red-Green-Refactor phases strictly:

1. **Red**: Write a failing test for the desired behavior. NO PRODUCTION CODE until you have a failing test.
2. **Green**: Write the MINIMUM code to make the test pass. Resist the urge to write more than needed.
3. **Refactor**: Assess the code for improvement opportunities. If refactoring would add value, clean up the code while keeping tests green. If the code is already clean and expressive, move on.

**Common TDD Violations to Avoid:**

- Writing production code without a failing test first
- Writing multiple tests before making the first one pass
- Writing more production code than needed to pass the current test
- Skipping the refactor assessment step when code could be improved
- Adding functionality "while you're there" without a test driving it

**Remember**: If you're typing production code and there isn't a failing test demanding that code, you're not doing TDD.

All work must be done in small, incremental changes that maintain a working state throughout development.

## Refactoring

Evaluating refactoring opportunities is not optional - it's the third step in the TDD cycle. After achieving a green state and committing your work, you MUST assess whether the code can be improved. However, only refactor if there's clear value - if the code is already clean and expresses intent well, move on to the next test.

### What is Refactoring?

Refactoring means changing the internal structure of code without changing its external behavior. The public API remains unchanged, all tests continue to pass, but the code becomes cleaner, more maintainable, or more efficient. Remember: only refactor when it genuinely improves the code - not all code needs refactoring.

### When to Refactor

- **Always assess after green**: Once tests pass, before moving to the next test, evaluate if refactoring would add value
- **When you see duplication**: But understand what duplication really means (see DRY below)
- **When names could be clearer**: Variable names, function names, or class names that don't clearly express intent
- **When structure could be simpler**: Complex conditional logic, deeply nested code, or long functions
- **When patterns emerge**: After implementing several similar features, useful abstractions may become apparent

**Remember**: Not all code needs refactoring. If the code is already clean, expressive, and well-structured, commit and move on. Refactoring should improve the code - don't change things just for the sake of change.

### Refactoring Guidelines

#### 1. Commit Before Refactoring

Always commit your working code before starting any refactoring. This gives you a safe point to return to:

```bash
git add .
git commit -m "feat: add payment validation"
# Now safe to refactor
```

#### 2. Look for Useful Abstractions Based on Semantic Meaning

Create abstractions only when code shares the same semantic meaning and purpose. Don't abstract based on structural similarity alone - **duplicate code is far cheaper than the wrong abstraction**.

**Questions to ask before abstracting:**

- Do these code blocks represent the same concept or different concepts that happen to look similar?
- If the business rules for one change, should the others change too?
- Would a developer reading this abstraction understand why these things are grouped together?
- Am I abstracting based on what the code IS (structure) or what it MEANS (semantics)?

#### 3. Understanding DRY - It's About Knowledge, Not Code

DRY (Don't Repeat Yourself) is about not duplicating **knowledge** in the system, not about eliminating all code that looks similar.

#### 4. Maintain External APIs During Refactoring

Refactoring must never break existing consumers of your code:

#### 5. Verify and Commit After Refactoring

**CRITICAL**: After every refactoring:

1. Run all tests - they must pass without modification
2. Run static analysis (mypy, ruff) - must pass
3. Commit the refactoring separately from feature changes

```bash
# After refactoring
uv run pytest       # All tests must pass
uv run mypy         # Type checking must pass
uv run ruff check   # Linting must pass
uv run ruff format  # Code must be formatted

# Only then commit
git add .
git commit -m "refactor: extract payment validation helpers"
```

### Commit Guidelines

- Each commit should represent a complete, working change
- Use conventional commits format:
  ```
  feat: add payment validation
  fix: correct date formatting in payment processor
  refactor: extract payment validation logic
  test: add edge cases for payment validation
  ```
- Include test changes with feature changes in the same commit

### Pull Request Standards

- Every PR must have all tests passing
- All linting and type checking must pass
- Work in small increments that maintain a working state
- PRs should be focused on a single feature or fix
- Include description of the behavior change, not implementation details
