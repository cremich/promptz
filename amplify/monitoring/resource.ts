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

  new logs.LogGroup(backend.stack, "AppsyncApiLogGroup", {
    logGroupName: `/aws/appsync/apis/${backend.data.apiId}`,
  });
}
