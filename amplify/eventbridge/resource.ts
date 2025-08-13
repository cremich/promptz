import { Backend } from "@aws-amplify/backend";
import { BackendAuth } from "@aws-amplify/backend-auth";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import { ConstructFactory } from "@aws-amplify/plugin-types";

import { aws_events as events, Duration } from "aws-cdk-lib";

/**
 * Get retention period for EventBridge Archive based on environment
 * Production: Infinite retention for comprehensive analytics and audit capabilities
 * Sandbox: 7 days for testing and development
 */
const getArchiveRetentionPeriod = (): Duration | undefined => {
  return process.env["PROMPTZ_ENV"] === "sandbox"
    ? Duration.days(7)
    : undefined; // undefined = infinite retention for production
};

/**
 * Configure EventBridge custom event bus with archive capabilities
 * for domain event publishing and replay functionality
 */
export function configureEventBridge(
  backend: Backend<{
    auth: ConstructFactory<BackendAuth>;
    data: ConstructFactory<AmplifyGraphqlApi>;
  }>,
) {
  const eventStack = backend.createStack("PromptzMessagingStack");

  // Create the custom event bus for Promptz domain events
  const eventBus = new events.EventBus(eventStack, "PromptzEventBus", {
    description: "Custom event bus for Promptz domain events",
  });

  // Configure EventBridge Archive for event replay and audit capabilities
  new events.Archive(eventStack, "PromptzEventArchive", {
    sourceEventBus: eventBus,
    description:
      "Archive for Promptz domain events to support replay and analytics",
    retention: getArchiveRetentionPeriod(),
    eventPattern: {
      source: ["promptz.dev"],
    },
  });

  // Add EventBridge data source to AppSync for pipeline resolvers
  backend.data.addEventBridgeDataSource("PromptzEventBusDataSource", eventBus);
}
