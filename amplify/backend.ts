import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { configureDynamoDB } from "./dynamodb/resource";
import { tagRelationsFunction } from "./functions/tag-relations/resource";
import { configureMonitoring } from "./monitoring/resource";
import { configureCognito } from "./cognito/resource.js";
import { configureEventBridge } from "./eventbridge/resource.js";

const backend = defineBackend({
  auth,
  data,
  tagRelationsFunction,
});

configureCognito(backend);
configureDynamoDB(backend);
configureMonitoring(backend);
configureEventBridge(backend);
