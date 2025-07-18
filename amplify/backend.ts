import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { configureDynamoDB } from "./dynamodb/resource";
import { tagRelationsFunction } from "./functions/tag-relations/resource";
import { configureMonitoring } from "./monitoring/resource";

const backend = defineBackend({
  auth,
  data,
  tagRelationsFunction,
});

const dataResources = backend.data.resources;
const authResources = backend.auth.resources;

configureDynamoDB(backend);
configureMonitoring(backend);

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
}
