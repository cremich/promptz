---
authors:
  - Nihit Kasabwala
categories:
  - testing
description: generate functional test for a UI page that is built using a react framework
draft: false
howToUse:
  At this point, you already have a fixture defined and initial scaffolding
  for the functional test setup which includes installing cypress.io (`npm install
  cypress`) and the `cypress.config.ts` is already created in the project folder.
images: []
tags:
  - Test
  - IDE
  - Chat
title: Generate UI functional test using cypress for a specific page.
aliases:
  [
    "/prompts/prompt/generate-ui-functional-test-using-cypress-for-a-specific-page-2cfe20d8",
  ]
createdAt: "2025-01-25T19:24:02.068Z"
updatedAt: "2025-01-25T19:24:02.068Z"
---

Review the ui component at @workspace/<location of the component file .tsx or .jsx> and generate cypress based functional test. To mock the response from /<api-name> GET call use the fixture defined in @workspace/location of the fixture. The cyrpress.config.ts is already defined in @workspace/<location of the cypress.config.ts file>. This new functional test should be written to <name of the file> in the @workspace/<folder name> folder. If there are any environment variables to written to the cypress config file, please list them separately. If you need `data-testid` to reference any component in the `cy.get` selectors, please provide those recommendations, do not assume they exist.
