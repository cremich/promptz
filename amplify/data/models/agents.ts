import { a } from "@aws-amplify/backend";
import { commonContentAttributes } from "../definitions";
import {
  createIncrementCopyMutation,
  createDeleteMutation,
  createIncrementDownloadMutation,
  createSaveAgentMutation,
} from "../mutations";

export const agentModel = {
  agent: a
    .model({
      ...commonContentAttributes,
      // Agent-specific system prompt
      prompt: a.string(),
      // Available tools array
      tools: a.string().array().required(),
      // MCP server configurations as JSON
      mcpServers: a.json(),
      // Resource file paths
      resources: a.string().array().required(),
      // Lifecycle hooks configuration as JSON
      hooks: a.json(),
      // Tool-specific settings as JSON
      toolsSettings: a.json(),
      // Tool name aliases as JSON
      toolAliases: a.json(),
      // Explicitly allowed tools
      allowedTools: a.string().array().required(),
      // Legacy MCP support flag
      useLegacyMcpJson: a.boolean().default(false),
      // Relationship to agent tags
      linkedTags: a.hasMany("agentTag", "agentId"),
    })
    .secondaryIndexes((index) => [
      index("slug").queryField("listAgentBySlug").name("slugIndex"),
      index("name").queryField("listAgentByName").name("nameIndex"),
      index("scope").queryField("listAgentByScope").name("scopeIndex"),
      index("owner").queryField("listAgentByUser").name("ownerIndex"),
    ])
    .disableOperations(["subscriptions", "mutations", "list"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  agentTag: a
    .model({
      agentId: a.id().required(),
      tagName: a.string().required(),
      agent: a.belongsTo("agent", "agentId"),
      tag: a.belongsTo("tag", "tagName"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["agentId", "tagName"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ])
    .disableOperations(["subscriptions", "mutations", "queries"]),

  deleteAgent: createDeleteMutation("agent"),
  saveAgent: createSaveAgentMutation(),
  copyAgent: createIncrementCopyMutation("agent"),
  downloadAgent: createIncrementDownloadMutation("agent"),
};
