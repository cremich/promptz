import { Backend } from "@aws-amplify/backend";
import { BackendAuth } from "@aws-amplify/backend-auth";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct";
import { ConstructFactory } from "@aws-amplify/plugin-types";

import { aws_events as events } from "aws-cdk-lib";

export function configureEventBridge(
  backend: Backend<{
    auth: ConstructFactory<BackendAuth>;
    data: ConstructFactory<AmplifyGraphqlApi>;
  }>,
) {
  const eventStack = backend.createStack("PromptzMessagingStack");
  const eventBus = new events.EventBus(eventStack, "PromptzEventBus");

  backend.data.addEventBridgeDataSource("PromptzEventBusDataSource", eventBus);
}
