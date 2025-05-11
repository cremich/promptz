import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postAuthenticationFunction } from "../auth/post-authentication/resource";
const schema = a
  .schema({
    user: a
      .model({
        id: a.id().required(),
        username: a.string().required(),
        email: a.string().required(),
        displayName: a.string().required(),
        owner: a.string().required(),
        stars: a.hasMany("stars", "userId"),
        prompts: a.hasMany("prompt", "owner"),
      })
      .disableOperations(["subscriptions", "list", "delete", "update"])
      .authorization((allow) => [allow.owner().to(["read"])]),
    prompt: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        slug: a.string(),
        description: a.string().required(),
        tags: a.string().array(),
        instruction: a.string().required(),
        sourceURL: a.string(),
        howto: a.string(),
        public: a.boolean(),
        owner: a.string().required(),
        author: a.belongsTo("user", "owner"),
        owner_username: a.string().required(),
        stars: a.hasMany("stars", "promptId"),
        copyCount: a.integer().default(0),
        starCount: a.integer().default(0),
      })
      .secondaryIndexes((index) => [
        index("slug").queryField("listBySlug").name("slugIndex"),
        index("name").queryField("listByName").name("nameIndex"),
      ])
      .authorization((allow) => [
        allow.publicApiKey(),
        allow.authenticated().to(["read"]),
        allow.owner().to(["create", "update", "delete"]),
      ]),
    stars: a
      .model({
        userId: a.string().required(),
        promptId: a.string().required(),
        user: a.belongsTo("user", "userId"),
        prompt: a.belongsTo("prompt", "promptId"),
      })
      .identifier(["userId", "promptId"])
      .authorization((allow) => [
        allow.owner().to(["create", "delete", "read"]),
      ]),
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
        owner_username: a.string().required(),
        copyCount: a.integer().default(0),
        downloadCount: a.integer().default(0),
      })
      .secondaryIndexes((index) => [
        index("slug").queryField("listRuleBySlug").name("slugIndex"),
        index("name").queryField("listRuleByName").name("nameIndex"),
      ])
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["create", "update", "delete"]),
      ]),
    PromptCopied: a.customType({
      promptId: a.id().required(),
    }),
    PromptStarred: a.customType({
      promptId: a.id().required(),
    }),
    PromptUnstarred: a.customType({
      promptId: a.id().required(),
    }),
    RuleCopied: a.customType({
      ruleId: a.id().required(),
    }),
    RuleDownloaded: a.customType({
      ruleId: a.id().required(),
    }),
    publishPromptCopied: a
      .mutation()
      .arguments({
        promptId: a.id().required(),
      })
      .returns(a.ref("PromptCopied"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "PromptzEventBusDataSource",
          entry: "./handler/publishPromptCopied.js",
        }),
      ),
    publishRuleCopied: a
      .mutation()
      .arguments({
        ruleId: a.id().required(),
      })
      .returns(a.ref("RuleCopied"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "PromptzEventBusDataSource",
          entry: "./handler/publishRuleCopied.js",
        }),
      ),
    publishRuleDownloaded: a
      .mutation()
      .arguments({
        ruleId: a.id().required(),
      })
      .returns(a.ref("RuleDownloaded"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "PromptzEventBusDataSource",
          entry: "./handler/publishRuleDownloaded.js",
        }),
      ),
    publishPromptStarred: a
      .mutation()
      .arguments({
        promptId: a.id().required(),
      })
      .returns(a.ref("PromptStarred"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "PromptzEventBusDataSource",
          entry: "./handler/publishPromptStarred.js",
        }),
      ),
    publishPromptUnstarred: a
      .mutation()
      .arguments({
        promptId: a.id().required(),
      })
      .returns(a.ref("PromptUnstarred"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "PromptzEventBusDataSource",
          entry: "./handler/publishPromptUnstarred.js",
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
