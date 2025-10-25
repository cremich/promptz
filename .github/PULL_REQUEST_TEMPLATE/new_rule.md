## New Project Rule Submission

### Rule Information

- **Category**: <!-- Select: amplify, aws, cdk, general, javascript, mobile, nextjs, python, react, security, testing, typescript, vue -->
- **Title**: <!-- Brief, descriptive title -->
- **Description**: <!-- What development standards does this rule define? -->
- **Priority**: <!-- High | Medium | Low -->

### Checklist

- [ ] I have placed the markdown file in the appropriate category directory (`content/rules/CATEGORY/`)
- [ ] I have filled out all required frontmatter fields (categories, description, title)
- [ ] I have included Purpose, Instructions, Priority, and Error Handling sections
- [ ] I have followed the naming convention (`lowercase-with-hyphens.md`)
- [ ] I have used the [rule template](../../templates/rule-template.md) as a starting point
- [ ] My rule contains actionable directives (ALWAYS, NEVER, WHEN)
- [ ] I have included unique IDs for traceability (ID: IDENTIFIER)
- [ ] My rule is appropriate for public sharing and contains no sensitive information

### Content Guidelines

Please ensure your rule:

- Uses clear, actionable directives
- Sets appropriate priority levels
- Includes error handling strategies
- Provides specific implementation guidance
- Contains unique identifiers for each directive
- Follows the structure from `templates/rule-template.md`

**Directory Selection Guide:**

- `amplify/` - AWS Amplify development rules
- `aws/` - General AWS development practices
- `cdk/` - AWS CDK development standards
- `general/` - Language-agnostic development rules
- `javascript/` - JavaScript-specific rules
- `mobile/` - Mobile development guidelines
- `nextjs/` - Next.js development standards
- `python/` - Python development rules
- `react/` - React development guidelines
- `security/` - Security-focused development rules
- `testing/` - Testing standards and practices
- `typescript/` - TypeScript development rules
- `vue/` - Vue.js development guidelines

### Required Frontmatter Schema

```yaml
---
categories:
  - category-name # Choose from the directories above
description: Brief description of these project rules and their purpose
draft: false
featured: false
images: []
tags:
  - Standards
  - IDE
  - CLI
title: Your Rule Title
---
```

### Required Sections

- **Purpose**: Describe the scope and intent of the rule
- **Instructions**: Specific directives with unique IDs
- **Priority**: High | Medium | Low
- **Error Handling**: Fallback strategies and conflict resolution

### Validation

The automated validation will check:

- ✅ Frontmatter schema compliance
- ✅ File naming conventions (`lowercase-with-hyphens.md`)
- ✅ Required sections presence
- ✅ Security checks
- ✅ Markdown syntax validation
