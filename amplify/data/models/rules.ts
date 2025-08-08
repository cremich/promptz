import { a } from "@aws-amplify/backend";
import { commonContentAttributes } from "../definitions";
import {
  createIncrementCopyMutation,
  createDeleteMutation,
  createIncrementDownloadMutation,
  createSaveMutation,
} from "../mutations";

export const projectRuleModel = {
  projectRule: a
    .model({
      ...commonContentAttributes,
      content: a.string().required(),
      linkedTags: a.hasMany("ruleTag", "ruleId"),
    })
    .secondaryIndexes((index) => [
      index("slug").queryField("listProjectRuleBySlug").name("slugIndex"),
      index("name").queryField("listProjectRuleByName").name("nameIndex"),
      index("scope").queryField("listProjectRuleByScope").name("scopeIndex"),
      index("owner").queryField("listProjectRuleByUser").name("ownerIndex"),
    ])
    .disableOperations(["subscriptions", "mutations", "list"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  ruleTag: a
    .model({
      ruleId: a.id().required(),
      tagName: a.string().required(),
      rule: a.belongsTo("projectRule", "ruleId"),
      tag: a.belongsTo("tag", "tagName"),
    })
    .identifier(["ruleId", "tagName"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ])
    .disableOperations(["subscriptions", "mutations", "queries"]),

  deleteProjectRule: createDeleteMutation("projectRule"),
  saveProjectRule: createSaveMutation("projectRule"),
  copyProjectRule: createIncrementCopyMutation("projectRule"),
  downloadProjectRule: createIncrementDownloadMutation("projectRule"),
};
