---
authors:
  - JFL
categories:
  - general
description: Prompt to send Q CLI Chat to do research on recent libraries for you.
draft: false
howToUse: "Use this prompt with Amazon Q Developer CLI Chat.

  Then put the file in the context of the CLI using the command: /context add <filename>.md.

  Finally trigger a prompt to develop something given this new context.

  Here is demo blog post on this prompt: https://www.linkedin.com/posts/jeffelandreau_amazonqdeveloper-strands-generativeai-activity-7332856467667992576-A5NK."
images: []
tags:
  - CLI
  - Doc Agent
title: Prompt to send Q CLI Chat to do research on recent libraries for you.
aliases:
  [
    "/prompts/prompt/prompt-to-send-q-cli-chat-to-do-research-on-recent-libraries-for-you-9f8c0709",
  ]
---

Collect information on the <Library / Framework Name> whose documentation is available here: <URL>.
Use your execute tool and your knowledge of the unix commands to navigate this website.
Start by analyzing the structure of the website.
Continue by researching information about: <List of topics>.
Collect both code and documentation.
Write the result into a markdown file called <filename>.md
