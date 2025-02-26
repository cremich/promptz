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
      })
      .authorization((allow) => [allow.owner().to(["read"])]),
    prompt: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        description: a.string().required(),
        sdlc_phase: a.string(),
        interface: a.string(),
        category: a.string().required(),
        tags: a.string().array(),
        instruction: a.string().required(),
        howto: a.string(),
        owner_username: a.string().required(),
        stars: a.hasMany("stars", "promptId"),
      })
      .authorization((allow) => [
        allow.publicApiKey(),
        allow.authenticated().to(["read"]),
        allow.owner().to(["create", "update", "delete"]),
      ]),
    draft: a
      .model({
        id: a.id().required(),
        promptId: a.string().required(),
        name: a.string().required(),
        description: a.string().required(),
        tags: a.string().array(),
        instruction: a.string().required(),
        howto: a.string(),
      })
      .authorization((allow) => [
        allow.owner().to(["read", "create", "update", "delete"]),
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
