# Data Model Documentation

This document provides an overview of the data models and schema used in the Akkodis Prompt Hub application. The application uses AWS Amplify for data management with GraphQL API.

## Overview

The Akkodis Prompt Hub application is designed to manage and share prompts and project rules. It allows users to create, search, and interact with these resources. The data model consists of several key entities:

- **User**: Represents application users
- **Prompt**: Represents instruction prompts that users can create and share
- **ProjectRule**: Represents project rules that users can create and share
- **Custom Types**: Supporting types for search functionality

## Schema Definition

The schema is defined using AWS Amplify's schema definition language in `amplify/data/resource.ts`.

### Custom Types

#### SearchResult

A custom type used to represent search results for both prompts and project rules.

```typescript
searchResult: a.customType({
  id: a.id(),
  name: a.string(),
  tags: a.string().array(),
  slug: a.string(),
  description: a.string(),
  createdAt: a.string(),
  updatedAt: a.string(),
});
```

#### PaginatedSearchResult

A custom type used for paginated search results.

```typescript
paginatedSearchResult: a.customType({
  results: a.ref("searchResult").array(),
  nextToken: a.string(),
});
```

### Models

#### User Model

The User model represents application users with the following attributes:

```typescript
user: a.model({
  id: a
    .id()
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner().to(["read"]),
    ]),
  username: a.string(),
  email: a.string(),
  displayName: a
    .string()
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner().to(["read"]),
    ]),
  owner: a.string(),
  prompts: a
    .hasMany("prompt", "owner")
    .authorization((allow) => [allow.owner().to(["read"])]),
  projectRules: a
    .hasMany("projectRule", "owner")
    .authorization((allow) => [allow.owner().to(["read"])]),
});
```

**Key Features:**

- Users have a one-to-many relationship with both prompts and project rules
- Subscriptions, delete, and update operations are disabled
- Authorization rules ensure users can only read their own data

#### Prompt Model

The Prompt model represents instruction prompts with the following attributes:

```typescript
prompt: a.model({
  id: a.id().required(),
  name: a.string().required(),
  slug: a.string(),
  description: a.string().required(),
  tags: a.string().array(),
  instruction: a.string().required(),
  sourceURL: a.string(),
  howto: a.string(),
  public: a.boolean(),
  owner: a.string().required(),
  author: a
    .belongsTo("user", "owner")
    .authorization((allow) => [allow.publicApiKey().to(["read"])]),
  copyCount: a.integer().default(0),
});
```

**Key Features:**

- Each prompt belongs to a user (author)
- Secondary indexes on slug and name for efficient querying
- Public prompts can be read by anyone, but only owners can delete them
- Direct create, update, and list operations are disabled in favor of custom mutations

#### ProjectRule Model

The ProjectRule model represents project rules with the following attributes:

```typescript
projectRule: a.model({
  id: a.id().required(),
  name: a.string().required(),
  slug: a.string().required(),
  description: a.string(),
  content: a.string().required(),
  tags: a.string().array(),
  public: a.boolean(),
  sourceURL: a.string(),
  owner: a.string().required(),
  author: a
    .belongsTo("user", "owner")
    .authorization((allow) => [allow.publicApiKey().to(["read"])]),
  copyCount: a.integer().default(0),
  downloadCount: a.integer().default(0),
});
```

**Key Features:**

- Similar to prompts, each project rule belongs to a user
- Secondary indexes on slug and name for efficient querying
- Public rules can be read by anyone, but only owners can delete them
- Direct create, update, and list operations are disabled in favor of custom mutations

### Custom Mutations and Queries

The schema defines several custom mutations and queries to handle specific operations:

#### Prompt Operations

1. **savePrompt**: Creates or updates a prompt

   ```typescript
   savePrompt: a.mutation().arguments({
     id: a.id(),
     name: a.string().required(),
     description: a.string().required(),
     howto: a.string(),
     instruction: a.string().required(),
     tags: a.string().array(),
     public: a.boolean(),
     sourceURL: a.string(),
   });
   ```

2. **copyPrompt**: Increments the copy count for a prompt

   ```typescript
   copyPrompt: a.mutation().arguments({
     id: a.id(),
   });
   ```

3. **searchPrompts**: Searches for prompts based on query and tags
   ```typescript
   searchPrompts: a.query().arguments({
     query: a.string(),
     tags: a.string().array(),
     nextToken: a.string(),
   });
   ```

#### ProjectRule Operations

