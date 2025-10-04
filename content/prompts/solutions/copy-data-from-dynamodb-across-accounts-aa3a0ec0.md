---
title: "Copy data from DynamoDB across accounts"
description: "This prompt creates a shell script to copy data from a target DynamoDB table to a source table."
author: "cremich"
tags: ["CLI", "Chat", "Implement"]
---

# Copy data from DynamoDB across accounts

Create a shell script to copy all data from a source DynamoDB table into a target DynamoDB table using the AWS CLI. Source and target tables are provisioned in different AWS accounts.

- Use named profiles called "source" and "target" to connect to the target and source account.
- Save scan results to a temporary directory
- Processing each item individually

## How to Use

Open Amazon Q Developer in the CLI via `q chat`. Copy-paste the prompt into your terminal. To improve the accuracy of the output, provide samples of how the data are structured inside your DynamoDB Tables.

Before running the script, make sure to create two named profiles for source and target accounts in your AWS CLI configuration.
