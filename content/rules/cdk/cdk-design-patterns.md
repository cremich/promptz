---
authors:
  - cremich
categories:
  - cdk
description:
  Outlines recommended design patterns for AWS CDK development. Design
  patterns are reusable solutions to common problems in software development. Following
  these patterns will ensure consistency, maintainability, and scalability across
  the codebase. The patterns described here are particularly relevant for AWS CDK
  development.
draft: false
images: []
tags:
  - TypeScript
  - CDK
  - IDE
  - CLI
title: CDK Design Patterns
createdAt: 2025-04-11T14:34:07.353Z
updatedAt: 2025-07-04T20:50:51.810Z
aliases: ["/rules/rule/cdk-design-patterns-7046062b"]
---

# CDK Design Patterns Rules

## CDK Stacks

- Use separate stacks to model individual deployable services within a bounded context.
- Use stacks only to describe how constructs are composed and connected for various deployment scenarios.
- Create separate stacks for common resources such as networking that are shared across multiple bounded contexts.
- Keep stateful and stateless resources within a stack together to achieve high cohesion.

## CDK Constructs

### Construct Hierarchy

- Use L1 constructs only when L2 or L3 constructs are not available for a specific resource
- Use L2 constructs as the default choice for most resources
- Use L3 constructs (patterns) when implementing common architectural patterns or combine multiple resources to solve specific use cases

### Construct Structure

- Follow the standard construct initialization pattern
- Accept `scope`, `id`, and `props` parameters
- Call `super(scope, id)` in the constructor
- Initialize resources in the constructor
- Define a clear interface for construct props
- Mark required properties as non-optional
- Provide sensible defaults for optional properties
- Validate props in the constructor
- Throw clear error messages for invalid props

### Construct Naming Conventions

- Use logical IDs that describe the resource's purpose
- Avoid using generic names like "Bucket" or "Function"
- Include the resource type in the logical ID
- Use descriptive property names
- Use generated resource names instead of physical names whenever possible.

### Composition and Inheritence

- Extend existing constructs when there's an "is a" relationship
- Use extension to add default properties or behaviors to existing constructs
- Override methods only when necessary to change behavior
- Use composition when there's a "has a" relationship
- Compose constructs to create higher-level abstractions as L3 constructs
- Expose only the necessary properties and methods to consumers

### Escape Hatches

- Use escape hatches only when necessary
- Use them to access features not yet available in higher-level constructs
- Document why the escape hatch is needed
- Use `node.defaultChild` to access the underlying L1 construct
- Cast to the appropriate type using `as`
- Set properties directly on the L1 construct

## CDK Aspects

- Use CDK aspects to modify, validate, or enforce standards across all constructs within a given scope.
- Use CDK aspects to apply consistent tags across all resources
- Use CDK aspects to apply removel policies for ephemeral environments
