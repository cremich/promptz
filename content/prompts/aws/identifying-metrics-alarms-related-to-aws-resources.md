---
authors:
  - shudabas
categories:
  - aws
description:
  This prompt aims to identify missing metrics/alarms related to AWS Resources
  in a target package. A reference package is used to limit the response to required
  metrics/alarms, assuming it follows best practices for the particular resource type
  setup.
draft: false
howToUse:
  "{{Service1}} is the target package name, for which missing alarms and metrics
  need to be identified.

  {{Service2}} is the reference package name, which follows best practices for resource
  monitoring.

  {{ALARM_TYPE}} is the AWS resource type. E.g. AWS API Gateway.

  The code for the reference and target packages need to be converted to a structured
  format and appended to the prompt.


  Utility to convert code packages to a structured format: packages/GenAICDKAnalyzer/blobs/mainline/--/codebase_to_text.py

  Sample usage of the utility: packages/GenAICDKAnalyzer/blobs/6aec4cd1b96c975dff5f1a8950b1b0ab70be7399/--/main.py#L184"
images: []
title: Identifying metrics/alarms related to AWS Resources
tags: ["aws", "monitoring", "metrics", "alarms", "cloudwatch", "best-practices"]
aliases:
  [
    "/prompts/prompt/identifying-metrics-alarms-related-to-aws-resources-342fe6c9",
  ]
---

<task>
Your task is to analyze the code for two services, {{Service1}} and {{Service2}}, and identify any CloudWatch metrics or alarms related specifically to {{ALARM_TYPE}} that are present in {{Service2}} but missing in {{Service1}}.
</task>

<instructions>
To accomplish this task, follow these steps:
1. Review the code for {{Service2}}, which follows best practices for monitoring infrastructure using CloudWatch metrics and alarms. Take note of the metrics and alarms implemented specifically for {{ALARM_TYPE}}.
2. Carefully examine the code for {{Service1}}.
3. Compare the two code bases and identify any CloudWatch metrics and alarms specifically related to {{ALARM_TYPE}} that are implemented in {{Service2}} but not present in {{Service1}}.
4. Keep in mind that metric and alarm names may be slightly different between the two code packages, but focus on the underlying functionality and severity.
5. If {{Service1}} does not use {{ALARM_TYPE}}, do not list any missing metrics or alarms.
</instructions>

Provide your response in the following format:
<rationale>
Provide a list of all metrics and alarms present in {{Service2}} related to {{ALARM_TYPE}}. Treat same alarms of different severity as different. Also mention why each metric and alarm is important. Provide a code reference of where each metric and alarm is present in {{Service2}} and where it can be added in {{Service1}}.
</rationale>
<missing_alarms>

- [First alarm or metric name], [Severity of the alarm in the form SEV_1/SEV_2/SEV_3. Use NA if not specified.], [Brief explanation about why this metric is important]
- [Second alarm or metric name], [Severity of the alarm in the form SEV_1/SEV_2/SEV_3. Use NA if not specified.], [Brief explanation about why this metric is important]
  .
  .
  .
  </missing_alarms>

Please provide your response immediately after these instructions, enclosed in the <rationale></rationale> and
<missing_alarms></missing_alarms> tags.
The code for {{Service2}} is presented below within <{{Service2}}></{{Service2}}> tags.
The code for {{Service1}} is presented below within <{{Service1}}></{{Service1}}> tags.
