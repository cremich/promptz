import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postAuthenticationFunction } from "../auth/post-authentication/resource";
import { userModel } from "./models/user";
import { tagModel } from "./models/tags";
import { searchSchema } from "./models/search";
import { promptModel } from "./models/prompts";
import { projectRuleModel } from "./models/rules";
const schema = a
  .schema({
    ...searchSchema,
    ...tagModel,
    ...promptModel,
    ...projectRuleModel,
    ...userModel,
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
  logging:
    process.env["PROMPTZ_ENV"] === "sandbox"
      ? {
          excludeVerboseContent: true,
          fieldLogLevel: "all",
        }
      : true,
});
