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

### Testing

- ✅ Jest unit tests for components and utilities
- ✅ Playwright end-to-end tests for critical user flows

### Documentation

- ✅ Setup Project Intelligence

## In Progress

- 🔄 Tag-Based Discoverability Enhancement (Issue #93)

## What's Left to Build

- ❌ Advanced filtering of prompts per tag via API (in progress with Issue #93)
- ❌ Allow users to browse prompts per tag on landing page (in progress with Issue #93)
- ❌ Add project rules to sitemaps for better SEO (in progress with Issue #93)
- ❌ Implement a download feature for prompts to use prompts in the local prompt library of Amazon Q Developer
- ❌ Add support to create prompts using prompt frameworks
- ❌ Calculate tokens used for prompts and project-rules
- ❌ Prompt flows for sophisticated use-cases and complex engineering tasks
- ❌ Allow users to embed prompts per iframes
- ❌ User-scope tokens for integration into Amazon Q Developer via MCP to access private prompts
- ❌ Show most popular prompts on landing page
- ❌ Show most popular project rules on landing page

## Current Status

The project is in an active development phase with core functionality implemented and working. Recent efforts have focused on enhancing the tag-based discoverability of prompts and project rules, with a comprehensive technical specification created and a GitHub issue (#93) opened to track implementation.

The platform is usable in its current state, providing the essential functionality for users to create, discover, and share prompts and project rules for Amazon Q Developer. The team is now working on enhancing these core features and improving the overall user experience before expanding to more advanced capabilities.

## Known Issues

### Technical Debt

- Some API implementations need refactoring for consistency
- Current tag implementation lacks efficient querying capabilities (being addressed in Issue #93)

### User Experience

- Search functionality could be more intuitive and powerful
- Navigation between related features could be improved
- Limited feedback on prompt effectiveness
- Tag-based browsing is limited (being addressed in Issue #93)

### Performance

- Some operations may slow down with larger datasets
- Search performance may degrade with complex queries

## Next Milestones

### Milestone 1: Tag-Based Discoverability (In Progress)

- Implement dedicated tag data model with many-to-many relationships
- Add homepage sections for browsing prompts and project rules by tag
- Create virtual routes for tag-specific pages
- Improve MCP server integration for tag-based queries

### Milestone 2: Prompt Creation Enhancement

- Assisted prompt engineering using prompt frameworks
- Allow users to define complex prompt flows
- Allow users to set related prompts

### Milestone 3: Prompt Discovery

- Implement features to browse prompts and project rules by popularity
- Increase organic traffic and visibility via features to allow content creators embed their prompts
- Efficient search for prompts via MCP
