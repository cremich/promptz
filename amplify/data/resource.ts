import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postAuthenticationFunction } from "../auth/post-authentication/resource";
const schema = a
  .schema({
    searchResult: a.customType({
      id: a.id(),
      name: a.string(),
      tags: a.string().array(),
      slug: a.string(),
      description: a.string(),
      createdAt: a.string(),
      updatedAt: a.string(),
    }),
    paginatedSearchResult: a.customType({
      results: a.ref("searchResult").array(),
      nextToken: a.string(),
    }),

    // Tag model for enhanced discoverability
    tag: a
      .model({
        name: a.string().required(), // Tag name
        description: a.string(), // Optional description of the tag
        category: a.string(), // Category grouping (e.g., "SDLC", "Interface", "Technology")
        prompts: a.hasMany("promptTag", "tagName"), // Relationship to prompts via join table
        rules: a.hasMany("ruleTag", "tagName"), // Relationship to rules via join table
      })
      .authorization((allow) => [
        // Public read access for tag browsing and discovery
        allow.publicApiKey().to(["read"]),
      ])
      .identifier(["name"])
      // No mutations or subscriptions allowed as specified
      .disableOperations(["mutations", "subscriptions"]),

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
    user: a
      .model({
        id: a
          .id()
          .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.owner().to(["read"]),
          ]),
        username: a.string(),
        email: a.string(),
        displayName: a
          .string()
          .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.owner().to(["read"]),
          ]),
        owner: a.string(),
        prompts: a
          .hasMany("prompt", "owner")
          .authorization((allow) => [allow.owner().to(["read"])]),
        projectRules: a
          .hasMany("projectRule", "owner")
          .authorization((allow) => [allow.owner().to(["read"])]),
      })
      .disableOperations(["subscriptions", "delete", "update"])
      .authorization((allow) => [allow.owner().to(["read"])]),

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
    searchPrompts: a
      .query()
      .arguments({
        query: a.string(),
        tags: a.string().array(),
        nextToken: a.string(),
      })
      .returns(a.ref("paginatedSearchResult"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("prompt"),
          entry: "./handler/search.js",
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
    searchProjectRules: a
      .query()
      .arguments({
        query: a.string(),
        tags: a.string().array(),
        nextToken: a.string(),
      })
      .returns(a.ref("paginatedSearchResult"))
      .authorization((allow) => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: a.ref("projectRule"),
          entry: "./handler/search.js",
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
