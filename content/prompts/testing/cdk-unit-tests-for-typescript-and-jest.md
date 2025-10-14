---
title: "CDK unit tests for Typescript and jest"
description: "Testing constructs with fine-grained assertions focussing on covering relevant business logic, integration aspects and guardrails."
author: "cremich"
tags: ["Test", "CDK"]
---

# CDK unit tests for Typescript and jest

Add unit tests for CDK L3 construct in this repository.

When creating unit tests using fine-grained assertions, follow these principles:

- Verify security configurations and business requirements.
- Test boundary conditions and error cases in construct properties.
- Verify that required resources are created and properly linked.
- Verify that required resources contain the right IAM permissions.
- Focus unit tests on specific behaviors that must not change.
- if applicable, mock CDK assets like docker images or lambda function to prevent generating zip files during test execution. This speeds up test execution.
- each test should only test a single specific aspect of the construct.
- Ensure that the unit test cover constructs and not stacks.

The unit test should conform to the following guidelines:

- use jest as the test framework
- add comments to explain what every test is covering
- use a meaningful name of the test
- do not add extra `describe` blocks.
- use the `test()` method to run an individual test
- do not import `describe`, `test`, `jest` or `expect`.
- use the `aws-cdk-lib.assertions` library from CDK v2 for assertions
- use single named imports
- use arrow functions for all test functions.
- the test file must be named like the source ending with `.test.ts`. Example: if the source file is named `api-construct.ts`, the test file must be named `api-construct.test.ts`
