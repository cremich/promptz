---
authors:
  - cremich
categories:
  - cdk
description:
  Outlines best practices for developing AWS CDK constructs. Following
  these guidelines will ensure that constructs are reusable, maintainable, and follow
  AWS best practices.
draft: false
images: []
tags:
  - CDK
  - TypeScript
  - IDE
  - CLI
title: CDK Construct Development
createdAt: 2025-04-11T14:31:19.345Z
updatedAt: 2025-07-04T20:54:02.567Z
aliases: ["/rules/rule/cdk-construct-development-defafe03"]
---

# CDK Construct Development Rules

## Compute

### AWS Lambda Functions

- Separate business logic from infrastructure code.
- Add the function handler code in a file with a `.lambda.ts` suffix.
- Group function handlers in a `functions` folder.
- Configure appropriate memory and timeout settings.
- Use environment variables for configuration.
- Set up appropriate IAM permissions with least privilege.

### ECS / Fargate

- Use appropriate task definitions and container configurations
- If needed, configure auto-scaling based on metrics
- Set up proper networking and security groups
- Implement health checks and monitoring

## Storage

### Amazon S3

- Configure appropriate encryption and access controls
- Set up lifecycle rules for cost optimization
- Implement versioning for critical data
- Configure logging and monitoring
- Configure backup and retention policies

### Amazon DynamoDB

- Configure appropriate capacity mode (on-demand or provisioned)
- Set up auto-scaling for provisioned capacity
- Implement proper key schema and indexes
- Configure backup and point-in-time recovery

## APIs

- Configure appropriate authentication and authorization
- Set up request validation and throttling
- Implement CORS for cross-origin requests
- Configure logging and monitoring

### Amazon API Gateway

- Configure appropriate authentication and authorization
- Set up request validation and throttling
- Implement CORS for cross-origin requests
- Configure logging and monitoring

## Networking

### VPC

- Design VPCs with appropriate subnet architecture
- Configure security groups with least privilege
- Set up VPC endpoints for AWS services when possible

### Cloudfront

- Configure appropriate cache behaviors for different content types
- Set up proper origin configurations
- Implement security headers and CORS
- Configure logging and monitoring

## Observability

### Cloudwatch

- Set up alarms for critical metrics
- Configure appropriate thresholds and actions
- Create dashboards for monitoring
