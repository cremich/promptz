import { aws_iam as iam, aws_logs as logs } from "aws-cdk-lib";
import { Backend } from "@aws-amplify/backend";
import { BackendAuth } from "@aws-amplify/backend-auth";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import { ConstructFactory } from "@aws-amplify/plugin-types";

export function configureMonitoring(
  backend: Backend<{
    auth: ConstructFactory<BackendAuth>;
    data: ConstructFactory<AmplifyGraphqlApi>;
  }>,
) {
  const role = new iam.Role(backend.stack, "AmplifyLoggingRole", {
    assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
  });

  role.addToPolicy(
    new iam.PolicyStatement({
      resources: ["*"],
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
    }),
  );

  backend.data.resources.cfnResources.cfnGraphqlApi.xrayEnabled = true;
  backend.data.resources.cfnResources.cfnGraphqlApi.logConfig = {
    fieldLogLevel: "INFO",
    excludeVerboseContent: true,
    cloudWatchLogsRoleArn: role.roleArn,
  };

  const logGroup = new logs.LogGroup(backend.stack, "AppsyncApiLogGroup", {
    logGroupName: `/aws/appsync/apis/${backend.data.apiId}`,
  });

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
