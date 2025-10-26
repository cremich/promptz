---
title: Contributing Guide
description: Learn how to contribute prompts, project rules, and custom agent configurations to help the Amazon Q Developer community
draft: false
layout: contribute
tags: ["contributing", "community", "prompts", "rules", "agents"]
---

# Contributing Guide

Thank you for considering contributing to Promptz! This guide will help you contribute prompts, project rules, and custom agent configurations to help the Amazon Q Developer community.

## Quick Start

1. **Fork the repository** on GitHub
2. **Choose your content type**: Prompts, Project Rules, or Custom Agents
3. **Use the appropriate template** from the `templates/` directory
4. **Follow the content guidelines** below
5. **Submit a pull request**

## Contributing Prompts

Prompts are AI instructions that help developers accomplish specific tasks with Amazon Q Developer.

### Directory Structure

Place your prompt in the appropriate category:

- **`analysis/`** - Code review, security analysis, optimization
- **`architecture/`** - System design, diagrams, architectural blueprints
- **`aws/`** - AWS-specific infrastructure and services
- **`code-generation/`** - Code scaffolding, boilerplate generation
- **`documentation/`** - ADRs, specifications, project documentation
- **`general/`** - Miscellaneous utilities and tools
- **`persona/`** - AI behavior and role-setting prompts
- **`scaffolding/`** - Project setup, environment configuration
- **`solutions/`** - Complete applications and end-to-end solutions
- **`spec-driven-development/`** - Specification creation and planning
- **`testing/`** - Unit tests, test generation, QA processes

### Creating a Prompt

1. **Copy the template**:

   ```bash
   cp templates/prompt-template.md content/prompts/CATEGORY/your-prompt-name.md
   ```

2. **Fill out the frontmatter**:

   ```yaml
   ---
   categories:
     - category-name # Choose from the directories above
   description: Brief description of what this prompt does
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

3. **Add your prompt content** below the frontmatter

### Prompt Guidelines

- **Be specific**: Clear instructions produce better results
- **Include context**: Explain when and how to use the prompt
- **Test thoroughly**: Verify the prompt works as expected
- **Use descriptive titles**: Help users find relevant prompts
- **Follow naming convention**: `lowercase-with-hyphens.md`

## Contributing Project Rules

Project rules define coding standards, architectural patterns, and development guidelines that Amazon Q Developer should follow.

### Directory Structure

Place your rule in the appropriate technology category:

- **`amplify/`** - AWS Amplify development rules
- **`aws/`** - General AWS development practices
- **`cdk/`** - AWS CDK development standards
- **`general/`** - Language-agnostic development rules
- **`javascript/`** - JavaScript-specific rules
- **`mobile/`** - Mobile development guidelines
- **`nextjs/`** - Next.js development standards
- **`python/`** - Python development rules
- **`react/`** - React development guidelines
- **`security/`** - Security-focused development rules
- **`testing/`** - Testing standards and practices
- **`typescript/`** - TypeScript development rules
- **`vue/`** - Vue.js development guidelines

### Creating a Project Rule

1. **Copy the template**:

   ```bash
   cp templates/rule-template.md content/rules/CATEGORY/your-rule-name.md
   ```

2. **Fill out the frontmatter**:

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

3. **Structure your rule** with Purpose, Instructions, Priority, and Error Handling sections

### Rule Guidelines

- **Be actionable**: Use clear directives (ALWAYS, NEVER, WHEN)
- **Set priorities**: Help resolve conflicts between rules
- **Include error handling**: Define fallback strategies
- **Add unique IDs**: Use (ID: IDENTIFIER) for traceability
- **Provide examples**: Show correct and incorrect implementations

## Contributing Custom Agents

Custom agents are specialized AI assistants configured for specific development workflows.

### Directory Structure

Place your agent in the appropriate functional category:

- **`documentation/`** - Documentation generation and maintenance
- **`engineering/`** - Software development and coding assistance
- **`infrastructure/`** - Infrastructure management and operations
- **`operations/`** - Operational tasks and troubleshooting
- **`project-management/`** - Project planning and management
- **`testing/`** - Testing automation and quality assurance

### Creating a Custom Agent

1. **Copy the template**:

   ```bash
   cp templates/agent-template.md content/agents/CATEGORY/your-agent-name.md
   ```

2. **Fill out the frontmatter**:

   ```yaml
   ---
   categories:
     - category-name # Choose from the directories above
   description: Brief description of this agent's capabilities
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

3. **Configure the agent JSON** with proper schema, tools, and prompt

### Agent Guidelines

- **Define clear purpose**: Explain what the agent does and when to use it
- **Configure appropriate tools**: Only include necessary tools and permissions
- **Write effective prompts**: Clear system prompts produce better results
- **Test thoroughly**: Verify the agent works in real scenarios
- **Document requirements**: List prerequisites and setup steps

## Validation and Quality

All content is automatically validated for:

- **Frontmatter schema**: Required fields and proper formatting
- **File naming**: `lowercase-with-hyphens.md` convention
- **Content structure**: Appropriate sections and formatting
- **Security**: No sensitive information or security violations
- **Markdown syntax**: Valid markdown parsing

## Submission Process

1. **Create a branch**:

   ```bash
   git checkout -b add-content-your-content-name
   ```

2. **Add your content** to the appropriate directory

3. **Commit your changes**:

   ```bash
   git add content/TYPE/CATEGORY/your-file.md
   git commit -m "feat: add [content name] for [category]"
   ```

4. **Push and create a pull request**:
   ```bash
   git push origin add-content-your-content-name
   ```

## Review Process

**Automated Checks:**

- Validation requirements must pass
- Build process must succeed
- No security violations

**Manual Review:**

- Content quality and usefulness
- Appropriate categorization
- Clear instructions and documentation
- Community guidelines compliance

## Getting Help

- **Templates**: Use files in `templates/` directory as starting points
- **Examples**: Browse existing content for reference
- **Issues**: Open an [issue](https://github.com/cremich/promptz/issues) for questions
- **Discussions**: Join conversations in pull requests
