import { a } from "@aws-amplify/backend";

export const tagModel = {
  tag: a
    .model({
      name: a.string().required(),
      description: a.string(),
      category: a.string(),
      prompts: a.hasMany("promptTag", "tagName"),
      rules: a.hasMany("ruleTag", "tagName"),
      agents: a.hasMany("agentTag", "tagName"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ])
    .secondaryIndexes((index) => [
      index("category").queryField("listTagsByCategory").name("categoryIndex"),
    ])
    .identifier(["name"])
    // No mutations or subscriptions allowed as specified
    .disableOperations(["mutations", "subscriptions", "list"]),
};
