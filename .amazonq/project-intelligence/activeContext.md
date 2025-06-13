# Active Context: Promptz

## Current Focus

The project is currently focused on enhancing the discoverability of prompts and project rules through a robust tag-based retrieval system. A comprehensive technical specification has been created and GitHub issue #93 has been opened to track the implementation of this feature.

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

- Focus on tag-based discoverability enhancement (Issue #93) as a high-priority feature
- Implement a dedicated data model for tags with many-to-many relationships
- Create homepage sections for browsing by tag
- Implement virtual routes for tag-specific pages
- Ensure backward compatibility with existing tag implementation

### Technical Approach

- Use AppSync JavaScript resolvers for business logic to reduce Lambda dependencies
- Implement pipeline resolvers for prompt/project rule creation to maintain both tag arrays and relationships
- Leverage Next.js server components and actions for improved performance
- Maintain strict typing and validation throughout the application

### User Experience

- Simplify UI to focus on core user journeys
- Improve search and discovery experience through tag-based browsing
- Enhance prompt and rule management for creators

## Next Steps

### Short-term Tasks

- Implement the Tag-Based Discoverability Enhancement as specified in Issue #93
- Create the new Tag data model and relationship tables
- Develop migration script for existing tag data
- Add homepage sections for browsing by tag
- Create virtual routes for tag-specific pages

### Medium-term Goals

- Better guidance on prompt engineering using prompt frameworks
- Supporting complex scenarios and use-cases with prompt flows

### Long-term Vision

- Develop more advanced community features
- Explore deeper integration with Amazon Q Developer via MCP
- Implement advanced categorization and recommendation systems

## Open Questions

- How to effectively measure prompt quality and usefulness?
- What additional metrics would be valuable for prompt creators?
- How to balance simplicity with feature richness as the platform grows?
- What additional customization options should be provided for project rules?
- Who will be responsible for managing the predefined tag list?
- How will we measure the success of the tag-based discoverability feature?
