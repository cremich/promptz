# Feature Request: Support Amazon Q Developer project rules

**Is your feature request related to a problem? Please describe.**
Currently, Amazon Q project rules, which help teams enforce coding standards and best practices, are difficult to discover and share. While promptz.dev successfully helps developers share and discover general prompts, there's no dedicated platform for sharing project rules that are stored in .amazonq/rules folders. This makes it challenging for teams to find and implement best practices for their projects.

**Describe the solution you'd like**
Add support for Amazon Q project rules to promptz.dev with the following key features:

1. Data Model aligned with existing prompts structure:

```
projectRule = {
  id: string
  title: string
  description: string
  content: string // Markdown content
  tags: string[] // For languages and frameworks
  isPublic: boolean
  sourceURL: string
  owner_username: string
}
```

Core Features:

- Dedicated "Project Rules" section in navigation
- Create/edit interface for project rules
- Browse and search functionality separate from prompts
- Download option for rules as markdown files
- Dynamic OpenGraph image generation for improved social sharing
- Tag-based filtering system

Authentication & Authorization:

- Only authenticated users can create rules
- Only owners can edit/delete their rules
- Public/private visibility control

**Describe alternatives you've considered**

1.  Adding project rules as a category within existing prompts. Rejected because project rules serve a different purpose and need separate discovery/browsing
2.  Supporting file upload for rules. Rejected in favor of copy/paste functionality to keep implementation simple
3.  Adding starring feature like prompts. Rejected for initial implementation due to low usage in prompts

**Additional context**
Technical Implementation Details:

Data Layer:

```
const schema = a.schema({
  projectRule: a.model({
    title: a.string().required(),
    description: a.string().required(),
    content: a.string().required(),
    tags: a.string().array(),
    isPublic: a.boolean().required(),
    sourceURL: a.string(),
    owner_username: a.string().required(),
  })
  .authorization((allow) => [
        allow.publicApiKey().to(["read"])
        allow.authenticated().to(["read"]),
        allow.owner().to(["create", "update", "delete"]),
  ])
});
```

Implementation Phases:

- Phase 1 (MVP): Core data model, CRUD operations, basic UI
- Phase 2: Download feature, OpenGraph images, social sharing optimization

Testing Requirements:

- Unit tests for validation and authorization
