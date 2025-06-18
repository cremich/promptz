# Active Context: Promptz

## Current Focus

The project is currently focused on several key areas to enhance the platform's functionality and user experience:

1. **Tag-Based Discoverability Enhancement** (Issue #93): Implementing a robust tag-based retrieval system for improved prompt and project rule discovery.
2. **Project Rules in Sitemap** (Issue #103): Adding project rules to the sitemap.xml for better SEO and discoverability via search engines.
3. **Token Calculation** (Issue #102): Implementing token calculation for prompts and project rules to help users manage their context window.
4. **Context Hooks Support** (Issue #101): Adding support for Amazon Q CLI context hooks to help developers inject context into conversations.
5. **MCP Server Listings** (Issue #100): Creating a catalog of Model Context Protocol (MCP) servers for easy discovery and integration.
6. **Prompt Engineering Frameworks** (Issue #104): Supporting structured prompt engineering with established frameworks like RISEN, RODES, or RTF.

## Recent Changes

### API and Backend Refactoring

- Refactored project rules API for improved performance and maintainability
- Implemented prompt search via AppSync JavaScript resolver handlers
- Refactored copy prompt mutation with AppSync JavaScript resolver function
- Fixed issues with prompt deletion functionality (Issue #94)
- Implemented business logic for prompt upserts in save prompt handler
- Enhanced relations and authorization between user data and prompt owners

### UI and Feature Adjustments

- Fixed UI issues with the "Create prompt" button (Issue #96)
- Improved visibility toggle explanation for prompts and project rules (Issue #98)
- Added author name display in the "My Prompts" list
- Improved project structure and code organization

### Testing and Infrastructure

- Updated Playwright configuration to run against multiple stages
- Fixed error related to redirect in form submit action

## Active Decisions

### Feature Prioritization

- Focus on tag-based discoverability enhancement (Issue #93) as a high-priority feature
- Implement token calculation for prompts and project rules (Issue #102)
- Add project rules to sitemap.xml for better SEO (Issue #103)
- Support prompt engineering frameworks to help users create effective prompts (Issue #104)
- Create a catalog of MCP servers for easy discovery and integration (Issue #100)
- Add support for context hooks to help developers inject context into conversations (Issue #101)

### Technical Approach

- Use AppSync JavaScript resolvers for business logic to reduce Lambda dependencies
- Implement pipeline resolvers for prompt/project rule creation to maintain both tag arrays and relationships
- Leverage Next.js server components and actions for improved performance
- Maintain strict typing and validation throughout the application
- Use the Anthropic TypeScript Tokenizer for token calculation

### User Experience

- Simplify UI to focus on core user journeys
- Improve search and discovery experience through tag-based browsing
- Enhance prompt and rule management for creators
- Clarify visibility controls for prompts and project rules
- Support prompt engineering with established frameworks

## Next Steps

### Short-term Tasks

- Implement the Tag-Based Discoverability Enhancement as specified in Issue #93
- Add project rules to sitemap.xml (Issue #103)
- Implement token calculation for prompts and project rules (Issue #102)
- Support prompt engineering frameworks (Issue #104)
- Create a catalog of MCP servers (Issue #100)
- Add support for context hooks (Issue #101)

### Medium-term Goals

- Implement GitHub integration for collaborative updates (Issue #88)
- Supporting complex scenarios and use-cases with prompt flows
- Improve visibility toggle explanation for prompts and project rules

### Long-term Vision

- Develop more advanced community features
- Explore deeper integration with Amazon Q Developer via MCP
- Implement advanced categorization and recommendation systems
- Support for collaborative editing and versioning of prompts and rules

## Open Questions

- How to effectively measure prompt quality and usefulness?
- What additional metrics would be valuable for prompt creators?
- How to balance simplicity with feature richness as the platform grows?
- What additional customization options should be provided for project rules?
- How to implement secure GitHub integration for collaborative updates?
- How to ensure MCP servers listed in the catalog are secure and compatible?
