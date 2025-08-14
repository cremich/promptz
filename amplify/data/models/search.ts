import { a } from "@aws-amplify/backend";
import { createSearchQuery } from "../queries";

export const searchSchema = {
  SearchResult: a.customType({
    id: a.id(),
    name: a.string(),
    tags: a.string().array(),
    slug: a.string(),
    description: a.string(),
    createdAt: a.string(),
    updatedAt: a.string(),
    copyCount: a.integer(),
    downloadCount: a.integer(),
  }),
  PaginatedSearchResult: a.customType({
    results: a.ref("SearchResult").array(),
    nextToken: a.string(),
  }),
  searchPrompts: createSearchQuery("prompt"),
  searchProjectRules: createSearchQuery("projectRule"),
  searchAgents: createSearchQuery("agent"),
};
