import { a } from "@aws-amplify/backend";

export function createDeleteMutation(modelName: string) {
  return a
    .mutation()
    .arguments({
      id: a.id().required(),
    })
    .returns(a.ref(modelName))
    .authorization((allow) => [allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: a.ref(modelName),
        entry: "./resolver/delete.js",
      }),
      a.handler.custom({
        dataSource: "PromptzEventBusDataSource",
        entry: `./resolver/putEvent.js`,
      }),
    ]);
}

export function createSaveMutation<T extends string>(modelName: T) {
  return a
    .mutation()
    .arguments({
      id: a.id(),
      name: a.string().required(),
      description: a.string().required(),
      howto: a.string(),
      content: a.string().required(),
      tags: a.string().array(),
      scope: a.string().required(),
      sourceURL: a.string(),
    })
    .returns(a.ref(modelName))
    .authorization((allow) => [allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: a.ref(modelName),
        entry: "./resolver/save.js",
      }),
      a.handler.custom({
        dataSource: "PromptzEventBusDataSource",
        entry: `./resolver/putEvent.js`,
      }),
    ]);
}

export function createIncrementCopyMutation(modelName: string) {
  return a
    .mutation()
    .arguments({
      id: a.id(),
    })
    .returns(a.ref(modelName))
    .authorization((allow) => [allow.publicApiKey(), allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: a.ref(modelName),
        entry: "./resolver/incrementCopyCount.js",
      }),
      a.handler.custom({
        dataSource: "PromptzEventBusDataSource",
        entry: `./resolver/putEvent.js`,
      }),
    ]);
}

export function createIncrementDownloadMutation(modelName: string) {
  return a
    .mutation()
    .arguments({
      id: a.id(),
    })
    .returns(a.ref(modelName))
    .authorization((allow) => [allow.publicApiKey(), allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: a.ref(modelName),
        entry: "./resolver/incrementDownloadCount.js",
      }),
      a.handler.custom({
        dataSource: "PromptzEventBusDataSource",
        entry: `./resolver/putEvent.js`,
      }),
    ]);
}

export function createSaveAgentMutation() {
  return a
    .mutation()
    .arguments({
      id: a.id(),
      name: a.string().required(),
      description: a.string().required(),
      prompt: a.string(),
      tools: a.string().array(),
      mcpServers: a.json(),
      resources: a.string().array(),
      hooks: a.json(),
      toolsSettings: a.json(),
      toolAliases: a.json(),
      allowedTools: a.string().array(),
      useLegacyMcpJson: a.boolean(),
      tags: a.string().array(),
      scope: a.string().required(),
      sourceURL: a.string(),
    })
    .returns(a.ref("agent"))
    .authorization((allow) => [allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: a.ref("agent"),
        entry: "./resolver/saveAgent.js",
      }),
      a.handler.custom({
        dataSource: "PromptzEventBusDataSource",
        entry: `./resolver/putEvent.js`,
      }),
    ]);
}
