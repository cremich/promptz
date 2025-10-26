---
authors:
  - cremich
categories:
  - cdk
description:
  Outlines security and compliance best practices for AWS CDK applications.
  Security is a critical aspect of infrastructure as code, and following these guidelines
  will help ensure that your CDK applications are secure, compliant, and follow AWS
  best practices.
draft: false
images: []
tags:
  - CDK
  - TypeScript
  - IDE
  - CLI
  - Implement
  - Security
title: CDK Security and Compliance
createdAt: 2025-04-11T14:33:21.777Z
updatedAt: 2025-07-04T20:52:53.964Z
aliases: ["/rules/rule/cdk-security-and-compliance-9ffbc053"]
---

# CDK Security and Compliance Rules

## IAM

- Grant only the permissions required for a specific task
- Avoid using wildcard permissions (`*`) in IAM policies
- Use IAM roles instead of access keys for service-to-service authentication
- Configure service roles with appropriate permissions
- Use managed policies when appropriate, but prefer custom policies for more control
- Use temporary credentials instead of long-term access keys
- Implement credential rotation for any long-term credentials
- Set appropriate expiration times for temporary credentials

## Encryption

- Enable encryption for all storage services with service managed keys
- Enforce HTTPS for all external communications
- Use TLS 1.2 or later for all encrypted connections
- Configure security policies for CloudFront distributions

## Retain policies

- Define retain policies on stateful resources
- In production environments, retain resources
- In development or test environments, delete resources

## Secrets

- Use AWS Secrets Manager or encrypted strings in Parameter Store for secrets
- Don't hardcode sensitive information in CDK code
- Implement access controls for secrets

## Network Security

- Use private subnets for resources that don't need internet access
- Configure security groups with least privilege allowing only necessary inbound and outbound traffic
- Use security group references instead of CIDR ranges when possible
- Configure AWS WAF for public-facing applications
- Implement appropriate rule sets for common attack vectors
- Enable logging for WAF events

## Security Testing

- Use cdk-nag to check the application for best practices
- Remediate security issues reported by cdk-nag
- Configure required cdk-nag rule packs
- Suppress findings with justification

## Compliance Documentation

- Document compliance requirements and how they are addressed using comments on the stack or construct classes
- Maintain evidence of compliance checks
- Regularly review and update compliance documentation
