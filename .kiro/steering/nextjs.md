---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,ts,jsx,js}"
---

# Next.js 16 Framework Standards

## App Router Architecture

- Use Next.js App Router exclusively for all routing and page structure
- Context: App Router provides better performance, streaming, and developer experience compared to Pages Router
- Organize routes using file-system based routing in the `app/` directory
- Context: File-system routing reduces configuration overhead and makes route structure immediately visible
- Create `page.tsx` files for route endpoints that render UI
- Create `layout.tsx` files for shared UI that persists across route segments
- Use `loading.tsx` files for loading UI that shows while page content loads
- Use `error.tsx` files for error boundaries that catch and display errors
- Use `not-found.tsx` files for custom 404 pages
- Context: Special file conventions provide automatic functionality without additional configuration
- Implement nested layouts to share UI between route segments
- Place shared navigation, headers, and sidebars in appropriate layout files
- Context: Nested layouts prevent unnecessary re-renders and improve user experience during navigation

## Server vs Client Components

- Use Server Components by default for all new components
- Context: Server Components reduce JavaScript bundle size, improve initial page load, and enable direct database access
- Use Server Components for static content, layouts, and data fetching
- Perform database queries and API calls directly in Server Components
- Access environment variables and secrets safely in Server Components
- Context: Server Components run on the server, keeping sensitive data secure and reducing client-side JavaScript
- Add `'use client'` directive only when component needs browser-specific features
- Use Client Components for interactive elements requiring state or event handlers
- Use Client Components for browser APIs (localStorage, geolocation, File API)
- Use Client Components for third-party libraries that require browser environment
- Context: Client Components add JavaScript to the bundle, so use them sparingly
- Pass Server Components as children to Client Components for optimal performance
- Avoid importing Server Components directly into Client Components
- Context: This pattern allows Server Components to remain on the server while enabling client-side interactivity

## Data Fetching and Caching

- Use native `fetch()` API for all data fetching in Server Components
- Set appropriate cache options based on data freshness requirements
- Use `{ cache: 'force-cache' }` for static data (default behavior)
- Use `{ cache: 'no-store' }` for dynamic data that changes frequently
- Use `{ next: { revalidate: 60 } }` for data that should refresh periodically
- Context: Next.js extends fetch with caching capabilities that work across server and client
- Enable Cache Components in `next.config.js` with `cacheComponents: true`
- Use `'use cache'` directive to explicitly mark components for caching
- Context: Cache Components provide predictable caching behavior and eliminate confusion about what gets cached
- Add `'use cache'` at the top of components that should be cached
- Pass runtime data (cookies, headers, searchParams) as props to cached components
- Avoid accessing runtime APIs directly inside cached components
- Context: Explicit caching makes behavior predictable and improves performance
- Use `cacheTag` to tag cached content for targeted invalidation
- Use `revalidateTag` to invalidate specific cache entries
- Use `cacheLife` to customize cache duration beyond defaults
- Context: Granular cache control enables fresh data when needed while maintaining performance
- Fetch data at the page level and pass to child components as props
- Avoid fetching data in nested components unless absolutely necessary
- Use parallel data fetching with Promise.all() for independent requests
- Context: Page-level fetching enables better caching and reduces request waterfalls

## Performance Optimization

- Leverage Turbopack's file system caching for faster subsequent starts
- Context: Turbopack provides 2-5x faster builds and up to 10x faster Fast Refresh (enabled by default in Next.js 16)
- Use dynamic imports with `next/dynamic` for code splitting
- Implement lazy loading for components below the fold
- Optimize images with `next/image` component for automatic optimization
- Context: Code splitting and lazy loading reduce initial bundle size and improve Core Web Vitals
- Use React Suspense boundaries for progressive loading
- Implement streaming with `loading.tsx` files for better perceived performance
- Wrap slow components in Suspense with meaningful fallback UI
- Context: Streaming allows users to see content as it loads rather than waiting for complete page

## TypeScript Integration

- Enable strict TypeScript configuration for maximum type safety
- Define interfaces for all component props and function parameters
- Use TypeScript's built-in utility types (Partial, Pick, Omit) when appropriate
- Context: Strict typing catches errors at compile time and improves developer experience
- Create shared type definitions in `types/` directory
- Export types from a central `types/index.ts` file
- Use generic types for reusable components and functions
- Context: Centralized types improve maintainability and prevent duplication

## Error Handling and Boundaries

- Implement error boundaries with `error.tsx` files at appropriate route levels
- Create custom error components that provide helpful error messages
- Log errors to monitoring services for production debugging
- Context: Error boundaries prevent entire application crashes and provide better user experience
- Implement retry mechanisms for transient errors
- Provide clear error messages with actionable next steps
- Use error boundaries to isolate failures to specific route segments
- Context: Graceful error handling maintains application stability and user trust

## Security Best Practices

- Keep sensitive operations and data access in Server Components
- Validate all inputs in Server Actions before processing
- Use environment variables for API keys and secrets
- Context: Server-side execution protects sensitive data from client exposure
- Sanitize user inputs before rendering in Client Components
- Implement proper authentication checks before accessing protected routes
- Use HTTPS-only cookies for session management
- Context: Client-side security prevents XSS attacks and protects user data

## Development Workflow

- Group related components in feature-based directories
- Use consistent naming conventions (kebab-case for files, PascalCase for components)
- Separate concerns with dedicated directories for types, utils, and constants
- Context: Consistent organization improves code discoverability and team collaboration
- Use ESLint and Prettier for consistent code formatting
- Implement pre-commit hooks to enforce code quality standards
- Write descriptive commit messages following conventional commit format
- Context: Automated quality checks prevent bugs and maintain consistent codebase

## Migration Considerations

- Migrate incrementally by moving routes one at a time to App Router
- Update data fetching from getServerSideProps/getStaticProps to Server Components
- Convert _app.tsx and _document.tsx to layout.tsx files
- Context: Incremental migration reduces risk and allows gradual adoption of new patterns
- Update import paths for moved Next.js APIs
- Replace deprecated APIs with their App Router equivalents
- Test thoroughly after migration to ensure functionality is preserved
- Context: Next.js 16 introduces breaking changes that require careful migration planning