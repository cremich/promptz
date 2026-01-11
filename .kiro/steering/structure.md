# Project Structure

## Root Directory Organization

```
promptz.dev/
├── app/                    # Next.js App Router pages and layouts
│   ├── agents/             # Custom agents listing and detail pages
│   │   ├── [id]/           # Dynamic agent detail pages
│   │   └── page.tsx        # Agents listing page
│   ├── contribute/         # Contribution guidelines and information
│   │   ├── layout.tsx      # Contribute section layout
│   │   └── page.mdx        # Contribution guide (MDX format)
│   ├── faq/                # Frequently asked questions
│   │   ├── layout.tsx      # FAQ section layout
│   │   └── page.mdx        # FAQ content (MDX format)
│   ├── hooks/              # Agent hooks listing and detail pages
│   │   ├── [id]/           # Dynamic hook detail pages
│   │   └── page.tsx        # Hooks listing page
│   ├── library/            # Library browsing and detail pages
│   │   ├── [id]/           # Dynamic library detail pages
│   │   └── page.tsx        # All libraries listing with statistics
│   ├── powers/             # Kiro powers listing and detail pages
│   │   ├── [id]/           # Dynamic power detail pages
│   │   └── page.tsx        # Powers listing page
│   ├── privacy/            # Privacy policy and legal information
│   │   ├── layout.tsx      # Privacy section layout
│   │   └── page.mdx        # Privacy policy (MDX format)
│   ├── prompts/            # Prompts listing and detail pages
│   │   ├── [id]/           # Dynamic prompt detail pages
│   │   └── page.tsx        # Prompts listing page
│   ├── steering/           # Steering documents listing and detail pages
│   │   ├── [id]/           # Dynamic steering detail pages
│   │   └── page.tsx        # Steering listing page
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Homepage with latest content sections
│   ├── globals.css         # Global styles with Tailwind imports
│   └── sitemap.ts          # Dynamic sitemap generation
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── search/             # Search modal components
│   ├── animations/         # Animation components
│   ├── badge-container.tsx # Badge grouping utility component
│   ├── compact-card.tsx    # Unified compact card with type gradients
│   ├── content-date.tsx    # Date formatting and display component
│   ├── content-header.tsx  # Standardized content headers
│   ├── content-type-badge.tsx # Content type indicator badges
│   ├── contributor-info.tsx # Author and git information display
│   ├── detail-layout.tsx   # Layout component for detail pages
│   ├── footer.tsx          # Site footer with links and branding
│   ├── git-hash.tsx        # Git commit hash display component
│   ├── github-link.tsx     # Repository link component
│   ├── grid.tsx            # Responsive grid with skeleton states
│   ├── hero.tsx            # Landing page hero section
│   ├── hook-trigger-badge.tsx # Hook trigger type display
│   ├── keywords.tsx        # Keyword tag display component
│   ├── library-badge.tsx   # Library source indicator badges
│   ├── library-card.tsx    # Library display card with statistics
│   ├── modality-badge.tsx  # Modality indicator badges
│   ├── navigation.tsx      # Sticky header with nav links and search
│   ├── page-header.tsx     # Enhanced page headers with library legend
│   ├── search-button.tsx   # Search trigger button
│   └── search-provider.tsx # Search context provider
├── data/                   # Generated static JSON files (build output)
│   ├── agents.json         # Pre-generated agents data
│   ├── hooks.json          # Pre-generated hooks data
│   ├── powers.json         # Pre-generated powers data
│   ├── prompts.json        # Pre-generated prompts data
│   ├── search-index.json   # Pre-generated search index for Fuse.js
│   └── steering.json       # Pre-generated steering data
│   ├── hooks.json          # Pre-generated hooks data
│   ├── powers.json         # Pre-generated powers data
│   ├── prompts.json        # Pre-generated prompts data
│   ├── steering.json       # Pre-generated steering data
│   └── search-index.json   # Pre-generated search index for Fuse.js
├── lib/                    # Services and utilities
│   ├── formatter/          # Formatting utilities
│   │   ├── date.ts         # Date formatting and comparison
│   │   ├── git.ts          # Git information formatting
│   │   └── slug.ts         # URL slug generation utilities
│   ├── types/              # TypeScript type definitions
│   │   └── content.ts      # Content type interfaces and unions
│   ├── agents.ts           # Agents data loading service
│   ├── hooks.ts            # Hooks data loading service
│   ├── library.ts          # Library service
│   ├── powers.ts           # Powers data loading service
│   ├── prompts.ts          # Prompts data loading service
│   ├── steering.ts         # Steering data loading service
│   └── utils.ts            # General utility functions
├── libraries/              # Git submodules for content libraries
│   ├── kiro-best-practices/ # Best practices from AWS Hero contributors
│   ├── kiro-for-product/   # Product-focused Kiro resources (local, not in .gitmodules)
│   ├── kiro-powers/        # Official Kiro powers library
│   ├── product-teams/      # AWS Samples for product teams
│   └── promptz/            # Community prompts and resources
├── scripts/                # Build-time scripts
│   ├── generate-library-data.ts # Main build-time data generation script
│   ├── library-file-parser.ts   # File system parsing utilities
│   └── metadata-extractor.ts    # Content metadata extraction logic
├── __tests__/              # Test suites
│   ├── unit/               # Unit tests for components and utilities
│   └── property/           # Property-based tests (ephemeral)
├── coverage/               # Test coverage reports (generated)
├── public/                 # Static assets (images, icons, fonts)
├── .kiro/                  # Kiro configuration and steering files
├── .next/                  # Next.js build output (generated)
├── node_modules/           # Dependencies (generated)
└── configuration files     # Package.json, configs, etc.
```

