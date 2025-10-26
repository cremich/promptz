---
authors:
  - haken
categories:
  - general
description:
  This document explains the standardized naming convention for Amazon
  Q learning files across different projects and directories.
draft: false
images: []
tags:
  - CLI
  - Enhance
  - Documentation
  - Support
title: Amazon Q Learning Files
createdAt: 2025-07-19T20:22:57.240Z
updatedAt: 2025-07-19T20:22:57.240Z
featured: true
aliases: ["/rules/rule/amazon-q-learning-files-4a6f6cb8"]
---

This document explains the standardized naming convention for Amazon Q learning files across different projects and directories.

## Naming Convention

All Amazon Q learning files follow this naming pattern:

```
q-learning-{context}.md
```

Where `{context}` is a descriptor of the project or area (e.g., "datalake", "streaming", "general").

## File Locations

| File Name                     | Location                    | Purpose                                                        |
| ----------------------------- | --------------------------- | -------------------------------------------------------------- |
| `q-learning-general.md`       | Home directory (~)          | General learnings and insights across all projects             |
| `q-learning-datalake.md`      | Data Lake project directory | Learnings specific to the Data Lake project (Caspian/Khazar)   |
| `q-learning-announcements.md` | Announcements directory     | Learnings related to announcement workflows and communications |
| `q-learning-streaming.md`     | Streaming project directory | Learnings specific to streaming data projects                  |

## Purpose

These files serve as a knowledge base for Amazon Q to:

1. Better understand your work style and preferences
2. Improve collaboration and assistance
3. Provide more relevant and contextual help
4. Optimize Q CLI token usage by maintaining context

## Usage

When working with Amazon Q in a specific project context, it will automatically reference the relevant learning file to provide more tailored assistance.

You can update these files manually or ask Amazon Q to update them with new insights from your interactions.

## Format

All files use Markdown (.md) format for:

- Better structure and readability
- Support for rich formatting (headers, lists, code blocks)
- Compatibility with version control systems
- Easy viewing in most text editors and documentation tools

## Updating Guidelines

When updating q-learning files:

- PRESERVE the existing structure and content
- ADD new learnings to the appropriate sections rather than reformatting the entire document
- MAINTAIN the established organization and formatting
- EXTEND existing sections with new insights rather than replacing them
- RESPECT the document's original structure and flow
