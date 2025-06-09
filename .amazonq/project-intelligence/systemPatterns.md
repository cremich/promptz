# System Patterns: Akkodis Prompt Hub

## Architecture Overview

Akkodis Prompt Hub follows a modern serverless architecture built on AWS Amplify Gen 2 and Next.js. The system is designed with a clear separation of concerns, following the principles of the Next.js App Router pattern combined with AWS serverless services.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js App    │────▶│  AWS AppSync    │────▶│    DynamoDB     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       ▲                       ▲
        │                       │                       │
        ▼                       │                       │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Amazon Cognito │────▶│  AWS Lambda     │────▶│  Other AWS      │
│                 │     │  Functions      │     │  Services       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Design Patterns

### 1. Server Components with Client Islands

- **Pattern**: Next.js server components for most UI rendering with client components ("islands") only where interactivity is needed
- **Implementation**: App directory structure with React Server Components as the default, with explicit "use client" directives only where necessary
- **Benefits**: Improved performance, reduced client-side JavaScript, better SEO

### 2. Server Actions for Data Mutations

- **Pattern**: Next.js server actions for form submissions and data mutations
- **Implementation**: Actions defined in `/lib/actions` directory, imported and used in form components
- **Benefits**: Secure data handling, reduced client-side code, simplified state management

### 3. AppSync JavaScript Resolvers

- **Pattern**: Custom business logic in AppSync JavaScript resolvers
- **Implementation**: JavaScript handlers in `/amplify/data/handler` directory
- **Benefits**: Centralized business logic, reduced Lambda cold starts, simplified data operations

### 4. Repository Pattern for Data Access

- **Pattern**: Abstracted data access through dedicated action modules
- **Implementation**: Action files in `/lib/actions` directory that handle specific data operations
- **Benefits**: Separation of concerns, testability, consistent error handling

### 5. Form Schema Validation

- **Pattern**: Zod schemas for form validation on both client and server
- **Implementation**: Schema definitions in `/lib/forms/schema-definitions.ts`
- **Benefits**: Type safety, consistent validation, improved developer experience

## Component Relationships

### Authentication Flow

1. User initiates login/signup through UI components in `/components/auth`
2. Auth actions in `/lib/actions` communicate with Cognito via Amplify client
3. Post-authentication Lambda triggers handle additional logic
4. Authenticated user state is managed through Amplify authentication hooks

### Prompt Management Flow

1. User creates/edits prompts through form components in `/components/forms`
2. Form submissions are handled by server actions in `/lib/actions`
3. Data is validated using Zod schemas from `/lib/forms/schema-definitions.ts`
4. AppSync resolvers process the data and store it in DynamoDB
5. Custom JavaScript handlers in `/amplify/data/handler` implement business logic

### Search and Discovery Flow

1. User interacts with search components in `/components/search`
2. Search queries are processed by server actions in `/lib/actions`
3. AppSync resolvers with custom JavaScript handlers perform the search operations
4. Results are rendered through server components with pagination support

## Data Models

### Prompt Model

- Core entity representing a prompt for an LLM or AI agent tool
- Contains title, description, content, tags, and metadata
- Tracks popularity through copy and download counts
- Associated with a user (owner)

### Project Rule Model

- Represents a set of guidelines for using an AI coding agent in a project
- Contains name, description, content, tags, and metadata
- Tracks popularity similar to prompts
- Associated with a user (owner)

### User Model

- Represents an authenticated user of the platform
- Contains profile information and authentication details
- Associated with created prompts and project rules

## State Management

- Authentication state managed through Amplify authentication hooks
- Form state managed through React Hook Form
- Server-side state primarily handled through server components and actions
- Minimal client-side state for UI interactions

## Error Handling

- Form validation errors handled through Zod schemas
- Server errors captured and displayed through error boundaries
- User-friendly error messages with appropriate guidance
- Consistent error handling patterns across server actions

## Security Patterns

- Authentication through Amazon Cognito
- Authorization rules defined in Amplify data models
- Input validation on both client and server
- Secure handling of user data and content
