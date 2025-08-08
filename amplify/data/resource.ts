import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postAuthenticationFunction } from "../auth/post-authentication/resource";
import { userModel } from "./models/user";
import { tagModel } from "./models/tags";
import { searchSchema } from "./models/search";
const schema = a
  .schema({
    ...searchSchema,
    ...tagModel,

    // Join table for many-to-many relationships between tags and prompts
    promptTag: a
      .model({
        promptId: a.id().required(), // ID of the linked prompt
        tagName: a.string().required(), // Name of the associated tag as identifier
        prompt: a.belongsTo("prompt", "promptId"),
        tag: a.belongsTo("tag", "tagName"),
      })
      .identifier(["promptId", "tagName"])
      .authorization((allow) => [
        // Public read access for browsing tag associations
        allow.publicApiKey().to(["read"]),
      ])
      .disableOperations(["subscriptions", "mutations"]),

    // Join table for many-to-many relationships between tags and prompts
    ruleTag: a
      .model({
        ruleId: a.id().required(), // ID of the linked prompt
        tagName: a.string().required(), // Name of the associated tag as identifier
        rule: a.belongsTo("projectRule", "ruleId"),
        tag: a.belongsTo("tag", "tagName"),
      })
      .identifier(["ruleId", "tagName"])
      .authorization((allow) => [
        // Public read access for browsing tag associations
        allow.publicApiKey().to(["read"]),
      ])
      .disableOperations(["subscriptions", "mutations"]),
    ...userModel,
    prompt: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        slug: a.string(),
        description: a.string().required(),
        tags: a.string().array(), // Maintained for backward compatibility
        instruction: a.string().required(),
        sourceURL: a.string(),
        howto: a.string(),
        public: a.boolean(),
        owner: a.string().required(),
        author: a
          .belongsTo("user", "owner")
          .authorization((allow) => [allow.publicApiKey().to(["read"])]),
        copyCount: a.integer().default(0),
        // Many-to-many relationship with tags through linkedTag join table
        linkedTags: a.hasMany("promptTag", "promptId"),
      })
      .secondaryIndexes((index) => [
        index("slug").queryField("listBySlug").name("slugIndex"),
        index("name").queryField("listByName").name("nameIndex"),
      ])
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["delete"]),
      ])
      .disableOperations(["subscriptions", "mutations", "list"]),
    savePrompt: a
      .mutation()
      .arguments({
        id: a.id(),
        name: a.string().required(),
        description: a.string().required(),
        howto: a.string(),
        instruction: a.string().required(),
        tags: a.string().array(),
        public: a.boolean(),
        sourceURL: a.string(),
      })
      .returns(a.ref("prompt"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("prompt"),
          entry: "./handler/savePrompt.js",
        }),
      ),
    deletePrompt: a
      .mutation()
      .arguments({
        id: a.id(),
      })
      .returns(a.ref("prompt"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("prompt"),
          entry: "./handler/delete.js",
        }),
      ),
    copyPrompt: a
      .mutation()
      .arguments({
        id: a.id(),
      })
      .returns(a.ref("prompt"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("prompt"),
          entry: "./handler/incrementCopyCount.js",
        }),
      ),

    projectRule: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        slug: a.string().required(),
        description: a.string(),
        content: a.string().required(),
        tags: a.string().array(),
        public: a.boolean(),
        sourceURL: a.string(),
        owner: a.string().required(),
        author: a
          .belongsTo("user", "owner")
          .authorization((allow) => [allow.publicApiKey().to(["read"])]),
        copyCount: a.integer().default(0),
        downloadCount: a.integer().default(0),
        // Many-to-many relationship with tags through linkedTag join table
        linkedTags: a.hasMany("ruleTag", "ruleId"),
      })
      .secondaryIndexes((index) => [
        index("slug").queryField("listRuleBySlug").name("slugIndex"),
        index("name").queryField("listRuleByName").name("nameIndex"),
      ])
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["delete"]),
      ])
      .disableOperations(["subscriptions", "mutations", "list"]),
    saveProjectRule: a
      .mutation()
      .arguments({
        id: a.id(),
        name: a.string().required(),
        description: a.string().required(),
        content: a.string().required(),
        tags: a.string().array(),
        public: a.boolean(),
        sourceURL: a.string(),
      })
      .returns(a.ref("projectRule"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("projectRule"),
          entry: "./handler/saveProjectRule.js",
        }),
      ),
    deleteProjectRule: a
      .mutation()
      .arguments({
        id: a.id(),
      })
      .returns(a.ref("projectRule"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("projectRule"),
          entry: "./handler/delete.js",
        }),
      ),
    copyProjectRule: a
      .mutation()
      .arguments({
        id: a.id(),
      })
      .returns(a.ref("projectRule"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("projectRule"),
          entry: "./handler/incrementCopyCount.js",
        }),
      ),
    downloadProjectRule: a
      .mutation()
      .arguments({
        id: a.id(),
      })
      .returns(a.ref("projectRule"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("projectRule"),
          entry: "./handler/incrementDownloadCount.js",
        }),
      ),
  })
  .authorization((allow) => [allow.resource(postAuthenticationFunction)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  name: "promptz",
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 90 },
  },
});
