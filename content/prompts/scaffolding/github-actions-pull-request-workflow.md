---
authors:
  - cremich
categories:
  - scaffolding
description: Creates a pull request workflow template for Github Actions
draft: false
images: []
tags:
  - Deploy
  - IDE
  - Dev Agent
title: Github Actions pull request workflow
createdAt: 2024-11-21T22:45:28.393Z
updatedAt: 2024-11-21T22:47:44.734Z
aliases: ["/prompts/prompt/github-actions-pull-request-workflow-d748c1c3"]
---

/dev Create a GitHub Actions workflow file that runs on pull requests targeting the {{branch-name}} branch. The workflow should:

- Include concurrency controls to cancel outdated workflow runs.
- Restrict permissions to the minimum required.
- Add Timeout Limits to prevent hanging jobs.
- Run on ubuntu-latest.
- Use the latest stable {{runtime}} version.
- Implement dependency caching with a specific cache-dependency-path to minimize execution time
- Combine lint and test into a single 'verify' job to reduce setup overhead.
