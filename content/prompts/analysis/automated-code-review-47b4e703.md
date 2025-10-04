---
title: "Automated Code Review"
description: "Let Q do a code review of your staged files before committing and pushing your changes."
author: "cremich"
tags: ["CLI", "Implement", "Chat"]
---

# Automated Code Review

Apply a code review of all staged files. Do not make any changes; report your review results at the end. Respect the following rules for your review:

- Code is commented in hard-to-understand areas
- Corresponding changes to the documentation have been made
- Run the linter to prove the changes generate no new lint errors
- Run unit tests to prove the change does not introduce breaking changes
- Check if any dependent changes have been merged

## How to Use

Make a change in your repository and stage all files with `git add .`. Open your terminal and change directory to the root folder of your repository. Then start Q Developer with `q chat` and paste the prompt. You can apply additional code review rules based on your guidelines.
