# Technology Stack

## Framework and Runtime

- **Next.js 16.1.1**: React framework with App Router architecture for server-side rendering and static generation
- **React 19.2.3**: UI library with latest concurrent features and server components
- **TypeScript 5**: Static type checking with strict configuration enabled
- **Node.js**: JavaScript runtime (version 18+ required for Next.js 16)

## Styling and UI

- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS integration
- **Shadcn UI**: Component library for consistent, accessible UI components
- **Geist Font Family**: Modern font stack optimized for developer interfaces (Geist Sans & Geist Mono)
- **JetBrains Mono**: Monospace font for code display and technical content
- **Dark Mode**: Primary theme with light mode alternative using CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoint system
- **Lucide React**: Icon library for consistent iconography
- **Brand Color System**: Primary indigo (#4F46E5), secondary violet (#7C3AED), complementary cyan (#06B6D4)
- **Gradient Effects**: Text gradients and card background gradients for visual hierarchy
- **Animated Particles**: Canvas-based pixel particle effects for hero sections

## Development Tools

- **ESLint 9**: Code linting with Next.js and TypeScript configurations
- **Prettier 3.7.4**: Code formatting with lint-staged integration
- **PostCSS**: CSS processing with Tailwind CSS plugin
- **Husky 9.1.7**: Git hooks for code quality enforcement
- **lint-staged 16.2.7**: Run linters on staged files
- **Git Submodules**: Content library management for independent versioning

## Build System

- **Turbopack**: Next.js 16 default bundler for faster builds and Hot Module Replacement
- **TypeScript Compiler**: Strict type checking with path mapping support (@/ alias)
- **CSS Processing**: Tailwind CSS 4 compilation with PostCSS
- **ESM Configuration**: Modern JavaScript modules with .mjs config files
- **Build-time Data Generation**: Pre-build script (`scripts/generate-library-data.ts`) creates static JSON files
- **TSX Execution**: TypeScript execution for build scripts with tsx package

## Testing Framework

- **Jest 30.2.0**: JavaScript testing framework with Next.js integration
- **React Testing Library 16.3.1**: Component testing utilities
- **Jest DOM**: Custom matchers for DOM testing
- **jsdom**: Browser environment simulation for tests
- **Fast-check**: Property-based testing for AI-assisted validation
- **ts-node**: TypeScript execution for test configuration

## Content Management

- **Git Submodules**: External libraries managed as independent repositories
- **Build-time Data Generation**: Static JSON files created during build process via `scripts/generate-library-data.ts`
- **Metadata Processing**: Multi-source extraction from YAML frontmatter, JSON configs, and git history
- **Git Integration**: Repository analysis using simple-git library during build time
- **Dynamic Routing**: Next.js App Router with slug-based detail pages for all content types
- **Type Safety**: Union types for cross-content operations and validation

## Content Service Dependencies

- **gray-matter 4.0.3**: YAML frontmatter parsing for markdown content
- **simple-git 3.30.0**: Git repository analysis and history extraction
- **server-only 0.0.1**: Ensures server-side only execution for content service

## UI Component Dependencies

- **@radix-ui/react-accordion 1.2.12**: Collapsible content sections
- **@radix-ui/react-dialog 1.1.14**: Modal dialog components for search and overlays
- **@radix-ui/react-separator 1.1.8**: Visual content dividers
- **@radix-ui/react-slot 1.2.4**: Primitive component composition
- **@radix-ui/react-tabs 1.1.13**: Tabbed interface components
- **class-variance-authority 0.7.1**: Type-safe component variants
- **clsx 2.1.1**: Conditional className utility
- **tailwind-merge 3.4.0**: Tailwind class merging utility
- **tw-animate-css 1.4.0**: CSS animations for Tailwind
- **fuse.js 7.1.0**: Fuzzy search library for client-side content search

## Content Service Architecture

### Core Components
- **Build Script** (`scripts/generate-library-data.ts`): Build-time data generation with metadata extraction
- **Type Definitions** (`lib/types/content.ts`): TypeScript interfaces and union types
- **Library Parser** (`scripts/library-file-parser.ts`): File system utilities and parsing functions
- **Metadata Extractor** (`scripts/metadata-extractor.ts`): Content-specific extraction logic
- **Formatter Utilities** (`lib/formatter/`): Date, git, and slug formatting utilities
- **Library Service** (`lib/library.ts`): Library name extraction utilities

### Type-Specific Services
- **Prompts Service** (`lib/prompts.ts`): Prompts data loading from static JSON
- **Agents Service** (`lib/agents.ts`): Agents data loading from static JSON
- **Powers Service** (`lib/powers.ts`): Powers data loading from static JSON
- **Steering Service** (`lib/steering.ts`): Steering documents data loading from static JSON
- **Hooks Service** (`lib/hooks.ts`): Hooks data loading from static JSON
- **Search Service** (`lib/search.ts`): Search utilities, validation, and error handling
- **Library Service** (`lib/library.ts`): Unified content aggregation with `getAllContent()` and `getLatestContent()` functions

### Key Features
- **Build-time Processing**: All content processed during build for optimal performance
- **Static Data Generation**: Pre-compiled JSON files in `data/` directory
- **Intelligent Metadata Resolution**: Frontmatter → Git → Placeholders fallback strategy
- **Error Resilience**: Graceful handling of missing files and corrupted data during build
- **Git Integration**: Author attribution, commit history, and content lifecycle tracking
- **Content Validation**: Filtering of incomplete or invalid content during build process

### Content Processing Flow
1. **Build Trigger**: `prebuild` script runs before Next.js build
2. **Discovery**: Scan library directories for content
3. **Parsing**: Extract content from markdown, JSON, and YAML files
4. **Git Analysis**: Retrieve author, dates, and commit information
5. **Validation**: Filter incomplete or invalid content
6. **JSON Generation**: Create static JSON files in `data/` directory
7. **Runtime Loading**: Services load pre-generated JSON data

## Component Architecture

### UI Components (Shadcn UI)
- **Card Component** (`components/ui/card.tsx`): Base card with header, content, footer variants
- **Badge Component** (`components/ui/badge.tsx`): Status and category indicators
- **Skeleton Component** (`components/ui/skeleton.tsx`): Loading state placeholders
- **Dialog Component** (`components/ui/dialog.tsx`): Modal dialogs with overlay and animations
- **Input Group Component** (`components/ui/input-group.tsx`): Grouped input with addons and buttons
- **Kbd Component** (`components/ui/kbd.tsx`): Keyboard shortcut display elements

### Content Components
- **Grid Component** (`components/grid.tsx`): Responsive grid with type-safe rendering
- **Content Cards**: Type-specific cards (prompt-card, agent-card, power-card, steering-card, hook-card)
- **Compact Card** (`components/compact-card.tsx`): Unified card component with type-specific gradient backgrounds
- **Reusable Components**: Modular content display components
  - **Content Header** (`components/content-header.tsx`): Standardized content headers
  - **Content Date** (`components/content-date.tsx`): Date formatting and display
  - **Contributor Info** (`components/contributor-info.tsx`): Author and git information
  - **Git Hash** (`components/git-hash.tsx`): Git commit hash display
  - **GitHub Link** (`components/github-link.tsx`): Repository links
  - **Keywords** (`components/keywords.tsx`): Keyword tag display
  - **Badge Container** (`components/badge-container.tsx`): Badge grouping utility
  - **Content Type Badge** (`components/content-type-badge.tsx`): Content type indicators
  - **Library Badge** (`components/library-badge.tsx`): Library source indicators
  - **Hook Trigger Badge** (`components/hook-trigger-badge.tsx`): Hook trigger type display
- **Skeleton States**: Loading placeholders for all content types
- **Layout Components**: Site-wide layout elements
  - **Navigation** (`components/navigation.tsx`): Sticky header with logo, nav links, and search button
  - **Hero** (`components/hero.tsx`): Landing page hero section with gradient background and CTAs
  - **Footer** (`components/footer.tsx`): Site footer with resource links and branding
  - **Pixel Particles** (`components/pixel-particles.tsx`): Canvas-based animated particle effect
- **Search Components**: Global search functionality
  - **Search Provider** (`components/search-provider.tsx`): React context for search state management
  - **Search Button** (`components/search-button.tsx`): Trigger button with keyboard shortcut display
  - **Search Modal** (`components/search/search-modal.tsx`): Main search dialog with input and results
  - **Search Results** (`components/search/search-results.tsx`): Result display with match highlighting
  - **Search Footer** (`components/search/search-footer.tsx`): Keyboard navigation hints
  - **useSearchModal Hook** (`components/search/useSearchModal.ts`): Search logic and Fuse.js integration

### Component Features
- **Type-safe Rendering**: Union type discrimination for content cards
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Dark Mode Support**: CSS variables and Tailwind dark mode utilities
- **Progressive Loading**: Suspense boundaries with skeleton states

## Common Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# Alternative package managers
yarn dev
pnpm dev
bun dev
```

### Build and Deployment
```bash
# Generate static data and build production bundle
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run coverage in watch mode
npm run test:coverage:watch

# Run coverage for CI
npm run test:coverage:ci
```

### Code Quality
```bash
# Prepare git hooks (run automatically after npm install)
npm run prepare

# Format code with Prettier (runs automatically on commit)
npx prettier --write .
```

### Git Submodule Management
```bash
# Initialize and update all submodules
git submodule update --init --recursive

# Update specific submodule to latest
git submodule update --remote libraries/kiro-powers

# Add new submodule
git submodule add <repository-url> libraries/<library-name>
```

### Content Service Testing
```bash
# Build and test static data generation
npm run build

# Validate generated JSON files
ls -la data/
cat data/prompts.json | jq length
cat data/agents.json | jq length
cat data/powers.json | jq length
cat data/steering.json | jq length
cat data/hooks.json | jq length
```

### Content Development
```bash
# Navigate to library for content editing
cd libraries/kiro-powers

# Create new power or content
mkdir new-power-name
cd new-power-name

# Commit changes in submodule
git add .
git commit -m "feat: add new power"
git push

# Update parent repository to reference new submodule commit
cd ../..
git add libraries/kiro-powers
git commit -m "feat: update kiro-powers library"
```

## Configuration Files

- **next.config.ts**: Next.js configuration with TypeScript support
- **tsconfig.json**: TypeScript compiler configuration with strict mode and path mapping
- **eslint.config.mjs**: ESLint configuration for Next.js and TypeScript with Prettier integration
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **jest.config.ts**: Jest testing configuration with Next.js integration
- **jest.setup.ts**: Jest setup with React Testing Library
- **package.json**: Dependencies and scripts configuration
- **.gitmodules**: Git submodule configuration for content libraries

## Performance Considerations

- **Server Components**: Default rendering strategy for optimal performance
- **Client Components**: Used only when browser interactivity is required
- **Static Generation**: Leveraged for content that doesn't change frequently
- **React Cache**: Request-level memoization for content service operations
- **Git Repository Caching**: Efficient git instance management per repository
- **Content Validation**: Early filtering of invalid content to prevent processing overhead
- **Image Optimization**: Next.js Image component for automatic optimization
- **Bundle Optimization**: Turbopack for faster builds and smaller bundles
- **Suspense Boundaries**: Progressive loading with skeleton states

## Development Workflow

- **Hot Module Replacement**: Instant updates during development with Turbopack
- **TypeScript Integration**: Real-time type checking and IntelliSense with strict mode
- **ESLint Integration**: Automatic code quality checks with Prettier formatting
- **Git Workflow**: Submodule-based content management with independent versioning
- **Content Service**: Automatic metadata extraction and git integration
- **Error Handling**: Graceful degradation with comprehensive logging
- **Testing Interface**: `/test-content` route for validation and debugging
- **Pre-commit Hooks**: Automated code formatting and linting with Husky and lint-staged

## Library Ecosystem

### Git Submodules
- **kiro-powers**: Official Kiro powers library (git@github.com:kirodotdev/powers.git)
- **promptz**: Community prompts library (git@github.com:cremich/promptz.lib.git)

### Content Types Support
- **Powers**: POWER.md with MCP configuration and steering files
- **Prompts**: Markdown files with YAML frontmatter
- **Agents**: Agent.md with config.json configuration
- **Steering Documents**: Markdown files with category support
- **Hooks**: .kiro.hook files with trigger configuration

## Deployment Architecture

- **Static Assets**: Served from public/ directory with Next.js optimization
- **Server-Side Rendering**: App Router with React Server Components
- **Content Processing**: Build-time git analysis and metadata extraction
- **Caching Strategy**: React cache for request-level memoization
- **Error Boundaries**: Graceful degradation for missing or corrupted content
- **Performance Monitoring**: Core Web Vitals tracking and optimization