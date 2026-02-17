# Tech Stack

## Core

- **Next.js 16.1.1** — App Router, React Server Components, Cache Components enabled, MDX support
- **React 19.2.3** — Server components by default
- **TypeScript 5** — Strict mode, `@/` path alias maps to project root
- **Tailwind CSS 4** — PostCSS integration, dark mode first
- **Shadcn UI** — New York style, Radix primitives, lucide-react icons

## Content Pipeline

- **Git submodules** — 5 libraries in `libraries/` directory
- **Build-time generation** — `scripts/generate-library-data.ts` runs as prebuild, outputs JSON to `data/`
- **gray-matter** — YAML frontmatter parsing
- **simple-git** — Git history extraction for author attribution and dates
- **Fuse.js** — Client-side fuzzy search across all content types

## Testing

- **Jest 30** + React Testing Library + jsdom
- **fast-check** — Property-based testing
- Coverage thresholds: 80% global, 90% for `lib/`
- Coverage excludes `components/ui/`, `components/animations/`, `lib/types/`
- Tests in `__tests__/unit/` mirroring source structure
- Mock data in `__mocks__/data/` for JSON data files

## Code Quality

- **ESLint 9** — flat config (`eslint.config.mjs`), next + typescript + prettier
- **Prettier 3.7.4** — runs via lint-staged on commit
- **Husky** — git hooks for pre-commit formatting
- Custom ESLint rules: max-lines 400, max-depth 3, complexity 12
- Banned import patterns: `*/utils/*`, `*/helpers/*`, `*/common/*`, `*/shared/*`, `*/core/*`

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Generate data + production build |
| `npm run lint` | ESLint |
| `npm test` | Jest (single run) |
| `npm run test:watch` | Jest watch mode |
| `npm run test:coverage` | Jest with coverage report |

## Key Config Files

- `next.config.ts` — MDX, cacheComponents, redirects
- `eslint.config.mjs` — Flat ESLint config
- `jest.config.ts` — Coverage thresholds, module mapping
- `tsconfig.json` — Strict, `@/` alias to root
- `.gitmodules` — 5 content library submodules
