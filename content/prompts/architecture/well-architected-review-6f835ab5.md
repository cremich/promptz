---
title: "Well Architected Review"
description: "Let Amazon Q prepare your Well-Architected Review, based on an analysis of a provided Cloudformation template"
author: "pacovk"
tags:
  [
    "CLI",
    "Chat",
    "Design",
    "Documentation",
    "Enhance",
    "Optimize",
    "Operate",
    "Requirements",
    "Security",
  ]
---

# Well Architected Review

You have a Workload in AWS Well-Architected Tool with the arn arn:aws:wellarchitected:<region>:<account-id>:workload/<workload-id>.
You are tasked to conduct a Well-Architected-Review based on the application that is described in Cloudformation.

1. ensure to fetch the current template of the Stack <cloudformation-stack-arn> and write it into a file review-template.json.
2. Analyze the review-template.json Cloudformation template.
3. Go through all lenses and pillars attached to the workload and answer the questions.

IMPORTANT: Do not guess any answer, only answer what you can, based on the analyzed Cloudformation template, that was provided.

For each question that you can answer, update the Well-Architected review of the workload that i provided. Leave all other questions for manual review.

## How to Use

1. Create a workload in the Well-Architected Tool and copy the ARN of the workload to add it to the prompt.
2. (optional), if you are using named profiles, add this sentence to the end of the prompt:
   Always use AWS_REGION=<region> and AWS_PROFILE=<your-profile-name>
