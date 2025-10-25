# Content Front Matter Schema

This document defines the required and optional front matter fields for all content types in the Promptz Hugo site.

## Universal Fields

All content types (prompts, rules, agents) must include these fields:

### Required Fields

```yaml
title: "Content Title" # String: Display name for the content
description: "Brief description" # String: Summary of what the content does
author: "github-username" # String: GitHub username of the author
tags: ["tag1", "tag2"] # Array: At least one tag required
```

### Optional Fields

```yaml
date: "2024-01-15" # String: Creation date (ISO format)
lastmod: "2024-01-20" # String: Last modification date (ISO format)
draft: false # Boolean: Publication status (default: false)
featured: false # Boolean: Featured content flag (default: false)
sourceURL: "https://github.com/repo" # String: Reference or source link
difficulty: "beginner" # String: beginner|intermediate|advanced
categories: ["category"] # Array: Content categories
```

## Content-Specific Fields

### Prompts

No additional required fields beyond universal fields.

### Project Rules

No additional required fields beyond universal fields.

### Custom Agents

Additional optional fields for agent configuration:

```yaml
tools: ["tool1", "tool2"] # Array: Required tools for the agent
mcpServers: ["server1"] # Array: MCP servers used by the agent
resources: ["resource1"] # Array: Additional resources needed
```

## Tag Guidelines

### Standard Tags

- **IDE** - For IDE-based interactions
- **CLI** - For command-line usage
- **Chat** - For chat-based interactions
- **Implement** - For implementation tasks
- **Test** - For testing-related content
- **Design** - For design and architecture
- **Security** - For security-focused content
- **Performance** - For performance optimization
- **Documentation** - For documentation tasks

### Technology Tags

- **NextJS**, **React**, **TypeScript**, **JavaScript**
- **Python**, **Java**, **Go**, **Rust**
- **AWS**, **CDK**, **Amplify**, **Lambda**
- **Docker**, **Kubernetes**, **Terraform**

### Difficulty Tags

- **Beginner** - Basic concepts and simple tasks
- **Intermediate** - Moderate complexity
- **Advanced** - Complex scenarios and expert-level content

## Validation Rules

1. **Title**: Must be unique within content type
2. **Description**: Maximum 200 characters
3. **Author**: Must be a valid GitHub username
4. **Tags**: Minimum 1 tag, maximum 10 tags
5. **Categories**: Must match predefined category list
6. **URLs**: Must be valid HTTP/HTTPS URLs
7. **Dates**: Must be in ISO 8601 format (YYYY-MM-DD)

## Example Front Matter

### Prompt Example

```yaml
---
title: "Generate Unit Tests"
description: "Automatically generate comprehensive unit tests for TypeScript functions"
author: "cremich"
tags: ["Testing", "TypeScript", "CLI", "Implement"]
difficulty: "intermediate"
sourceURL: "https://github.com/example/repo"
---
```

### Project Rule Example

```yaml
---
title: "React Component Standards"
description: "Coding standards for React component development"
author: "cremich"
tags: ["React", "TypeScript", "Standards", "IDE"]
categories: ["frontend"]
featured: true
---
```

### Custom Agent Example

```yaml
---
title: "Frontend Development Agent"
description: "Specialized agent for React and Next.js development"
author: "cremich"
tags: ["React", "NextJS", "CLI", "Implement"]
tools: ["git", "npm", "playwright"]
mcpServers: ["github-mcp"]
difficulty: "advanced"
---
```
