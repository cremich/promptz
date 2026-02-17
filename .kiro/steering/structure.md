# Project Structure

```
├── app/                        # Next.js App Router
│   ├── agents/                 # Agents listing + [id] detail
│   ├── hooks/                  # Hooks listing + [id] detail
│   ├── library/                # Library browsing + [id] detail
│   ├── powers/                 # Powers listing + [id] detail
│   ├── prompts/                # Prompts listing + [id] detail
│   ├── steering/               # Steering listing + [id] detail
│   ├── workshop/               # Prompt engineering workshop + sources
│   ├── contribute/             # Contribution guide (MDX)
│   ├── faq/                    # FAQ (MDX)
│   ├── privacy/                # Privacy policy (MDX)
│   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   ├── page.tsx                # Homepage (hero, latest content)
│   ├── globals.css             # Tailwind imports, brand colors, utilities
│   └── sitemap.ts              # Dynamic sitemap generation
├── components/                 # React components (flat structure)
│   ├── ui/                     # Shadcn UI primitives (DO NOT manually edit)
│   ├── search/                 # Search modal, results, footer, useSearchModal hook
│   ├── animations/             # Pixel particles canvas effect
│   ├── compact-card.tsx        # Unified card with type-specific gradients
│   ├── detail-layout.tsx       # Shared layout for detail pages
│   ├── grid.tsx                # Responsive grid with skeleton states
│   ├── navigation.tsx          # Sticky header with nav + search
│   ├── hero.tsx                # Landing page hero section
│   ├── footer.tsx              # Site footer
│   ├── page-header.tsx         # Page headers with library legend
│   ├── search-provider.tsx     # Search context provider
│   └── [various badges/info]   # content-type-badge, library-badge, contributor-info, etc.
├── lib/                        # Services and utilities
│   ├── types/content.ts        # TypeScript interfaces and union types
│   ├── formatter/              # Date, git, slug formatting utilities
│   ├── {agents,hooks,powers,prompts,steering}.ts  # Data loading services
│   ├── library.ts              # Unified content aggregation (getAllContent, getLatestContent)
│   ├── libraries.ts            # Library metadata, stats, .gitmodules parsing
│   ├── search.ts               # Search utilities and validation
│   ├── analytics.ts            # PostHog analytics
│   └── utils.ts                # cn() utility
├── libraries/                  # Git submodules (content sources)
│   ├── kiro-powers/            # Official Kiro powers
│   ├── promptz/                # Community prompts, agents, hooks, steering
│   ├── kiro-best-practices/    # AWS Hero best practices
│   ├── product-teams/          # Product team resources
│   └── genai-startups/         # GenAI startup resources
├── scripts/                    # Build-time scripts
│   ├── generate-library-data.ts # Main data generation (runs as prebuild)
│   ├── build-search-index.ts   # Search index generation
│   ├── library-file-parser.ts  # File system parsing
│   ├── metadata-extractor.ts   # Content metadata extraction
│   └── git-extractor.ts        # Git history extraction
├── data/                       # Generated JSON (build output, gitignored)
├── __tests__/unit/             # Jest tests mirroring source structure
├── __mocks__/data/             # Mock JSON data for tests
└── public/                     # Static assets
```

## Conventions

- `components/ui/` is shadcn-generated — use `npx shadcn@latest add <component>`, don't edit manually
- Components are flat in `components/` — no nested feature folders (enforced by ESLint banned imports)
- All content pages follow the same pattern: `page.tsx` for listing, `[id]/page.tsx` for detail
- Data services in `lib/` load from pre-generated JSON in `data/`
- Static pages (contribute, faq, privacy) use MDX with dedicated layouts
- `@/` import alias maps to project root (not `src/`)
- File naming: kebab-case for files, PascalCase for component names
- No `utils/`, `helpers/`, `common/`, `shared/`, or `core/` directories (ESLint enforced)
