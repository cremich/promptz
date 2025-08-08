import { a } from "@aws-amplify/backend";

export const scopeValues = ["PRIVATE", "PUBLIC"];
export const commonContentAttributes = {
  id: a.id().required(),
  name: a.string().required(),
  slug: a.string().required(),
  description: a.string().required(),
  sourceURL: a.string(),
  howto: a.string(),
  scope: a.enum(scopeValues),
  tags: a.string().array(),
  owner: a.string().required(),
  author: a.belongsTo("user", "owner"),
  copyCount: a.integer().default(0),
  downloadCount: a.integer().default(0),
  createdAt: a.datetime(),
  updatedAt: a.datetime(),
};