## Content Service Architecture

### lib/ Directory Structure
- **lib/types/content.ts**: TypeScript interfaces for all content types with union types
- **lib/formatter/date.ts**: Date formatting and comparison utilities
- **lib/formatter/git.ts**: Git information formatting utilities
- **lib/formatter/slug.ts**: URL slug generation utilities
- **lib/library.ts**: Library name extraction and unified content aggregation utilities
- **lib/libraries.ts**: Library metadata management and statistics service
- **lib/search.ts**: Search utilities, validation, and error handling
- **lib/{type}.ts**: Type-specific data loading services (prompts.ts, agents.ts, etc.)

### Build Scripts Structure
- **scripts/generate-library-data.ts**: Main build-time data generation script with multi-library support
- **scripts/library-file-parser.ts**: File system utilities and parsing functions for multiple library structures
- **scripts/metadata-extractor.ts**: Content-specific metadata extraction logic with library attribution

### Content Service Features
- **Multi-library processing**: Support for multiple git submodules with different structures
- **Build-time processing**: All content processed during build for optimal performance
- **Static data generation**: Pre-compiled JSON files in `data/` directory
- **Library metadata extraction**: Automatic parsing of .gitmodules and repository information
- **Intelligent metadata extraction**: Multi-source fallback strategy (frontmatter → git → placeholders)
- **Git integration**: Author attribution, commit history, and content lifecycle tracking
- **Error resilience**: Graceful handling of missing files and corrupted data during build
- **Content validation**: Filtering of incomplete or invalid content during build process
- **Library categorization**: Automatic categorization (official, community, specialized) based on repository ownership

### Content Type System
```typescript
// Union type for type-safe operations across all content
type ContentItem = Prompt | Agent | Power | SteeringDocument | Hook

// Base interface with git integration and library attribution
interface BaseContent {
  id: string           // Path-based ID generation
  title: string        // From frontmatter or filename
  author: string       // From frontmatter or git history
  date: string         // From frontmatter or git commits
  path: string         // File system path
  library: string      // Library name for attribution
  git?: GitInfo        // Optional git metadata
}

// Library information interface
interface LibraryInfo {
  id: string
  name: string
  displayName: string
  description: string
  repositoryUrl: string
  owner: string
  path: string
  readme?: string
  license?: string
  contentStats: {
    prompts: number
    agents: number
    powers: number
    steering: number
    hooks: number
    total: number
  }
  lastUpdated?: string
  category: 'official' | 'community' | 'individual'
}

// Search index types for Fuse.js integration
interface SearchIndexItem {
  id: string
  type: 'prompt' | 'agent' | 'power' | 'steering' | 'hook'
  title: string
  description: string
  content: string
  author: string
  date: string
  library: string
  path: string
  keywords?: string[]
}

interface SearchIndex {
  items: SearchIndexItem[]
  metadata: {
    generatedAt: string
    totalItems: number
    itemsByType: Record<string, number>
    itemsByLibrary: Record<string, number>
  }
}
```

