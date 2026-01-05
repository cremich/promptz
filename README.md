# Promptz.dev

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](./CODE_OF_CONDUCT.md)

The ultimate library for AI-assisted development with Kiro, Designed to help developers discover, create, and perfect their prompts, steering documents, custom agents, agent hooks, and Kiro powers for every step of the software development lifecycle.

## Table of Contents

- [About Promptz.dev](#-about-promptzdev)
- [Getting Started](#-getting-started)
- [Content Types](#-content-types)
- [Contributing Content](#-contributing-content)
- [Development](#-development)
- [Architecture](#-architecture)
- [Contributing](#contributing)
- [License](#license)

## 🚀 About Promptz.dev

Promptz.dev is a comprehensive, community-driven platform for AI-assisted development, serving as the central hub for developers using **Kiro**, **Kiro CLI**, and **Amazon Q Developer**. Built with Next.js 16 and modern web technologies, it provides a fast, accessible, and developer-focused experience.

### Core Purpose

The platform enables creation, discovery, and sharing of AI development resources across the entire software development lifecycle, helping development teams establish consistent AI workflows and coding standards.

### Key Features

- **Git-based Content Management** - All content managed through git submodules for independent versioning
- **Rich Metadata Extraction** - Intelligent extraction from YAML frontmatter, JSON configs, and git history
- **Global Search** - Fuzzy search across all content types with keyboard shortcuts (⌘K/Ctrl+K)

### Target Audience

- Developers using Kiro, Kiro CLI, and Amazon Q Developer for AI-assisted development
- Development teams establishing coding standards and AI workflows
- Contributors creating and sharing AI prompts and development patterns
- Organizations implementing AI-assisted development practices at scale

## 🏃 Getting Started

### Prerequisites

- **Node.js** v22.x or later
- **npm** v10.x or later
- **Git** v2.14.1 or later

### Local Development

1. **Clone the repository with submodules**:
```bash
git clone https://github.com/your-org/promptz.dev.git
cd promptz.dev
```

2. **Install dependencies**:
```bash
npm install
```

3. **Initialize git submodules** (if not cloned with `--recursive`):
```bash
git submodule update --init --recursive
```

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser** and navigate to `http://localhost:3000`

### Project Structure

```
promptz.dev/
├── app/                    # Next.js App Router pages and layouts
│   ├── agents/             # Custom agents listing and detail pages
│   ├── hooks/              # Agent hooks listing and detail pages
│   ├── library/            # Unified library browsing page
│   ├── powers/             # Kiro powers listing and detail pages
│   ├── prompts/            # Prompts listing and detail pages
│   ├── steering/           # Steering documents listing and detail pages
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Homepage with latest content sections
│   └── globals.css         # Global styles with Tailwind imports
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── search/             # Search modal components
│   └── *.tsx               # Content and layout components
├── data/                   # Generated static JSON files (build output)
├── lib/                    # Services and utilities
├── libraries/              # Git submodules for content libraries
│   ├── kiro-powers/        # Official Kiro powers library
│   └── promptz/            # Community prompts and resources
├── scripts/                # Build-time scripts
└── __tests__/              # Test suites
```

## 📝 Content Types

Promptz.dev supports five primary content types, each designed for specific aspects of AI-assisted development:

### Prompts
AI instructions for specific development tasks organized by category:
- **Code Generation** - Scaffolding, boilerplate, refactoring
- **Testing** - Unit tests, integration tests, QA processes
- **Documentation** - ADRs, specs, API docs
- **Architecture** - System design, diagrams, patterns
- **Analysis** - Code review, security, optimization

### Steering Documents 
Configuration files that ensure AI assistants consistently follow established patterns:
- **Framework Standards** - Next.js, React, TypeScript best practices
- **Coding Standards** - Naming conventions, error handling, security
- **Development Workflow** - Git conventions, testing standards, documentation

### Custom Agents
Specialized AI assistants for specific workflows:
- **Documentation Agents** - Automated doc generation and maintenance
- **Engineering Agents** - Development workflow assistants
- **Testing Agents** - QA automation and test generation

### Agent Hooks
Automation tools that execute predefined agent actions on IDE events:
- **File Save Hooks** - Auto-format, lint, test on save
- **Git Hooks** - Pre-commit validation, automated testing
- **Manual Hooks** - On-demand code review, documentation updates

### Kiro Powers
Packaged tools, workflows, and best practices that Kiro can activate on-demand:
- **AWS Infrastructure** - Cloud resource management
- **Database Operations** - Schema management, migrations
- **API Development** - REST/GraphQL scaffolding and testing

## 🛠 Development

### Technology Stack

- **Next.js 16.1.1** - React framework with App Router architecture
- **React 19.2.3** - UI library with server components
- **TypeScript 5** - Static type checking with strict configuration
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Component library for consistent, accessible UI
- **Fuse.js** - Fuzzy search for content discovery
- **Jest** - Testing framework with React Testing Library

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Generate static data and build production bundle
npm run start            # Start production server

# Testing
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint
npm run prepare          # Set up git hooks (runs automatically after install)
```

### Build Process

The build process includes several automated steps:

1. **Content Processing** (`scripts/generate-library-data.ts`)
   - Scans git submodules for content
   - Extracts metadata from frontmatter and git history
   - Generates static JSON files in `data/` directory

2. **Search Index Generation** (`scripts/build-search-index.ts`)
   - Creates searchable index from all content
   - Optimizes for fuzzy search with Fuse.js

3. **Next.js Build** - Static site generation with optimized assets

### Content Service Architecture

The platform uses a build-time content processing system:

- **Build-time Processing** - All content processed during build for optimal performance
- **Static Data Generation** - Pre-compiled JSON files for fast loading
- **Git Integration** - Author attribution and commit history extraction
- **Error Resilience** - Graceful handling of missing or corrupted content
- **Type Safety** - Union types for cross-content operations

### Testing

```bash
# Unit tests for components and utilities
npm run test

# Coverage reports
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 🤝 Contributing

There are two main ways to contribute to Promptz.dev:

### 1. Content Contributions

Share your AI development resources with the community by contributing to our integrated content libraries.

#### Contributing to Promptz.lib (Community Library)

**The easiest way to contribute!** Simply share your raw Kiro files from your `.kiro` folders.

**What you can contribute:**
- **Steering Documents** - Development standards from `~/.kiro/steering/` or `<project>/.kiro/steering/`
- **Prompts** - Reusable AI instructions (various formats supported by Kiro's prompt management system)
- **Agent Hooks** - IDE automation from `.kiro/hooks/` (JSON `.hook` files)
- **Custom Agents** - Agent configurations with `config.json` and optional system prompts
- **Kiro Powers** - Complete power bundles with `POWER.md`, optional `mcp.json`, and `steering/` files

**Your Kiro folder structure:**
```
~/.kiro/                    # Global configurations (user-wide)
├── steering/              # Personal coding standards (.md files)
├── hooks/                 # Cross-project automation (.hook JSON files)
└── settings/              # Configuration files (mcp.json, etc.)

<project>/.kiro/           # Project-specific configurations
├── steering/              # Project standards (.md files)
├── hooks/                 # Project automation (.hook JSON files)
└── agents/                # Custom agent configurations
```

**Power bundle structure:**
```
power-name/
├── POWER.md              # Main power file with frontmatter and instructions
├── mcp.json              # Optional MCP server configuration
└── steering/             # Optional additional steering files
    ├── getting-started.md
    └── best-practices.md
```

**Quick contribution process:**
1. **Find your files** - Check `~/.kiro/` (global) and `<project>/.kiro/` (project-specific) folders
2. **Fork** the [promptz.lib repository](https://github.com/cremich/promptz.lib)
3. **Copy your files** to the appropriate directories (steering/, prompts/, hooks/, agents/, powers/)
4. **Remove sensitive data** - Strip API keys, passwords, personal paths
5. **Create a pull request** with a clear description
6. **Automatic publication** - Once merged, your content appears on promptz.dev

**For detailed guidelines and examples**, see the [promptz.lib CONTRIBUTING.md](https://github.com/cremich/promptz.lib/blob/main/CONTRIBUTING.md).

#### Contributing to Official Kiro Powers

For official Kiro Powers with structured review and packaging, visit the [Kiro Powers submission page](https://kiro.dev/powers/submit/) for complete guidelines and requirements.

### 2. Website Contributions

Help improve the Promptz.dev platform itself.

**Types of website contributions:**
- **Bug Fixes** - Fix issues with website functionality
- **New Features** - Add capabilities like search improvements, UI enhancements
- **Additional Libraries** - Integrate new content libraries as git submodules
- **Performance Improvements** - Optimize build processes, caching, or rendering
- **Documentation** - Improve developer guides and API documentation

**Development workflow:**
1. **Fork** this repository
2. **Setup** - Clone with submodules: `git clone --recursive <your-fork>`
3. **Develop** - Create feature branch, make changes, follow coding standards
4. **Test** - Run `npm run test && npm run lint && npm run build`
5. **Submit** - Create pull request with clear description

**For complete development setup and guidelines**, see our [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used in this project:

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
