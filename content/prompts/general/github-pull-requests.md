---
authors:
  - cremich
categories:
  - general
description: Automate the creation of Github pull requests.
draft: false
howToUse: '- Install the official Github MCP server.

  - Start Q Developer in the CLI.

  - If you have an existing pull request template, add it to the context via "/context
  add".

  - Run the prompt.'
images: []
tags:
  - CLI
  - Chat
title: Github Pull Requests
createdAt: 2025-05-23T09:42:28.829Z
updatedAt: 2025-06-07T22:00:43.714Z
aliases: ["/prompts/prompt/github-pull-requests-38c933f9"]
---

Your task is to assist me in preparing a GitHub pull request for this branch. To complete the task, you must

- Create and analyze the diff of this branch compared to the main branch to understand all changes that were made
- Read the pull request template of this repository.
- Write a meaningful pull request description that captures the intention of the change based on the created diff.

Your goal is to create a new pull request on GitHub so that the change can be reviewed.
