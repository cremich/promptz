---
authors:
  - cremich
categories:
  - solutions
description:
  This prompt creates a shell script to copy data from a target DynamoDB
  table to a source table.
draft: false
howToUse:
  "Open Amazon Q Developer in the CLI via `q chat`. Copy-paste the prompt
  into your terminal. To improve the accuracy of the output, provide samples of how
  the data are structured inside your DynamoDB Tables.


  Before running the script, make sure to create two named profiles for source and
  target accounts in your AWS CLI configuration."
images: []
tags:
  - CLI
  - Chat
  - Implement
title: Copy data from DynamoDB across accounts
createdAt: 2025-03-20T12:58:09.382Z
updatedAt: 2025-03-20T13:39:14.523Z
aliases: ["/prompts/prompt/copy-data-from-dynamodb-across-accounts-aa3a0ec0"]
---

Create a shell script to copy all data from a source DynamoDB table into a target DynamoDB table using the AWS CLI. Source and target tables are provisioned in different AWS accounts.

- Use named profiles called "source" and "target" to connect to the target and source account.
- Save scan results to a temporary directory
- Processing each item individually
