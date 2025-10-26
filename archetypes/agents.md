---
categories:
  - { { .File.Dir | path.Base } }
description: Brief description of this custom agent's capabilities and use cases
draft: true
featured: false
images: []
tags:
  - CLI
  - Implement
  - Agent
title: "The title of your custom agent"
---

## Agent Configuration

```json
{
  "$schema": "https://raw.githubusercontent.com/aws/amazon-q-developer-cli/main/schemas/agent-v1.json",
  "name": "{{ replace .File.ContentBaseName "-" "-" }}",
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
