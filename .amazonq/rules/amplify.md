# AWS Amplify Gen 2 Guidelines

## General Principles

- Use AWS Amplify Gen 2 with TypeScript for all backend configurations
- Follow modular architecture with separate resource files for different concerns
- Use environment-based configuration to differentiate between sandbox and production environments
- Implement proper error handling and monitoring across all resources
- Follow AWS CDK best practices for infrastructure as code
- Do not unit test Amplify related infrastructure components

## Project Structure

### Backend Organization

```
amplify/
├── backend.ts              # Main backend definition and resource orchestration
├── package.json            # ES module configuration
├── tsconfig.json           # TypeScript configuration with path aliases
├── auth/                   # Authentication configuration
│   ├── resource.ts         # Auth resource definition
│   ├── email-templates.ts  # Custom email templates
│   └── post-authentication/# Post-auth Lambda trigger
├── data/                   # GraphQL API and data layer
│   ├── resource.ts         # Data resource definition
│   ├── definitions.ts      # Common schema definitions
│   ├── models/            # Individual data models
│   ├── queries.ts         # Custom query definitions
│   ├── mutations.ts       # Custom mutation definitions
│   └── resolver/          # Custom AppSync resolvers
├── functions/             # Lambda functions
├── cognito/              # Cognito-specific configurations
├── dynamodb/             # DynamoDB-specific configurations
├── eventbridge/          # EventBridge configurations
└── monitoring/           # Monitoring and observability
```

## Configuration Patterns

### Environment-Based Configuration

- Use `process.env["PROMPTZ_ENV"]` to differentiate between sandbox and production
- Sandbox environment should disable certain features like SES, social providers, and deletion protection
- Production environment should enable all security and monitoring features

```typescript
const getSenders = () => {
  return process.env["PROMPTZ_ENV"] === "sandbox"
    ? undefined
    : {
        email: {
          fromEmail: "noreply@promptz.dev",
        },
      };
};
```

### Backend Definition

- Use `defineBackend()` to register core resources (auth, data, functions)
- Apply additional configurations through separate configuration functions
- Keep the main backend.ts file clean and focused on resource orchestration

```typescript
const backend = defineBackend({
  auth,
  data,
  tagRelationsFunction,
});

configureCognito(backend);
configureDynamoDB(backend);
configureMonitoring(backend);
configureEventBridge(backend);
```

## Data Layer Configuration

### Schema Organization

- Organize models in separate files by domain (user, prompts, rules, tags, search)
- Use common attribute definitions to ensure consistency across models
- Implement proper relationships using `belongsTo` and `hasMany`

### Model Patterns

- Use composite identifiers for junction tables (e.g., `[promptId, tagName]`)
- Implement secondary indexes for common query patterns
- Disable unnecessary operations (subscriptions, mutations) where appropriate
- Use consistent authorization patterns across all models

```typescript
export const promptModel = {
  prompt: a
    .model({
      ...commonContentAttributes,
      content: a.string().required(),
      linkedTags: a.hasMany("promptTag", "promptId"),
    })
    .secondaryIndexes((index) => [
      index("slug").queryField("listPromptBySlug").name("slugIndex"),
      index("name").queryField("listPromptByName").name("nameIndex"),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),
};
```

### Authorization Strategy

- Use API Key for public read access to enable unauthenticated browsing
- Require authentication for write operations

### Custom Resolvers

- Use JavaScript resolvers for complex business logic
- Implement proper error handling and validation
- Use utility functions for common operations (slugify, search)
- Follow AppSync resolver best practices for performance

### Custom Mutations and Queries

- Create factory functions for common mutation patterns (save, delete, increment)
- Implement pipeline resolvers for complex operations
- Use EventBridge integration to put domain events within mutations on the eventbus

## Function Configuration

### Lambda Function Setup

- Use ARM64 architecture for better performance
- Set appropriate memory allocation based on function complexity
- Configure environment variables for PowerTools integration
- Use resource groups for logical organization

```typescript
export const tagRelationsFunction = defineFunction({
  name: "tag-relations",
  resourceGroupName: "data",
  memoryMB: 512,
  environment: {
    POWERTOOLS_SERVICE_NAME: "tag-relations-cdc",
    POWERTOOLS_LOG_LEVEL: "INFO",
    POWERTOOLS_LOGGER_SAMPLE_RATE: "0.1",
  },
});
```

### Function Implementation

- Use AWS Lambda PowerTools for logging, metrics, and tracing
- Use AWS SDK v3 with proper error handling

## TypeScript Configuration

### Module System

- Use ES modules (`"type": "module"`) for modern JavaScript support
- Configure TypeScript for ES2022 target with bundler module resolution
- Use path aliases for clean import statements (`$amplify/*`)
- Enable strict TypeScript checking for better code quality

### Type Safety

- Export proper TypeScript types from schema definitions
- Use ClientSchema type for frontend integration
- Implement proper typing for custom resolvers and functions

## Best Practices

### CDK

#### Construct Hierarchy

- Use L1 constructs only when L2 or L3 constructs are not available for a specific resource
- Use L2 constructs as the default choice for most resources

#### Construct Naming Conventions

- Use logical IDs that describe the resource's purpose
- Avoid using generic names like "Bucket" or "Function"
- Include the resource type in the logical ID
- Use descriptive property names
- Use generated resource names instead of physical names whenever possible.

#### Escape Hatches

- Use escape hatches only when necessary
- Use them to access features not yet available in higher-level constructs
- Document why the escape hatch is needed
- Use `node.defaultChild` to access the underlying L1 construct
- Cast to the appropriate type using `as`
- Set properties directly on the L1 construct

### Security

- Never expose sensitive configuration in sandbox environments
- Use AWS Secrets Manager for external provider credentials
- Implement proper CORS and authorization policies
- Follow principle of least privilege for IAM permissions

### Performance

- Use secondary indexes strategically for query optimization
- Implement proper pagination for large result sets
- Configure appropriate batch sizes for stream processing
- Use ARM64 architecture for Lambda functions

### Maintainability

- Keep configuration functions focused and single-purpose
- Use factory patterns for repetitive configurations
- Document complex business logic in resolvers
- Maintain consistent naming conventions across resources

### Error Handling

- Implement proper error handling in custom resolvers
- Use partial batch failure reporting for stream processing
- Configure appropriate retry policies and timeouts
- Log errors appropriately for debugging and monitoring
