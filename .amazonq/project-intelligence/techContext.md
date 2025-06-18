# Technical Context: Promptz

## Technology Stack

### Frontend

- **Next.js 15.3.1**: React framework with App Router for server and client components
- **React 19.1.0**: UI library for component-based development
- **Tailwind CSS 4.1.5**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives
- **TypeScript 5.6.3**: Typed JavaScript for improved developer experience
- **React Hook Form 7.56.1**: Form state management and validation
- **Zod 3.24.3**: Schema validation library

### Backend

- **AWS Amplify Gen 2**: Full-stack development framework for AWS
- **Amazon Cognito**: User authentication and management
- **AWS AppSync**: GraphQL API service with real-time data synchronization
- **Amazon DynamoDB**: NoSQL database for data storage
- **AWS Lambda**: Serverless compute for custom logic
- **Amazon SES**: Email service for notifications

### Development Tools

- **Jest 29.7.0**: Testing framework
- **Playwright 1.52.0**: End-to-end testing
- **ESLint 9.25.1**: Code linting
- **Prettier 3.5.3**: Code formatting
- **Husky 9.1.7**: Git hooks for code quality
- **Commitizen**: Standardized commit messages

### Planned Integrations

- **Anthropic Tokenizer**: For token calculation of prompts and project rules
- **Model Context Protocol (MCP)**: For integration with AI assistants
- **GitHub API**: For collaborative updates and publishing

## Development Environment Setup

### Prerequisites

- Node.js v14.x or later
- npm v6.14.4 or later
- git v2.14.1 or later
- AWS account with appropriate permissions

### Local Development

1. Clone the repository
2. Install dependencies with `npm i`
3. Configure AWS credentials for Amplify
4. Deploy sandbox environment with `npm run sandbox`
5. Start local development server with `npm run dev`

### Environment Variables

- `PROMPTZ_ENV`: Controls environment-specific configurations (e.g., `sandbox`)

## Project Structure

### Key Directories

- `/app`: Next.js App Router pages and layouts
- `/components`: React components organized by feature
- `/lib`: Utility functions, server actions, and data models
- `/amplify`: AWS Amplify configuration and backend resources
- `/__tests__`: Test files mirroring the source directory structure

### Code Organization

- **Feature-based**: Components and functionality organized by feature area
- **Clear separation**: UI components, server actions, and data models kept separate
- **Consistent naming**: PascalCase for components, kebab-case for files

## Data Models and Schema

### Prompt Schema

```typescript
// Simplified representation
interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  owner: string;
  ownerName: string;
  copyCount: number;
  downloadCount: number;
  sourceURL?: string; // Added for attribution of external sources
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string; // Added for SEO-friendly URLs
}
```

### Project Rule Schema

```typescript
// Simplified representation
interface ProjectRule {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  owner: string;
  ownerName: string;
  copyCount: number;
  downloadCount: number;
  sourceURL?: string; // Added for attribution of external sources
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string; // Added for SEO-friendly URLs
}
```

### Planned Tag Schema (Issue #93)

```typescript
// Simplified representation
interface Tag {
  id: string; // Same as name for backward compatibility
  name: string;
  promptCount: number;
  ruleCount: number;
  createdAt: string;
  updatedAt: string;
}

// Many-to-many relationships
interface PromptTag {
  promptId: string;
  tagId: string;
}

interface RuleTag {
  ruleId: string;
  tagId: string;
}
```

### User Schema

```typescript
// Simplified representation
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

## API and Data Flow

### GraphQL API

- AppSync provides GraphQL API for data operations
- Custom JavaScript resolvers handle business logic
- Authentication and authorization integrated with Cognito

### Server Actions

- Next.js server actions handle form submissions and data mutations
- Actions communicate with AppSync for data operations
- Zod schemas validate input data

## Planned Technical Implementations

### Token Calculation (Issue #102)

- Integration with Anthropic TypeScript Tokenizer
- Token calculation for prompts and project rules
- Display of token count on prompt and rule detail pages
- Consideration of context window limits

### Sitemap Generation (Issue #103)

- Separate sitemap files for prompts and project rules
- Sitemap index file referencing individual sitemaps
- Dynamic generation based on public prompts and rules
- SEO optimization for better discoverability

### MCP Server Integration (Issue #100)

- Catalog of compatible MCP servers
- Documentation for integration with Amazon Q Developer
- Filtering by use case and vendor
- Prerequisites documentation for using prompts with MCP servers

### Context Hooks Support (Issue #101)

- Repository of context hook commands
- Documentation for using context hooks with Amazon Q CLI
- Categorization by use case and functionality
- Examples and best practices

### Prompt Engineering Frameworks (Issue #104)

- Support for RISEN, RODES, and RTF frameworks
- Templates for structured prompt engineering
- Documentation and examples for each framework
- Pre-filling prompts with framework templates

## Testing Strategy

### Unit Testing

- Jest for component and utility function testing
- React Testing Library for component interaction testing
- Tests located in `/__tests__` directory mirroring source structure

### End-to-End Testing

- Playwright for browser-based end-to-end testing
- Tests cover critical user flows like authentication, prompt creation, and search

## Deployment and CI/CD

### Environments

- Development: Local development environment
- Sandbox: Isolated testing environment with simplified configuration
- Production: Live environment with full configuration

### CI/CD Pipeline

- GitHub Actions for continuous integration
- Automated testing on pull requests
- Deployment to AWS Amplify hosting

## Technical Constraints

### AWS Integration

- Must use AWS services for backend functionality
- Must follow AWS best practices for security and scalability

### Performance Requirements

- Fast page loads and interactions
- Efficient search functionality
- Responsive design for all device sizes

### Security Requirements

- Secure authentication with Cognito
- Data validation on both client and server
- Protection against common web vulnerabilities

## Dependencies and Third-Party Services

### Core Dependencies

- AWS Amplify for backend services
- Next.js for frontend framework
- Shadcn UI and Tailwind for UI components

### Development Dependencies

- Testing frameworks (Jest, Playwright)
- Code quality tools (ESLint, Prettier)
- Build tools (TypeScript, SWC)

### Planned Dependencies

- Anthropic TypeScript Tokenizer for token calculation
- GitHub API for collaborative updates
- MCP server integration libraries
