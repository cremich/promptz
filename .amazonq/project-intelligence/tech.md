# Technology Stack and Project Structure

## Technology Stack

### Frontend Framework

- **Next.js 15.3.5**: React framework with App Router for server-side rendering, routing, and full-stack capabilities
- **React 19.1.0**: Component-based UI library with latest features including concurrent rendering
- **TypeScript 5.6.3**: Type-safe development with strict type checking and enhanced developer experience

### Styling and UI Components

- **Tailwind CSS 4.1.5**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality React component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible components for building design systems
- **Lucide React 0.525.0**: Beautiful and consistent icon library
- **Tailwind CSS Animate**: Animation utilities for Tailwind CSS
- **Class Variance Authority**: Utility for creating type-safe component variants

### Backend and Infrastructure

- **AWS Amplify Gen 2**: Full-stack development platform with backend-as-code
- **AWS AppSync**: Managed GraphQL API service with real-time capabilities and pipeline resolvers
- **Amazon Cognito**: User authentication and authorization service
- **Amazon DynamoDB**: NoSQL database for scalable data storage with streams for CDC
- **Amazon EventBridge**: Custom event bus for domain event publishing and messaging
- **AWS Lambda**: Serverless compute for business logic, custom resolvers, and stream processing
- **Amazon SES**: Email service for notifications (production environment)

### Development Tools

- **ESLint 9.25.1**: Code linting with Next.js configuration
- **Prettier 3.6.2**: Code formatting for consistent style
- **Husky 9.1.7**: Git hooks for code quality enforcement
- **Commitlint**: Conventional commit message enforcement
- **Lint-staged**: Run linters on staged files

### Testing Framework

- **Jest 30.0.4**: Unit testing framework with jsdom environment
- **Playwright 1.52.0**: End-to-end testing with browser automation
- **Testing Library**: React component testing utilities
- **MailSlurp**: Email testing service for authentication flows

### Form Handling and Validation

- **React Hook Form 7.56.1**: Performant forms with minimal re-renders
- **Zod 3.24.3**: TypeScript-first schema validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Utilities and Libraries

- **UUID 11.1.0**: Unique identifier generation
- **Sonner 2.0.3**: Toast notifications
- **Next Themes 0.4.6**: Theme management for dark/light mode
- **Tailwind Merge 3.2.0**: Utility for merging Tailwind CSS classes
- **CLSX 2.1.1**: Conditional class name utility

## Project Structure

```
promptz/
├── .amazonq/                    # Amazon Q Developer configuration
│   ├── hooks/                   # Context hooks for Q CLI
│   ├── project-intelligence/    # Project documentation
│   ├── cli-agents/              # CLI agent configurations
│   └── rules/                   # Project rules for coding standards
├── .amplify/                    # Amplify generated files
├── .github/                     # GitHub workflows and templates
├── .husky/                      # Git hooks configuration
├── .next/                       # Next.js build output
├── .playwright/                 # Playwright test configuration
├── __tests__/                   # Unit tests
│   ├── app/                     # App-level tests
│   ├── components/              # Component tests
│   └── lib/                     # Library function tests
├── amplify/                     # Amplify backend configuration
│   ├── auth/                    # Authentication configuration
│   ├── cognito/                 # Cognito-specific configurations
│   ├── data/                    # GraphQL schema and resolvers
│   │   ├── models/              # Data model definitions
│   │   ├── resolver/            # Custom JavaScript resolvers
│   │   ├── mutations.ts         # Pipeline mutation definitions
│   │   └── resource.ts          # Data resource configuration
│   ├── dynamodb/                # DynamoDB configuration and streams
│   ├── eventbridge/             # EventBridge event bus configuration
│   ├── functions/               # Lambda functions
│   ├── monitoring/              # Monitoring and observability
│   └── backend.ts               # Backend configuration
├── app/                         # Next.js App Router pages
│   ├── (auth)/                  # Authentication pages
│   ├── mcp/                     # MCP integration page
│   ├── prompts/                 # Prompt-related pages
│   ├── rules/                   # Project rules pages
│   ├── tag/                     # Tag-based browsing
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── robots.ts                # SEO robots configuration
│   └── sitemap.ts               # Dynamic sitemap generation
├── components/                  # React components
│   ├── auth/                    # Authentication components
│   ├── benefits/                # Feature benefit components
│   ├── common/                  # Shared components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   ├── prompt/                  # Prompt-specific components
│   ├── rules/                   # Project rule components
│   ├── search/                  # Search functionality
│   ├── tags/                    # Tag management components
│   └── ui/                      # shadcn/ui components
├── e2e-tests/                   # End-to-end tests
│   ├── authentication/          # Auth flow tests
│   ├── helpers/                 # Test utilities
│   ├── prompts/                 # Prompt feature tests
│   └── rules/                   # Project rule tests
├── lib/                         # Utility libraries
│   ├── actions/                 # Server actions
│   ├── forms/                   # Form schemas and validation
│   ├── models/                  # Data models and types
│   ├── sitemap/                 # SEO utilities
│   └── utils.ts                 # Shared utilities
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   └── favicon files            # Favicon variants
├── scripts/                     # Utility scripts
│   ├── migrate_tag_relationships.js
│   ├── seed_tags.js
│   ├── update_scope.js          # Scope attribute migration
│   └── update_owner_attribute.js
└── configuration files          # Various config files
```