## App Directory Structure (Next.js 16 App Router)

### Core Pages
- **app/layout.tsx**: Root layout with Geist fonts, JetBrains Mono, global styles, and metadata
- **app/page.tsx**: Homepage with Navigation, Hero, latest content grid, and Footer
- **app/library/page.tsx**: Unified library browsing page with content type filters and stats
- **app/globals.css**: Global CSS with Tailwind imports, brand colors, and custom utilities
- **app/favicon.ico**: Site favicon and branding assets

### Content Type Pages
- **app/prompts/page.tsx**: Prompts listing with static data loading and library legend
- **app/prompts/[id]/page.tsx**: Dynamic prompt detail pages with ID-based routing
- **app/agents/page.tsx**: Custom agents listing with metadata display and library legend
- **app/agents/[id]/page.tsx**: Dynamic agent detail pages with ID-based routing
- **app/powers/page.tsx**: Kiro powers listing with MCP configuration info
- **app/powers/[id]/page.tsx**: Dynamic power detail pages with ID-based routing
- **app/steering/page.tsx**: Steering documents listing with category filtering and library legend
- **app/steering/[id]/page.tsx**: Dynamic steering detail pages with ID-based routing
- **app/hooks/page.tsx**: Agent hooks listing with trigger information and library legend
- **app/hooks/[id]/page.tsx**: Dynamic hook detail pages with ID-based routing

### Library Pages
- **app/library/page.tsx**: Library browsing page with all libraries, statistics, and quick links
- **app/library/[id]/page.tsx**: Dynamic library detail pages with comprehensive metadata and content statistics

### Static Content Pages (MDX)
- **app/contribute/page.mdx**: Contribution guidelines and information
- **app/faq/page.mdx**: Frequently asked questions
- **app/privacy/page.mdx**: Privacy policy and legal information
- **app/contribute/layout.tsx**: Layout for contribute section
- **app/faq/layout.tsx**: Layout for FAQ section
- **app/privacy/layout.tsx**: Layout for privacy section

### Testing Interface
- **Removed**: Test content interface has been removed in favor of build-time validation
- **Build validation**: Content validation occurs during the build process via `scripts/generate-library-data.ts`
- **Static data verification**: Generated JSON files can be inspected in the `data/` directory

## Components Architecture

### UI Components (Shadcn UI)
- **components/ui/card.tsx**: Base card component with variants
- **components/ui/badge.tsx**: Badge component for tags and categories
- **components/ui/skeleton.tsx**: Loading skeleton components
- **components/ui/dialog.tsx**: Modal dialog with overlay and animations
- **components/ui/input-group.tsx**: Grouped input with addons and buttons
- **components/ui/kbd.tsx**: Keyboard shortcut display elements

### Content Components
- **components/grid.tsx**: Responsive grid with type-safe rendering and skeleton states
- **components/prompt-card.tsx**: Prompt display card with metadata
- **components/agent-card.tsx**: Agent card with configuration preview
- **components/power-card.tsx**: Power card with keywords and MCP info
- **components/steering-card.tsx**: Steering document card with category
- **components/hook-card.tsx**: Hook card with trigger information
- **components/library-card.tsx**: Library display card with statistics and metadata
- **components/compact-card.tsx**: Unified compact card with type-specific gradient backgrounds
- **Reusable Content Components**:
  - **components/content-header.tsx**: Standardized content headers with title and metadata
  - **components/content-date.tsx**: Date formatting and display component
  - **components/contributor-info.tsx**: Author and git information display
  - **components/git-hash.tsx**: Git commit hash display component
  - **components/github-link.tsx**: Repository link component with multi-library support
  - **components/keywords.tsx**: Keyword tag display component
  - **components/badge-container.tsx**: Badge grouping utility component
  - **components/content-type-badge.tsx**: Content type indicator badges
  - **components/library-badge.tsx**: Library source indicator badges with category-specific styling
  - **components/hook-trigger-badge.tsx**: Hook trigger type display
