import { a } from "@aws-amplify/backend";

export const userModel = {
  user: a
    .model({
      id: a.id(),
      displayName: a.string(),
      prompts: a.hasMany("prompt", "owner"),
      projectRules: a.hasMany("projectRule", "owner"),
      agents: a.hasMany("agent", "owner"),
    })
    .disableOperations(["subscriptions", "update", "delete"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),
};
