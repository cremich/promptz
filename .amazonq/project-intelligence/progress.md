# Progress: Akkodis Prompt Hub

## What Works

### Core Platform

- ✅ User authentication (signup, login, account management)
- ✅ Prompt creation, editing, and management
- ✅ Project rules creation, editing, and management
- ✅ Basic search functionality with tag filtering
- ✅ Copy and download functionality for prompts and rules
- ✅ Popularity tracking (copy count, download count)
- ✅ Responsive UI across device sizes

### Testing

- ✅ Jest unit tests for components and utilities
- ✅ Playwright end-to-end tests for critical user flows

## In Progress

- 🔄 Setup Project Intelligence

## What's Left to Build

- ❌ Advanced filtering of prompts per tag via API.
- ❌ Allow users to browse prompts per tag on landing page.
- ❌ Add project rules to sitemaps for better SEO.
- ❌ Implement a download feature for prompts to use prompts in the local prompt library of Amazon Q Develooer.
- ❌ Add support to create prompts using prompt frameworks.
- ❌ Calculate tokens used for prompts and project-rules.
- ❌ Prompt flows for sophisticated use-cases and complex engineering tasks.
- ❌ Allow users to embed prompts per iframes.
- ❌ User-scope tokens for integration into Amazon Q Developer via MCP to access private prompts.
- ❌ Show most popular prompts on landing page
- ❌ Show most popular project rules on landing page

## Current Status

The project is in an active development phase with core functionality implemented and working. Recent efforts have focused on refactoring and improving existing features rather than adding new ones, with an emphasis on code quality, performance, and user experience.

The platform is usable in its current state, providing the essential functionality for users to create, discover, and share prompts and project rules for AI coding agents and tools including Amazon Q Developer. The team is now working on enhancing these core features and improving the overall user experience before expanding to more advanced capabilities.

## Known Issues

### Technical Debt

- Some API implementations need refactoring for consistency

### User Experience

- Search functionality could be more intuitive and powerful
- Navigation between related features could be improved
- Limited feedback on prompt effectiveness

### Performance

- Some operations may slow down with larger datasets
- Search performance may degrade with complex queries

## Next Milestones

### Milestone 1: Prompt Creation

- Assisted prompt enginering using prompt frameworks
- Allow users to define complex prompt flows
- Allow users to set related prompts

### Milestone 2: Prompt Discovery

- Implement features to browse prompts and project rules by popularity
- Increase organic traffic and visibility via features to allow content creates embed their prompts
- Efficient search for prompts via MCP
