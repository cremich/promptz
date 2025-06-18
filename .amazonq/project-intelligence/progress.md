# Progress: Promptz

## What Works

### Core Platform

- ✅ User authentication (signup, login, account management)
- ✅ Prompt creation, editing, and management
- ✅ Project rules creation, editing, and management
- ✅ Basic search functionality with tag filtering
- ✅ Copy and download functionality for prompts and rules
- ✅ Popularity tracking (copy count, download count)
- ✅ Responsive UI across device sizes
- ✅ SEO improvements with slug-based URLs and redirects
- ✅ Source URL attribution for external prompt sources

### Testing

- ✅ Jest unit tests for components and utilities
- ✅ Playwright end-to-end tests for critical user flows

### Documentation

- ✅ Setup Project Intelligence

## In Progress

- 🔄 Tag-Based Discoverability Enhancement (Issue #93)
- 🔄 Project Rules in Sitemap (Issue #103)
- 🔄 Token Calculation for Prompts and Project Rules (Issue #102)
- 🔄 Context Hooks Support (Issue #101)
- 🔄 MCP Server Listings (Issue #100)
- 🔄 Prompt Engineering Frameworks Support (Issue #104)

## What's Left to Build

- ❌ Add project rules to sitemaps for better SEO (in progress with Issue #103)
- ❌ Calculate tokens used for prompts and project-rules (in progress with Issue #102)
- ❌ Support for context hooks (in progress with Issue #101)
- ❌ MCP server catalog (in progress with Issue #100)
- ❌ Support for prompt engineering frameworks (in progress with Issue #104)
- ❌ GitHub integration for collaborative updates (Issue #88)
- ❌ Improved visibility toggle explanation (Issue #98)
- ❌ Prompt flows for sophisticated use-cases and complex engineering tasks
- ❌ Allow users to embed prompts per iframes
- ❌ User-scope tokens for integration into Amazon Q Developer via MCP to access private prompts
- ❌ Show most popular prompts on landing page
- ❌ Show most popular project rules on landing page

## Current Status

The project is in an active development phase with core functionality implemented and working. Recent efforts have focused on enhancing the tag-based discoverability of prompts and project rules (Issue #93), with several new features planned to improve the platform's functionality and user experience.

The platform is usable in its current state, providing the essential functionality for users to create, discover, and share prompts and project rules for Amazon Q Developer. The team is now working on enhancing these core features and improving the overall user experience before expanding to more advanced capabilities.

Recent bug fixes have addressed issues with prompt deletion (Issue #94) and UI elements (Issue #96), while new features are being developed to support token calculation (Issue #102), context hooks (Issue #101), and prompt engineering frameworks (Issue #104).

## Known Issues

### Technical Debt

- Current tag implementation lacks efficient querying capabilities (being addressed in Issue #93)

### User Experience

- Search functionality could be more intuitive and powerful
- Navigation between related features could be improved
- Limited feedback on prompt effectiveness
- Tag-based browsing is limited (being addressed in Issue #93)
- Visibility toggle needs clearer explanation (Issue #98)

### Performance

- Some operations may slow down with larger datasets
- Search performance may degrade with complex queries

## Next Milestones

### Milestone 1: Tag-Based Discoverability and SEO (In Progress)

- Implement dedicated tag data model with many-to-many relationships (Issue #93)
- Add homepage sections for browsing prompts and project rules by tag (Issue #93)
- Create virtual routes for tag-specific pages (Issue #93)
- Add project rules to sitemap.xml for better SEO (Issue #103)
- Improve MCP server integration for tag-based queries (Issue #93)

### Milestone 2: Enhanced User Experience and Functionality

- Calculate tokens for prompts and project rules (Issue #102)
- Support context hooks for Amazon Q CLI (Issue #101)
- Create MCP server catalog (Issue #100)
- Support prompt engineering frameworks (Issue #104)
- Improve visibility toggle explanation (Issue #98)

### Milestone 3: Collaboration and Advanced Features

- Implement GitHub integration for collaborative updates (Issue #88)
- Allow users to define complex prompt flows
- Allow users to set related prompts
- Support embedding prompts via iframes
- Implement user-scope tokens for MCP integration
