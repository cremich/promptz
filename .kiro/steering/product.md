# Promptz.dev — Product Overview

Promptz.dev is a library and community platform for AI-assisted development resources. It serves developers using Kiro, Kiro CLI, and Amazon Q Developer — enabling discovery, creation, and sharing of AI development resources.

## Content Types

- **Prompts**: AI instruction templates for development tasks
- **Steering Documents**: Configuration files that guide AI assistants to follow established patterns and standards
- **Custom Agents**: Specialized AI assistants with specific workflows and tool configurations
- **Agent Hooks**: Automation triggers that execute agent actions on IDE events
- **Kiro Powers**: Packaged tools, workflows, and best practices activated on-demand in Kiro

## Multi-Library Ecosystem

Content is sourced from multiple git submodules in `libraries/`, each independently versioned:

| Library | Category | Description |
|---------|----------|-------------|
| kiro-powers | Official | Core Kiro powers maintained by the Kiro team |
| promptz | Community | Community prompts and general AI dev resources |
| kiro-best-practices | Community | Best practices from AWS Hero contributors |
| product-teams | Individual | Product development workflow resources |
| genai-startups | Individual | GenAI startup resources |

## Key Architectural Decisions

- All content is processed at build time into static JSON files (`data/`) for performance
- Metadata is extracted from YAML frontmatter, JSON configs, and git history with fallback strategies
- No backend/database — content lives in git submodules, served as static data
- Global search uses Fuse.js for client-side fuzzy matching across all content types
- Dark mode first design with light mode alternative
