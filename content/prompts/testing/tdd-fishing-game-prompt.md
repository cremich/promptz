---
authors:
  - Stan Fan
categories:
  - testing
description: "prompt bank for fishing-game demo "
draft: false
images: []
tags:
  - IDE
  - Dev Agent
title: TDD-fishing-game-prompt
createdAt: 2025-02-19T04:18:37.807Z
updatedAt: 2025-02-19T04:18:37.807Z
aliases: ["/prompts/prompt/tdd-fishing-game-prompt-4828e648"]
---

/dev Generate an ASCII fishing game, include feature:

1. cast_line
2. catch_fish
3. display_game

add a catch_shark method. When player caught a shark, minus 1 score. Generate test file first.

Generate a test case that player's score cannot go below 0

Generate a integration test of retriving highest scroe from dynamoDB with moto lib

write me a test case only, without touching source code, test on cathing an invalid fish, e.g. bass

Now generate the source code for me on test_catch_invalid_fish test case
