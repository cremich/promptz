---
authors:
  - olemaitre
categories:
  - cdk
description:
  "Generate code from drawio diagram and keep code in sync with the diagram
  (works with q CLI)

  Create a drawio diagram in vscode, start 'q chat' and simply type the same prompt
  all the time:

  > generate application"
draft: false
images: []
sourceURL: https://github.com/welcloud-io/wio-from-diagram-to-code-with-amazon-q-developer/blob/main/_playground/README.md#11
tags:
  - CDK
  - Python
title: Keep code in sync with drawio diagram
createdAt: 2025-04-23T12:44:17.936Z
updatedAt: 2025-04-23T13:29:15.779Z
aliases: ["/rules/rule/keep-code-in-sync-with-drawio-diagram-1117009d"]
---

## generate-applicationflow-diagram

When asked to generate application:

search for the .drawio or the .drawio.xml diagram
use python 3.9 for lambda code
use python CDK V2 for infrastructure as code

If the folder contains code already, keep this code in sync with the diagram