- **Layout Components**:
  - **components/navigation.tsx**: Sticky header with logo, nav links, and search button
  - **components/hero.tsx**: Landing page hero with gradient background, badge, and CTAs (updated to "Browse Libraries")
  - **components/footer.tsx**: Site footer with resource links, community links, and branding
  - **components/pixel-particles.tsx**: Canvas-based animated pixel particle effect
  - **components/page-header.tsx**: Enhanced page headers with library legend support
- **Search Components** (`components/search/`):
  - **components/search-provider.tsx**: React context for global search state
  - **components/search-button.tsx**: Search trigger with keyboard shortcut display
  - **components/search/search-modal.tsx**: Main search dialog with input and results
  - **components/search/search-results.tsx**: Result list with match highlighting
  - **components/search/search-footer.tsx**: Keyboard navigation hints
  - **components/search/useSearchModal.ts**: Custom hook for search logic and Fuse.js

### Component Features
- **Type-safe rendering**: Union type discrimination for content cards
- **Skeleton states**: Loading placeholders for all content types
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Dark mode support**: CSS variables and Tailwind dark mode utilities
- **Global search**: Keyboard-accessible search modal with fuzzy matching
- **Brand identity**: Gradient text effects and type-specific card gradients
- **Animated effects**: Canvas-based pixel particles with reduced motion support

## Libraries Directory (Git Submodules)

### Multi-Library Ecosystem
The platform now supports five specialized libraries, with four managed as git submodules and one as a local directory:

### kiro-powers/
Official Kiro powers for enhanced AI agent capabilities:
- **Individual power directories**: Each power has its own folder with POWER.md, mcp.json, and steering files
- **Power structure**: POWER.md (documentation), mcp.json (MCP server configuration), steering/ (guidance files)
- **Examples**: stripe/, aws-infrastructure-as-code/, terraform/, datadog/
- **Category**: Official
- **Status**: Git submodule