## Key Dependencies

### Production Dependencies

```json
{
  "@aws-amplify/adapter-nextjs": "1.6.6",
  "@hookform/resolvers": "^5.0.1",
  "@radix-ui/react-*": "Various versions",
  "aws-amplify": "^6.14.4",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "lucide-react": "^0.525.0",
  "next": "15.3.5",
  "next-themes": "^0.4.6",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-hook-form": "^7.56.1",
  "sonner": "^2.0.3",
  "tailwind-merge": "^3.2.0",
  "tailwindcss-animate": "^1.0.7",
  "uuid": "^11.1.0",
  "zod": "^3.24.3"
}
```

### Development Dependencies

```json
{
  "@aws-amplify/backend": "^1.16.0",
  "@aws-amplify/backend-cli": "^1.7.0",
  "@aws-lambda-powertools/batch": "^2.22.0",
  "@aws-lambda-powertools/logger": "^2.22.0",
  "@playwright/test": "^1.52.0",
  "@tailwindcss/postcss": "^4.1.5",
  "@testing-library/react": "^16.3.0",
  "@types/node": "^22.16.0",
  "aws-cdk": "^2.1013.0",
  "aws-cdk-lib": "^2.194.0",
  "eslint": "^9.25.1",
  "eslint-config-next": "15.3.5",
  "jest": "^30.0.4",
  "mailslurp-client": "^15.22.1",
  "prettier": "3.6.2",
  "tailwindcss": "^4.1.5",
  "typescript": "^5.6.3"
}
```

## Development Workflow

### Environment Setup

1. **Node.js Requirements**: v14.x or later
2. **Package Manager**: npm v6.14.4 or later
3. **AWS Configuration**: Local AWS credentials for Amplify deployment
4. **Environment Variables**: PROMPTZ_ENV for environment-specific configuration

### Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Code quality checks
npm run lint
npm run test
npm run pr  # Combined lint and test

# End-to-end testing
npm run e2e

# Sandbox deployment
npm run sandbox
```

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality enforcement
- **Commitlint**: Conventional commit message format

### Testing Strategy

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: Component and API integration testing
- **E2E Tests**: Playwright for full user journey testing
- **Authentication Testing**: MailSlurp for email-based auth flows

## Build and Deployment

### Build Process

- **Next.js Build**: Static generation and server-side rendering
- **TypeScript Compilation**: Type checking and JavaScript generation
- **Asset Optimization**: Image optimization and bundle splitting
- **CSS Processing**: Tailwind CSS compilation and optimization

### Deployment Environments

- **Sandbox**: Development environment with relaxed security
- **Production**: Full security, monitoring, and backup enabled
- **Environment Detection**: PROMPTZ_ENV variable controls configuration

### Infrastructure as Code

- **Amplify Backend**: Declarative backend configuration
- **AWS CDK**: Custom resources and advanced configurations
- **Environment-specific**: Different configurations for sandbox vs production

## Performance Optimizations

### Frontend Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Tree shaking and dead code elimination
- **Caching**: Static asset caching and API response caching

### Backend Optimizations

- **DynamoDB**: Optimized access patterns and indexing
- **Lambda**: Cold start optimization and memory tuning
- **AppSync**: Query optimization and caching strategies
- **CDN**: CloudFront distribution for global performance