1. **saveProjectRule**: Creates or updates a project rule

   ```typescript
   saveProjectRule: a.mutation().arguments({
     id: a.id(),
     name: a.string().required(),
     description: a.string().required(),
     content: a.string().required(),
     tags: a.string().array(),
     public: a.boolean(),
     sourceURL: a.string(),
   });
   ```

2. **copyProjectRule**: Increments the copy count for a project rule

   ```typescript
   copyProjectRule: a.mutation().arguments({
     id: a.id(),
   });
   ```

3. **downloadProjectRule**: Increments the download count for a project rule

   ```typescript
   downloadProjectRule: a.mutation().arguments({
     id: a.id(),
   });
   ```

4. **searchProjectRules**: Searches for project rules based on query and tags
   ```typescript
   searchProjectRules: a.query().arguments({
     query: a.string(),
     tags: a.string().array(),
     nextToken: a.string(),
   });
   ```

## Authorization

The schema uses several authorization patterns:

1. **Owner-based authorization**: Users can only access their own data

   ```typescript
   allow.owner().to(["read", "delete"]);
   ```

2. **Public API key authorization**: Allows public read access to certain fields

   ```typescript
   allow.publicApiKey().to(["read"]);
   ```

3. **Authenticated user authorization**: Allows authenticated users to perform certain operations

   ```typescript
   allow.authenticated();
   ```

4. **Resource-based authorization**: Uses a post-authentication function for additional authorization logic
   ```typescript
   .authorization((allow) => [allow.resource(postAuthenticationFunction)])
   ```

## Custom Handlers

The schema uses custom handlers for various operations:

1. **savePrompt**: Custom handler for creating/updating prompts

   ```typescript
   a.handler.custom({
     dataSource: a.ref("prompt"),
     entry: "./handler/savePrompt.js",
   });
   ```

2. **incrementCopyCount**: Custom handler for incrementing copy counts

   ```typescript
   a.handler.custom({
     dataSource: a.ref("prompt"),
     entry: "./handler/incrementCopyCount.js",
   });
   ```

3. **search**: Custom handler for search operations
   ```typescript
   a.handler.custom({
     dataSource: a.ref("prompt"),
     entry: "./handler/search.js",
   });
   ```

## Relationships

The schema defines several relationships between models:

1. **User to Prompts**: One-to-many relationship

   ```typescript
   prompts: a.hasMany("prompt", "owner");
   ```

2. **User to ProjectRules**: One-to-many relationship

   ```typescript
   projectRules: a.hasMany("projectRule", "owner");
   ```

3. **Prompt to User**: Many-to-one relationship

   ```typescript
   author: a.belongsTo("user", "owner");
   ```

4. **ProjectRule to User**: Many-to-one relationship
   ```typescript
   author: a.belongsTo("user", "owner");
   ```

## Secondary Indexes

The schema defines secondary indexes for efficient querying:

1. **Prompt Indexes**:

   ```typescript
   .secondaryIndexes((index) => [
     index("slug").queryField("listBySlug").name("slugIndex"),
     index("name").queryField("listByName").name("nameIndex"),
   ])
   ```

2. **ProjectRule Indexes**:
   ```typescript
   .secondaryIndexes((index) => [
     index("slug").queryField("listRuleBySlug").name("slugIndex"),
     index("name").queryField("listRuleByName").name("nameIndex"),
   ])
   ```

## API Configuration

The API is configured with the following settings:

```typescript
export const data = defineData({
  schema,
  name: "akkodis-prompt-hub",
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 90 },
  },
});
```

This configuration:

- Names the API "akkodis-prompt-hub"
- Sets the default authorization mode to "apiKey"
- Configures API keys to expire after 90 days

## Frontend Model Implementation

The backend data models are represented in the frontend using TypeScript interfaces and Zod validation schemas in the `lib/models` directory. These models are used throughout the application for type safety, form validation, and data handling.

### User Model

Located in `lib/models/user-model.ts`, this model represents user data in the frontend:

```typescript
export type User = {
  id: string;
  username: string;
  displayName: string;
  guest: boolean;
};
```

The User model is simplified in the frontend compared to the backend schema, containing only the essential properties needed for UI rendering and user identification.

### Prompt Model

Located in `lib/models/prompt-model.ts`, this model defines the structure and validation for prompts:

```typescript
export type Prompt = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  instruction?: string;
  howto?: string;
  author?: string;
  authorId?: string;
  public?: boolean;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
  copyCount?: number;
  starCount?: number;
  popularityScore?: number;
};
```

