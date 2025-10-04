---
title: "Github Actions pull request workflow"
description: "Creates a pull request workflow template for Github Actions"
author: "cremich"
tags: ["Deploy", "IDE", "Dev Agent"]
---

# Github Actions pull request workflow

/dev Create a GitHub Actions workflow file that runs on pull requests targeting the {{branch-name}} branch. The workflow should:

- Include concurrency controls to cancel outdated workflow runs.
- Restrict permissions to the minimum required.
- Add Timeout Limits to prevent hanging jobs.
- Run on ubuntu-latest.
- Use the latest stable {{runtime}} version.
- Implement dependency caching with a specific cache-dependency-path to minimize execution time
- Combine lint and test into a single 'verify' job to reduce setup overhead.
