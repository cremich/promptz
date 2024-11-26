import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
const schema = a
  .schema({
    prompt: a.model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      sdlc_phase: a.string(),
      interface: a.string(),
      category: a.string().required(),
      instruction: a.string().required(),
      howto: a.string(),
      owner_username: a.string().required(),
    }),
  })
  .authorization((allow) => [
    allow.publicApiKey(),
    allow.owner().to(["create", "update", "delete"]),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  name: "promptz",
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 90 },
  },
});
