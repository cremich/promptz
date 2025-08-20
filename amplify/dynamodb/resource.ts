import { Backend } from "@aws-amplify/backend";
import { BackendAuth } from "@aws-amplify/backend-auth";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import {
  ConstructFactory,
  FunctionResources,
  ResourceAccessAcceptorFactory,
  ResourceProvider,
  StackProvider,
} from "@aws-amplify/plugin-types";
import { AddEnvironmentFactory } from "@aws-amplify/backend-function";

import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function configureDynamoDB(
  backend: Backend<{
    auth: ConstructFactory<BackendAuth>;
    data: ConstructFactory<AmplifyGraphqlApi>;
    tagRelationsFunction: ConstructFactory<
      ResourceProvider<FunctionResources> &
        ResourceAccessAcceptorFactory &
        AddEnvironmentFactory &
        StackProvider
    >;
  }>,
) {
  // Get table references
  const promptTable = backend.data.resources.tables["prompt"];
  const rulesTable = backend.data.resources.tables["projectRule"];
  const agentTable = backend.data.resources.tables["agent"];
  const promptTagJoinTable = backend.data.resources.tables["promptTag"];
  const ruleTagJoinTable = backend.data.resources.tables["ruleTag"];
  const agentTagJoinTable = backend.data.resources.tables["agentTag"];
  const tagTable = backend.data.resources.tables["tag"];

  const tagRelationsLambdaFunction =
    backend.tagRelationsFunction.resources.lambda;

  // Grant necessary permissions
  promptTable.grantStreamRead(tagRelationsLambdaFunction);
  rulesTable.grantStreamRead(tagRelationsLambdaFunction);
  agentTable.grantStreamRead(tagRelationsLambdaFunction);
  promptTagJoinTable.grantReadWriteData(tagRelationsLambdaFunction);
  ruleTagJoinTable.grantReadWriteData(tagRelationsLambdaFunction);
  agentTagJoinTable.grantReadWriteData(tagRelationsLambdaFunction);
  tagTable.grantReadData(tagRelationsLambdaFunction); // For validation if needed

  // Set environment variables with actual table names
  backend.tagRelationsFunction.addEnvironment(
    "PROMPT_TAG_TABLE",
    promptTagJoinTable.tableName,
  );
  backend.tagRelationsFunction.addEnvironment(
    "RULE_TAG_TABLE",
    ruleTagJoinTable.tableName,
  );
  backend.tagRelationsFunction.addEnvironment(
    "AGENT_TAG_TABLE",
    agentTagJoinTable.tableName,
  );

  // Configure DynamoDB stream event sources with error handling
  tagRelationsLambdaFunction.addEventSource(
    new lambdaEventSources.DynamoEventSource(promptTable, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 10, // Process records in smaller batches for better error handling
      retryAttempts: 3, // Retry failed batches up to 3 times
      reportBatchItemFailures: true, // Enable partial batch failure reporting
    }),
  );

  tagRelationsLambdaFunction.addEventSource(
    new lambdaEventSources.DynamoEventSource(rulesTable, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 10, // Process records in smaller batches for better error handling
      retryAttempts: 3, // Retry failed batches up to 3 times
      reportBatchItemFailures: true, // Enable partial batch failure reporting
    }),
  );

  tagRelationsLambdaFunction.addEventSource(
    new lambdaEventSources.DynamoEventSource(agentTable, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 10, // Process records in smaller batches for better error handling
      retryAttempts: 3, // Retry failed batches up to 3 times
      reportBatchItemFailures: true, // Enable partial batch failure reporting
    }),
  );

  if (process.env["PROMPTZ_ENV"] !== "sandbox") {
    for (const table of Object.values(
      backend.data.resources.cfnResources.amplifyDynamoDbTables,
    )) {
      table.deletionProtectionEnabled = true;
      table.pointInTimeRecoveryEnabled = true;
    }
  }
}
