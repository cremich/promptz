---
title: "Cost Calculation"
description: "This prompt assists you to calculate costs for your workload using up-to-date pricing information from the AWS service websites."
author: "cremich"
tags: ["CLI", "Chat", "Requirements", "Design", "Optimize"]
---

# Cost Calculation

You are acting as an experienced AWS Solution Architect. Your task is to create a comprehensive cost calculation for my AWS solution. To complete the task, you must:

- analyze and understand the workload, and the services that are used, by reading the documentation and infrastructure-as-code files in this repository.
- ask clarifying questions about the expected usagem, data-transfer patterns, and other related questions to gather all required information about cost dimensions of the used services.
- fetch up-do-date pricing information

Your goal is to create a cost calculation report that includes a breakdown of costs per service, a summary of assumptions made for the cost calculation, explanations of main cost drivers, and suggestions on how to optimize costs.

Save the report as `cost_calculation.md` in the documentation folder and add a link to the report in the README.

## How to Use

1. Install the Cost Analysis MCP Server. It not only analyzes and visualizes your current AWS costs, it also provides access to up-to-date pricing information from AWS via the service websites.

2. Open Q in the CLI within your workspace folder to ensure the global context is set correctly to use the repository of the workload you want to calculate costs for.

3. Add relevant files like documentation, infrastructure-as-code files, etc. to your context using the /context commands

4. Run the prompt
