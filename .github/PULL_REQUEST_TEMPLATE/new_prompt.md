## New Prompt Submission

### Prompt Information

- **Category**: <!-- Select: analysis, architecture, aws, code-generation, documentation, general, persona, scaffolding, solutions, spec-driven-development, testing -->
- **Title**: <!-- Brief, descriptive title -->
- **Description**: <!-- What does this prompt accomplish? -->

### Checklist

- [ ] I have placed the markdown file in the appropriate category directory (`content/prompts/CATEGORY/`)
- [ ] I have filled out all required frontmatter fields (categories, description, title)
- [ ] I have included a `howToUse` field with clear instructions
- [ ] I have followed the naming convention (`lowercase-with-hyphens.md`)
- [ ] I have used the [prompt template](../../templates/prompt-template.md) as a starting point
- [ ] My prompt is appropriate for public sharing and contains no sensitive information
- [ ] I have tested the prompt and verified it works as expected

### Content Guidelines

Please ensure your prompt:

- Has a clear, descriptive title
- Includes step-by-step usage instructions in the `howToUse` frontmatter field
- Is appropriate for public sharing
- Does not contain sensitive information
- Follows the frontmatter schema from `templates/prompt-template.md`

**Directory Selection Guide:**

- `analysis/` - Code review, security analysis, optimization
- `architecture/` - System design, diagrams, architectural blueprints
- `aws/` - AWS-specific infrastructure and services
- `code-generation/` - Code scaffolding, boilerplate generation
- `documentation/` - ADRs, specifications, project documentation
- `general/` - Miscellaneous utilities and tools
- `persona/` - AI behavior and role-setting prompts
- `scaffolding/` - Project setup, environment configuration
- `solutions/` - Complete applications and end-to-end solutions
- `spec-driven-development/` - Specification creation and planning
- `testing/` - Unit tests, test generation, QA processes

### Required Frontmatter Schema

```yaml
---
categories:
  - category-name # Choose from the directories above
description: Brief description of what this prompt does and its purpose
draft: false
featured: false
howToUse: |
  Instructions on how to use this prompt effectively.
  Include specific steps and context where it works best.
images: []
tags:
  - CLI
  - Chat
  - IDE
title: Your Prompt Title
---
```

### Validation

The automated validation will check:

- ✅ Frontmatter schema compliance
- ✅ File naming conventions (`lowercase-with-hyphens.md`)
- ✅ Content structure requirements
- ✅ Security checks
- ✅ Required sections presence
- ✅ Markdown syntax validation
