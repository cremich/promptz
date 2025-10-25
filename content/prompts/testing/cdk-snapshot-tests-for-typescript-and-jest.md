---
authors:
  - cremich
categories:
  - testing
description:
  Uses the dev agent to create CDK snapshot tests following best practices
  and testing guidelines.
draft: false
images: []
tags:
  - Test
  - CDK
title: CDK Snapshot Tests for Typescript and jest
createdAt: 2025-01-17T11:00:21.061Z
updatedAt: 2025-01-17T13:00:35.468Z
aliases: ["/prompts/prompt/cdk-snapshot-tests-for-typescript-and-jest-37ad5b71"]
---

Add CDK snapshot tests to compare the entire synthesized CloudFormation template.

When creating snapshot tests, follow these principles:

- use snapshot tests to catch unexpected changes in the overall infrastructure.
- consider snapshot tests as a change detection mechanism rather than a regression testing tool.
- ensure that the snapshot test covers CDK stacks, not individual L3 constructs.
- if applicable, mock CDK assets like docker images or lambda function to prevent generating zip files during test execution. This speeds up test execution and ensures static keys for assets so that snapshots do not change on every execution.

The snapshot test should conform to the following guidelines:

- use jest as the test framework
- add comments to explain what every test is covering
- use a meaningful name of the test
- do not add extra `describe` blocks.
- use the `test()` method to run an individual test
- do not import `describe`, `test`, `jest` or `expect`.
- use the `aws-cdk-lib.assertions library` from CDK v2 for assertions
- use single named imports
- use arrow functions for all `test` functions.
- the test file must be named like the source ending with .test.ts. Example: if the source file is named `my-stack.ts`, the test file must be named `my-stack.test.ts`
