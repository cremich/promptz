import { defineFunction } from "@aws-amplify/backend";

export const tagRelationsFunction = defineFunction({
  name: "tag-relations",
  resourceGroupName: "data",
  memoryMB: 512,
  environment: {
    // PowerTools configuration
    POWERTOOLS_SERVICE_NAME: "tag-relations-cdc",
    POWERTOOLS_LOG_LEVEL: "INFO",
    POWERTOOLS_LOGGER_SAMPLE_RATE: "0.1", // Sample 10% of logs for debugging
  },
});
