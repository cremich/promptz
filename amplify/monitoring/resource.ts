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
  backend.data.resources.cfnResources.cfnGraphqlApi.xrayEnabled = true;
}
