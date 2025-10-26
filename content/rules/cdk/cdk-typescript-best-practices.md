---
authors:
  - cremich
categories:
  - cdk
description:
  TypeScript best practices for AWS CDK development. Following these guidelines
  will ensure type safety, code consistency, and maintainability across the codebase.
  TypeScript's static typing capabilities help catch errors early in the development
  process and provide better tooling support.
draft: false
images: []
tags:
  - CDK
  - TypeScript
  - IDE
  - CLI
  - Implement
title: CDK Typescript Best Practices
createdAt: 2025-04-11T13:20:06.417Z
updatedAt: 2025-07-04T20:52:12.495Z
aliases: ["/rules/rule/cdk-typescript-best-practices-7821fd0a"]
---

# CDK TypeScript Rules

## Naming Conventions

- Use camelCase for variable and function names.
- Use PascalCase for class names and interface names.
- Use camelCase for interface members.
- Use PascalCase for type names and enum names.

## Type System

- Avoid using the `any` type as it defeats TypeScript's type checking
- Use specific types or create custom types when needed
- Use union types when a variable can only be one of a limited set of values
- Use destructuring on properties to extract multiple pieces of data from an array or object and assign them to new variables.
- Use the let keyword to declare a local variable instead of using the var keyword
- Always define return types for functions to make the API contract clear
- Use `Partial<Type>` when all properties of a type should be optional
- Use `Required<Type>` to make all properties of a type required
- Use `Pick` to create a type with only the properties you need

## Interfaces

- Use interfaces to standardize construct or stack properties ensuring that callers provide the expected parameters.
- Avoid empty interfaces
- Mark interface properties that should not be modified after initialization as `readonly`

## Enums

- Use enums to define sets of related constants
- Export enums at the global level for reuse
- Prefer string enums over numeric enums for better debugging and readability

## Linting and Formatting

- Use ESLint to identify issues. Fix them immediately
- Use Prettier as code-formatter
