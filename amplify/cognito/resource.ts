import { Backend } from "@aws-amplify/backend";
import { BackendAuth } from "@aws-amplify/backend-auth";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import { ConstructFactory } from "@aws-amplify/plugin-types";
import { RemovalPolicy } from "aws-cdk-lib";

export function configureCognito(
  backend: Backend<{
    auth: ConstructFactory<BackendAuth>;
    data: ConstructFactory<AmplifyGraphqlApi>;
  }>,
) {
  const authResources = backend.auth.resources;

  authResources.cfnResources.cfnUserPool.addPropertyOverride(
    "Policies.SignInPolicy.AllowedFirstAuthFactors",
    ["EMAIL_OTP", "PASSWORD"],
    // "PASSWORD still required by Cognito. Without it, deployment will fail with the error message below"
    // Invalid request provided: PASSWORD should be configured as one of the allowed first auth factors
  );
  authResources.cfnResources.cfnUserPoolClient.explicitAuthFlows = [
    "ALLOW_USER_AUTH",
    "ALLOW_USER_SRP_AUTH", //needs to be allowed to enable API testing via appsync console
  ];

  backend.auth.resources.userPool.applyRemovalPolicy(RemovalPolicy.RETAIN);

  if (process.env["PROMPTZ_ENV"] !== "sandbox") {
    backend.auth.resources.cfnResources.cfnUserPool.deletionProtection =
      "ACTIVE";
  }
}
