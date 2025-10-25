## New Custom Agent Submission

### Agent Information

- **Category**: <!-- Select: documentation, engineering, infrastructure, operations, project-management, testing -->
- **Title**: <!-- Brief, descriptive title -->
- **Description**: <!-- What does this agent specialize in? -->
- **Tools Required**: <!-- List any specific tools this agent needs -->

### Checklist

- [ ] I have placed the markdown file in the appropriate category directory (`content/agents/CATEGORY/`)
- [ ] I have filled out all required frontmatter fields (categories, description, title)
- [ ] I have included a complete agent JSON configuration
- [ ] I have followed the naming convention (`lowercase-with-hyphens.md`)
- [ ] I have used the [agent template](../../templates/agent-template.md) as a starting point
- [ ] I have tested the agent configuration and verified it works
- [ ] I have documented any prerequisites or setup requirements
- [ ] My agent is appropriate for public sharing and contains no sensitive information

### Content Guidelines

Please ensure your agent:

- Has a clear, specific purpose and use case
- Includes only necessary tools and permissions
- Contains an effective system prompt
- Follows the JSON schema requirements
- Is thoroughly tested in real scenarios
- Documents any setup requirements

**Directory Selection Guide:**

- `documentation/` - Documentation generation and maintenance
- `engineering/` - Software development and coding assistance
- `infrastructure/` - Infrastructure management and operations
- `operations/` - Operational tasks and troubleshooting
- `project-management/` - Project planning and management
- `testing/` - Testing automation and quality assurance

### Required Frontmatter Schema

```yaml
---
categories:
  - category-name # Choose from the directories above
description: Brief description of this custom agent's capabilities and use cases
draft: false
featured: false
images: []
tags:
  - CLI
  - Implement
  - Agent
title: Your Agent Title
---
```

### Required Agent JSON Schema

```json
{
  "$schema": "https://raw.githubusercontent.com/aws/amazon-q-developer-cli/main/schemas/agent-v1.json",
  "name": "your-agent-name",
  "description": "Brief description of this custom agent's capabilities and use cases",
  "prompt": "Your system prompt here...",
  "tools": [],
  "mcpServers": {},
  "resources": [],
  "hooks": {},
  "toolsSettings": {},
  "toolAliases": {},
  "allowedTools": [],
  "useLegacyMcpJson": false
}
```

### Agent Configuration Guidelines

- **Name**: Use kebab-case naming convention
- **Description**: Clear, concise explanation of capabilities
- **Prompt**: Detailed system prompt defining behavior and expertise
- **Tools**: Only include necessary tools for the agent's function
- **Resources**: Document any required files or configurations

### Validation

The automated validation will check:

- ✅ Frontmatter schema compliance
- ✅ File naming conventions (`lowercase-with-hyphens.md`)
- ✅ JSON schema validation
- ✅ Security checks
- ✅ Markdown syntax validation
