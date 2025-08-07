import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { configureDynamoDB } from "./dynamodb/resource";
import { tagRelationsFunction } from "./functions/tag-relations/resource";
import { configureMonitoring } from "./monitoring/resource";
import { configureCognito } from "./cognito/resource.js";

const backend = defineBackend({
  auth,
  data,
  tagRelationsFunction,
});

const dataResources = backend.data.resources;
configureCognito(backend);
configureDynamoDB(backend);
configureMonitoring(backend);

if (process.env["PROMPTZ_ENV"] !== "sandbox") {
  for (const table of Object.values(
    dataResources.cfnResources.amplifyDynamoDbTables,
  )) {
    table.deletionProtectionEnabled = true;
    table.pointInTimeRecoveryEnabled = true;
  }
}
