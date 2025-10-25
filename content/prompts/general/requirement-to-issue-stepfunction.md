---
authors:
  - Stan Fan
categories:
  - general
description:
  "Requirement from client user to github issue, with step function and
  lambda "
draft: false
images: []
tags:
  - IDE
  - Chat
title: requirement-to-issue-stepfunction
createdAt: 2025-02-21T04:25:48.300Z
updatedAt: 2025-02-21T04:40:26.451Z
aliases: ["/prompts/prompt/requirement-to-issue-stepfunction-efcb913e"]
---

@workspace I am working on a lambda function that will be triggered by a s3 put object event. Object put to s3 bucket will be raw requirement from client/user. The lambda function will process the .doc or .pdf files and send to Claude 3.5 sonnect v2 and transfer the requiement document to one or multiple issues that can assign to developers.

This is good. I would like to use claude 3.5 sonnet v2 in amazon bedrock. converse API is preferred.

This looks great. Now, I would prefer to achieve exactly same with AWS Step function, use as much direct integration in step function when you invoke other service, e.g., invoke Claude 3.5 sonnet v2 in Amazon Bedrock. I would prefer you provide me a CDK script in typescirpt. I prefer python for Lambda function in the statemachine of step function.

I don't want to use textract. I would prefer give the document to the large language model in Bedrock.

this is wrong. Here is a sample of invoke bedrock model in stepfunction:

```
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

const model = bedrock.FoundationModel.fromFoundationModelId(
  this,
  'Model',
  bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1,
);

const task = new tasks.BedrockInvokeModel(this, 'Prompt Model', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'Generate a list of five first names.',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  resultSelector: {
    names: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
});
```

Please consider use the same function and method.

2 more issues here:

on stateMachine, you use addCatch on sfn.chain.

s3.SfnDestination doesn't exist. To trigger a stepfunction statemachin, you need to use another lambda. s3-> lambda -> StepFunction

Good! Now give me the document reader lambda function

good. But boto3 is a embedded lib in lambda, you don't need to put to requirement.txt

Good! Now generate github_issue_creator lambda function

again, request is included in lambda as default, you don't need to add to requirements.txt file

I have below warrnings when I execute cdk ls:

```
[WARNING] aws-cdk-lib.aws_stepfunctions.MapProps#parameters is deprecated.
Step Functions has deprecated the parameters field in favor of
the new itemSelector field
This API will be removed in the next major release.
[WARNING] aws-cdk-lib.aws_stepfunctions.Map#iterator is deprecated.
use itemProcessor instead. This API will be removed in the next major release. [WARNING] aws-cdk-lib.aws_stepfunctions.StateMachineProps#definition is deprecated. use definitionBody: DefinitionBody.fromChainable() This API will be removed in the next major release. [WARNING] aws-cdk-lib.aws_stepfunctions.StateMachineProps#definition is deprecated. use definitionBody: DefinitionBody.fromChainable() This API will be removed in the next major release.
```

And I preferred python version 12 on my lambda functions

The way you using itemProcessor is wrong. Here is an working sample. Please correct it:

```
const map = new sfn.Map(this, 'Map State', {
  maxConcurrency: 1,
  itemsPath: sfn.JsonPath.stringAt('$.inputForMap'),
  itemSelector: {
    item: sfn.JsonPath.stringAt('$$.Map.Item.Value'),
  },
  resultPath: '$.mapOutput',
});

// The Map iterator can contain a IChainable, which can be an individual or multiple steps chained together.
// Below example is with a Choice and Pass step
const choice = new sfn.Choice(this, 'Choice');
const condition1 = sfn.Condition.stringEquals('$.item.status', 'SUCCESS');
const step1 = new sfn.Pass(this, 'Step1');
const step2 = new sfn.Pass(this, 'Step2');
const finish = new sfn.Pass(this, 'Finish');

const definition = choice
    .when(condition1, step1)
    .otherwise(step2)
    .afterwards()
    .next(finish);

map.itemProcessor(definition);
```
