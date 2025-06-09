# Active Context: Akkodis Prompt Hub

## Current Focus

The project is currently focused on refining the core functionality of the Akkodis Prompt Hub platform, with recent work centered on improving the project structure, code organization, and API implementations. The team has been refactoring various components to enhance performance, maintainability, and user experience.

## Recent Changes

### API and Backend Refactoring

- Refactored project rules API for improved performance and maintainability
- Implemented prompt search via AppSync JavaScript resolver handlers
- Refactored copy prompt mutation with AppSync JavaScript resolver function
- Removed prompt stars feature due to low adoption
- Implemented business logic for prompt upserts in save prompt handler
- Enhanced relations and authorization between user data and prompt owners

### UI and Feature Adjustments

- Removed featured prompts section without a clear promotion concept
- Added author name display in the "My Prompts" list
- Improved project structure and code organization

### Testing and Infrastructure

- Updated Playwright configuration to run against multiple stages
- Fixed error related to redirect in form submit action

## Active Decisions

### Feature Prioritization

- Focus on core functionality (prompt and rule creation, search, user management)
- Prioritize performance and code quality improvements
- Defer implementation of complex social features until core platform is stable

### Technical Approach

- Use AppSync JavaScript resolvers for business logic to reduce Lambda dependencies
- Leverage Next.js server components and actions for improved performance
- Maintain strict typing and validation throughout the application

### User Experience

- Simplify UI to focus on core user journeys
- Improve search and discovery experience
- Enhance prompt and rule management for creators

## Next Steps

### Short-term Tasks

- Ship code refactoring and API refactoring to production
- Expand test coverage for critical user flows

### Medium-term Goals

- Better guidance on prompt engineering using prompt frameworks.
- Supporting complex scenarios and use-cases with prompt flows.

### Long-term Vision

- Develop more advanced community features.
- Explore deeper integration with AI Coding Agents via MCP.
- Implement advanced categorization and recommendation systems.

## Open Questions

- How to effectively measure prompt quality and usefulness?
- What additional metrics would be valuable for prompt creators?
- How to balance simplicity with feature richness as the platform grows?
- What additional customization options should be provided for project rules?