### promptz/
Community-driven library for AI development resources:
- **agents/**: Custom agent configurations with config.json and agent.md files
- **hooks/**: Agent hooks for IDE automation (.kiro.hook files)
- **powers/**: Additional power definitions and configurations
- **prompts/**: AI instruction templates for development tasks
- **steering/**: Shared steering documents for development standards
- **Category**: Community
- **Status**: Git submodule

### kiro-best-practices/
Best practices and patterns from AWS Hero contributors:
- **hooks/**: 17+ agent hooks for development automation
- **steering/**: 11+ steering documents with development standards
- **Structure**: Uses .kiro directory structure for organization
- **Focus**: Professional development patterns and best practices
- **Category**: Community
- **Status**: Git submodule

### product-teams/
Specialized resources for product development workflows:
- **prompts/**: Product-focused AI instructions and templates
- **agents/**: Product management and development agents
- **Focus**: Product team workflows and development processes
- **Source**: AWS Samples repository
- **Category**: Specialized
- **Status**: Git submodule

### kiro-for-product/
Product-focused Kiro resources and documentation:
- **Focus**: Product-specific Kiro capabilities and workflows
- **Category**: Official
- **Status**: Local directory (not in .gitmodules)

## Configuration Files Location

### Root Level
- **package.json**: Dependencies, scripts, and project metadata with Next.js 16 and React 19
- **next.config.ts**: Next.js configuration with TypeScript
- **tsconfig.json**: TypeScript compiler configuration with strict mode and path mapping
- **eslint.config.mjs**: ESLint rules for Next.js and TypeScript with Prettier integration
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **jest.config.ts**: Jest testing configuration with Next.js integration
- **jest.setup.ts**: Jest setup with React Testing Library
- **.gitmodules**: Git submodule configuration for content libraries
- **.gitignore**: Git ignore patterns for build artifacts and dependencies

### Kiro Configuration
- **.kiro/steering/**: Project-specific steering documents
- **.kiro/settings/**: Kiro IDE settings and MCP configurations (when present)

## Content Organization Patterns

### Power Structure
```
power-name/
├── POWER.md              # Main documentation with frontmatter metadata
├── mcp.json              # MCP server configuration
└── steering/             # Optional guidance documents
    ├── getting-started.md
    ├── best-practices.md
    └── troubleshooting.md
```

### Agent Structure
```
agent-name/
├── agent.md              # Agent prompt and instructions
└── config.json           # Agent configuration with MCP servers and tools
```

### Prompt Structure
```
prompts/
├── prompt-name.md        # Individual prompt files
└── category/             # Organized by category or domain
    └── specific-prompt.md
```

## File Naming Conventions

- **Directories**: Use kebab-case for all directory names (user-profile, auth-forms)
- **Components**: Use kebab-case for file names, PascalCase for component names
- **Configuration**: Use standard names (package.json, next.config.ts, tsconfig.json)
- **Content**: Use kebab-case with descriptive names (getting-started.md, api-testing.md)
- **Extensions**: .tsx for React components, .ts for utilities, .md for documentation

## Import Path Configuration

- **@/**: Root directory alias configured in tsconfig.json
- **Relative imports**: Preferred for local files within same feature
- **Absolute imports**: Used for shared utilities and components

## Testing Structure

### Test Organization
- **__tests__/unit/**: Unit tests mirroring source structure
- **__tests__/property/**: Property-based tests (ephemeral, not committed)
- **Jest configuration**: Next.js integration with jsdom environment
- **Testing utilities**: React Testing Library with custom matchers

### Test Patterns
- **Component testing**: Render testing with user interactions
- **Service testing**: Content service with mocked file system
- **Integration testing**: Full content processing workflows
- **Property testing**: AI-assisted validation during development

## Asset Organization

### Public Directory
- **Static assets**: Images, icons, fonts that need direct URL access
- **SEO assets**: Favicon, robots.txt, sitemap.xml
- **Brand assets**: Logos, marketing images

### App Directory Assets
- **Component-specific assets**: Co-located with components when possible
- **Global styles**: CSS files imported in layout.tsx
- **Font files**: Loaded via Next.js font optimization (Geist Sans/Mono)

## Build Output Structure

- **.next/**: Next.js build artifacts (automatically generated)
- **out/**: Static export output (when using static export)
- **dist/**: Alternative build output directory (if configured)

## Development Workflow Structure

### Local Development
1. **Root level**: Main application development with static data generation
2. **Libraries**: Navigate to submodules for content editing
3. **Submodule workflow**: Independent git repositories with their own commit history
4. **Build validation**: Use `npm run build` to validate content processing and generate static data

### Content Service Development
1. **Type definitions**: Start with `lib/types/content.ts` for new content types
2. **Metadata extraction**: Add extractors in `scripts/metadata-extractor.ts`
3. **Build script integration**: Update `scripts/generate-library-data.ts` for new content sources
4. **Type-specific services**: Create dedicated service files (e.g., `lib/prompts.ts`)
5. **Testing**: Validate with unit tests and build process verification

### Content Contribution
1. **Fork library**: Create fork of specific library repository
2. **Create content**: Add new prompts, powers, or agents with proper frontmatter
3. **Git workflow**: Commit with descriptive messages for proper attribution
4. **Submit PR**: Contribute back to main library repository
5. **Update reference**: Parent repository updates submodule reference
6. **Validation**: Content service automatically extracts git metadata and validates structure

## Deployment Structure

- **Static assets**: Served from public/ directory
- **API routes**: Server-side functionality (if added to app/api/)
- **Generated pages**: Static and server-rendered pages from app/ directory with dynamic routing
- **Submodule content**: Processed during build time and served as static JSON files
- **Build-time processing**: Content analysis and metadata extraction during build
- **Static data serving**: Pre-generated JSON files for optimal performance

## Testing and Validation

### Build-time Validation
- **Build script validation**: `scripts/generate-library-data.ts` validates content during build
- **Static data generation**: Comprehensive content processing with error handling
- **JSON file inspection**: Generated files in `data/` directory can be inspected for validation

### Content Validation
- **Metadata completeness**: Checks for required fields and fallback strategies during build
- **Git integration**: Validates author attribution and commit history extraction
- **Type safety**: Ensures all content types conform to TypeScript interfaces
- **Performance**: Monitors build-time processing and static data generation efficiency