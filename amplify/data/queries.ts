import { a } from "@aws-amplify/backend";

export function createSearchQuery(modelName: string) {
  return a
    .query()
    .arguments({
      query: a.string(),
      tags: a.string().array(),
      nextToken: a.string(),
    })
    .returns(a.ref("PaginatedSearchResult"))
    .authorization((allow) => [allow.publicApiKey(), allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref(modelName),
        entry: "./resolver/search.js",
      }),
    );
}
