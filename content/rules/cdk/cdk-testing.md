---
authors:
  - cremich
categories:
  - cdk
description:
  Outlines best practices for testing AWS CDK applications. Testing is
  a critical aspect of CDK development to ensure that infrastructure is deployed correctly
  and behaves as expected. Following these guidelines will help create reliable, maintainable,
  and well-tested infrastructure code.
draft: false
images: []
tags:
  - CDK
  - TypeScript
  - IDE
  - CLI
  - Test
title: CDK Testing
createdAt: 2025-04-11T14:29:41.487Z
updatedAt: 2025-07-04T20:53:41.981Z
aliases: ["/rules/rule/cdk-testing-0a816aa6"]
---

# CDK Testing Rules

## General

- Follow a test-driven development approach.
- Keep tests simple and focused on one aspect of behavior
- Use Jest as the testing framework
- Use the AWS CDK assertions module for testing CDK constructs
- Use the Arrange-Act-Assert pattern
- Organize tests by construct or stack
- Use descriptive test names that explain the expected behavior
- Aim for high test coverage (at least 80%)
- Focus on testing critical infrastructure components
- Ensure all resource properties are tested

## Unit Tests

- Use fine-grained assertions to test specific aspects of resources
- Use `hasResourceProperties` for partial matching and `exactlyMatchTemplate` for exact matching
- Use snapshot testing to detect unintended changes in CloudFormation templates
- Update snapshots only when changes are intentional
- Don't rely solely on snapshots; combine with fine-grained assertions

## Integration Tests

- Use the `integ-tests-alpha` module for integration testing
- Create separate integration test files with the `.integ.ts` suffix
- Define integration tests as CDK applications
- Test that resources are created successfully
- Test interactions between resources
- Clean up resources after tests complete
