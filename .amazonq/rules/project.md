# Promptz Project Intelligence

## Coding Patterns

### File Organization

- Next.js App Router structure is used with app/ directory containing all routes
- UI components are organized in app/ui/ with subdirectories by feature
- Shared components are in components/ui/
- Tests are co-located with components in **tests** directories
- Amplify configuration is in amplify/ directory

### Naming Conventions

- React components use kebap-case (e.g., prompt-card.tsx)
- Utility functions and files use kebab-case (e.g., error-message.tsx)
- Test files are named after the component with .test.tsx suffix
- Server actions are in app/lib/actions/ directory

### Component Structure

- UI components are organized by feature (auth, prompts, navigation)
- Components use TypeScript for type safety
- Form components use React Hook Form with Zod validation
- Components have corresponding test files with snapshots

### Styling Approach

- Tailwind CSS is used for styling
- Class names use tailwind-merge for conditional styling
- Dark mode support via next-themes
- Custom UI components built on Radix UI primitives

## Development Workflow

### Local Development

- Use `npm run dev` to start the development server
- Changes to backend require `npm run sandbox` to deploy
- Tests are run with `npm run test`
- Pull requests should pass `npm run pr` (lint + tests)

### AWS Integration

- AWS credentials must be configured for Amplify
- Sandbox environment uses `PROMPTZ_ENV=sandbox` flag
- AppSync provides GraphQL API for data access
- DynamoDB is used for data storage

### Testing Strategy

- Jest and React Testing Library for component tests
- Snapshot tests for UI components
- Unit tests for utility functions
- Mock AWS services in tests

## User Experience Patterns

### Authentication Flow

- Login and signup forms with validation
- Error messages displayed inline with form fields
- Passwordless authentication flow with one-time passwords
- Protected routes redirect to login

### Prompt Management

- Prompts have title, description, instruction, and optional howto
- Tags categorize prompts by SDLC activity, interface, and category
- Editing is restricted to prompt owners
- Copy to clipboard functionality for prompt instructions
- Form validation using Zod schema ensures data quality
- Search functionality supports case-insensitive text search across name and description
- Filtering system allows filtering by tags, categories, SDLC activities, and interfaces

### Navigation

- Top navigation with authentication state awareness
- Mobile menu for responsive design
- User menu for authenticated users
- Theme toggle for light/dark mode

## Project Preferences

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer server components where possible
- Use server actions for data mutations

### Documentation

- Code should be self-documenting with clear naming
- Complex logic should have comments explaining the approach
- Tests serve as documentation for component behavior
- README provides project overview and setup instructions

### Performance Considerations

- Optimize component rendering with proper React patterns
- Use server components for data fetching where possible
- Minimize client-side JavaScript
- Optimize images and assets
- Optimize for search engines
