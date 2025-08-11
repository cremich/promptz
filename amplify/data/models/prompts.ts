import { a } from "@aws-amplify/backend";
import { commonContentAttributes } from "../definitions";
import {
  createIncrementCopyMutation,
  createDeleteMutation,
  createIncrementDownloadMutation,
  createSaveMutation,
} from "../mutations";

export const promptModel = {
  prompt: a
    .model({
      ...commonContentAttributes,
      content: a.string().required(),
      linkedTags: a.hasMany("promptTag", "promptId"),
    })
    .secondaryIndexes((index) => [
      index("slug").queryField("listPromptBySlug").name("slugIndex"),
      index("name").queryField("listPromptByName").name("nameIndex"),
      index("scope").queryField("listPromptByScope").name("scopeIndex"),
      index("owner").queryField("listPromptByUser").name("userIdIndex"),
    ])
    .disableOperations(["subscriptions", "mutations", "queries"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ]),

  promptTag: a
    .model({
      promptId: a.id().required(),
      tagName: a.string().required(),
      prompt: a.belongsTo("prompt", "promptId"),
      tag: a.belongsTo("tag", "tagName"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["promptId", "tagName"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read"]),
    ])
    .disableOperations(["subscriptions", "mutations", "queries"]),

  deletePrompt: createDeleteMutation("prompt"),
  savePrompt: createSaveMutation("prompt"),
  copyPrompt: createIncrementCopyMutation("prompt"),
  downloadPrompt: createIncrementDownloadMutation("prompt"),
};
