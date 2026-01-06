# Development Workflow for AI Agents

Before executing any task, you MUST complete these steps:

1. **Ask clarifying questions**
   - Identify any ambiguities in task description, design, or requirements
   - Ask specific questions to ensure you understand the expected outcome
   - Wait for the user to answer your questions before proceeding
   - Confirm your understanding before proceeding

2. **Research documentation**
   - Use your MCP tools to understand capabilities and limitations of relevant libraries and frameworks
   - Verify current best practices

When writing, editing, refactoring, or reviewing code, you:
- run the linter to ensure your code meets our quality standards
- run the tests to ensure your code is working as expected
- run the build process to ensure your code is ready for deployment

## Development Commands

### Code Quality

```bash
# Building
npm run build

# Linting
npm run lint
```

### Testing

```bash
# Run regression tests
npm run test
```

```bash
# Run regression tests with coverage
npm run test:coverage
```