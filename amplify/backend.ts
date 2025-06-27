import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { aws_iam as iam, aws_logs as logs } from "aws-cdk-lib";
import { ServicePrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { configureDynamoDB } from "./dynamodb/resource";
import { tagRelationsFunction } from "./functions/tag-relations/resource";

const backend = defineBackend({
  auth,
  data,
  tagRelationsFunction,
});

const dataResources = backend.data.resources;
const authResources = backend.auth.resources;

configureDynamoDB(backend);

authResources.cfnResources.cfnUserPool.addPropertyOverride(
  "Policies.SignInPolicy.AllowedFirstAuthFactors",
  ["PASSWORD", "EMAIL_OTP"],
);

authResources.cfnResources.cfnUserPoolClient.explicitAuthFlows = [
  "ALLOW_REFRESH_TOKEN_AUTH",
  "ALLOW_USER_AUTH",
];

if (process.env["PROMPTZ_ENV"] !== "sandbox") {
  authResources.cfnResources.cfnUserPool.deletionProtection = "ACTIVE";

  for (const table of Object.values(
    dataResources.cfnResources.amplifyDynamoDbTables,
  )) {
    table.deletionProtectionEnabled = true;
    table.pointInTimeRecoveryEnabled = true;
  }

  const role = new iam.Role(backend.stack, "AmplifyLoggingRole", {
    assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
  });

  role.addToPolicy(
    new PolicyStatement({
      resources: ["*"],
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
    }),
  );

  dataResources.cfnResources.cfnGraphqlApi.xrayEnabled = true;
  dataResources.cfnResources.cfnGraphqlApi.logConfig = {
    fieldLogLevel: "INFO",
    excludeVerboseContent: true,
    cloudWatchLogsRoleArn: role.roleArn,
  };

  const logGroup = logs.LogGroup.fromLogGroupName(
    backend.stack,
    "AppsyncApiLogGroup",
    `/aws/appsync/apis/${dataResources.cfnResources.cfnGraphqlApi.attrApiId}`,
  );

  new logs.MetricFilter(backend.stack, "CreatePromptMetricFilter", {
    logGroup,
    metricNamespace: "Promptz",
    metricName: "PromptCreated",
    filterPattern: logs.FilterPattern.all(
      logs.FilterPattern.stringValue("$.fieldName", "=", "createPrompt"),
      logs.FilterPattern.stringValue("$.logType", "=", "AfterMapping"),
    ),
    metricValue: "1",
  });

  new logs.MetricFilter(backend.stack, "UpdatePromptMetricFilter", {
    logGroup,
    metricNamespace: "Promptz",
    metricName: "PromptUpdated",
    filterPattern: logs.FilterPattern.all(
      logs.FilterPattern.stringValue("$.fieldName", "=", "updatePrompt"),
      logs.FilterPattern.stringValue("$.logType", "=", "AfterMapping"),
    ),
    metricValue: "1",
  });

  new logs.MetricFilter(backend.stack, "DeletePromptMetricFilter", {
    logGroup,
    metricNamespace: "Promptz",
    metricName: "PromptDeleted",
    filterPattern: logs.FilterPattern.all(
      logs.FilterPattern.stringValue("$.fieldName", "=", "deletePrompt"),
      logs.FilterPattern.stringValue("$.logType", "=", "AfterMapping"),
    ),
    metricValue: "1",
  });

  new logs.MetricFilter(backend.stack, "RequestPromptMetricFilter", {
    logGroup,
    metricNamespace: "Promptz",
    metricName: "PromptRequested",
    filterPattern: logs.FilterPattern.all(
      logs.FilterPattern.stringValue("$.fieldName", "=", "getPrompt"),
      logs.FilterPattern.stringValue("$.logType", "=", "AfterMapping"),
    ),
    metricValue: "1",
  });
}