The model includes Zod validation schemas for form handling:

```typescript
export const promptFormSchema = z.object({
  id: idSchema,
  sourceURL: sourceURLSchema,
  title: titleSchema,
  description: descriptionSchema,
  howto: z
    .string()
    .trim()
    .max(4000, "How to must be less than 4000 characters")
    .optional(),
  instruction: z
    .string()
    .trim()
    .min(10, "Prompt must be more than 10 characters")
    .max(4000, "Prompt must be less than 4000 characters"),
  tags: tagSchema,
  public: publicSchema,
});
```

Additionally, there's a schema for search parameters:

```typescript
export const promptSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
```

### ProjectRule Model

Located in `lib/models/project-rule-model.ts`, this model defines the structure and validation for project rules:

```typescript
export type ProjectRule = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  content?: string;
  author?: string;
  authorId?: string;
  public?: boolean;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
};
```

Similar to the Prompt model, it includes Zod validation schemas:

```typescript
export const projectRuleFormSchema = z.object({
  id: idSchema,
  sourceURL: sourceURLSchema,
  title: titleSchema,
  description: descriptionSchema,
  content: z
    .string()
    .trim()
    .min(10, "Content must be more than 10 characters")
    .max(30000, "Content must be less than 30000 characters"),
  tags: tagSchema,
  public: publicSchema,
});
```

And search parameters schema:

```typescript
export const projectRuleSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
```

### Tags Model

Located in `lib/models/tags-model.ts`, this model defines various tag categories used throughout the application:

```typescript
export enum SdlcActivity {
  DEBUG = "Debugging",
  DEPLOY = "Deploy",
  DESIGN = "Design",
  // ... other SDLC activities
}

export enum PromptCategory {
  CHAT = "Chat",
  DEV_AGENT = "Dev Agent",
  // ... other prompt categories
}

export enum ToolInterface {
  IDE = "IDE",
  CLI = "CLI",
  SDK = "SDK",
  CONSOLE = "Management Console",
}

export enum ProjectRuleTag {
  NEXTJS = "NextJS",
  REACT = "React",
  // ... other project rule tags
}
```

The model also provides utility functions to convert these enums to tag arrays:

```typescript
export function getToolInterfaceTags(): string[] {
  return convertEnumToTags(ToolInterface);
}

export function getCategoryTags(): string[] {
  return convertEnumToTags(PromptCategory);
}

export function getSdlcTags(): string[] {
  return convertEnumToTags(SdlcActivity);
}
```

## Schema Definitions

Common schema definitions used across models are defined in `lib/forms/schema-definitions.ts`:

```typescript
export const idSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .or(z.literal(""));

export const titleSchema = z
  .string()
  .trim()
  .max(100, "Title must be less than 100 characters")
  .min(3, "Title must be more than 3 characters");

export const descriptionSchema = z
  .string()
  .trim()
  .min(10, "Description must be more than 10 characters")
  .max(500, "Description must be less than 500 characters");

export const tagSchema = z.array(z.string()).optional();
export const publicSchema = z.boolean();
```

## Data Fetching

The models are used in server actions to fetch and transform data:

### Prompt Fetching

In `lib/actions/fetch-prompts-action.ts`, the Prompt model is used to type the returned data:

```typescript
export async function fetchPromptBySlug(slug: string) {
  // ... GraphQL query execution ...

  return {
    id: prompt.id,
    title: prompt.name,
    slug: prompt.slug,
    description: prompt.description,
    tags: prompt.tags,
    instruction: prompt.instruction,
    sourceURL: prompt.sourceURL,
    howto: prompt.howto,
    public: prompt.public,
    author: prompt.author.displayName,
    authorId: prompt.author.id,
  } as Prompt;
}
```

### ProjectRule Fetching

Similarly, in `lib/actions/fetch-rules-action.ts`, the ProjectRule model is used:

```typescript
export async function fetchProjectRuleBySlug(slug: string) {
  // ... GraphQL query execution ...

  return {
    id: projectRule.id,
    title: projectRule.name,
    slug: projectRule.slug,
    description: projectRule.description,
    tags: projectRule.tags,
    content: projectRule.content,
    sourceURL: projectRule.sourceURL,
    public: projectRule.public,
    author: projectRule.author?.displayName || "",
    authorId: projectRule.author?.id || "",
  } as ProjectRule;
}
```

This approach ensures type safety throughout the application while providing a clean separation between the backend data schema and the frontend representation of that data.
