"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { ModelProvider } from "@/lib/models/modelProvider-model";

interface ModelProviderBySlugResponse {
  listModelProviderBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      website?: string;
      author: {
        id?: string;
        displayName?: string;
      };
      createdAt?: string;
      updatedAt?: string;
    }[];
    nextToken?: string;
  };
}

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchModelProviderSlug(id: string) {
  const { data, errors } = await appsync.models.modelProvider.get(
    {
      id,
    },
    {
      selectionSet: ["slug"],
    },
  );

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    return;
  }

  return data.slug;
}

export async function fetchModelProviderBySlug(slug: string) {
  const GET_MODELPROVIDER_BY_SLUG = `
  query ListModelProviders($slug: String!) {
    listModelProviderBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        website
        author {
          id
          displayName
        }
        createdAt
        updatedAt
      }
    }
  }
`;

  // we have to use the raw graphql client as the type generation for
  // queries with secondary indexes is buggy and results in an error of invalid
  // type matching of filters.
  const response = (await appsync.graphql<ModelProviderBySlugResponse>({
    query: GET_MODELPROVIDER_BY_SLUG,
    variables: { slug: slug },
  })) as GraphQLResult<ModelProviderBySlugResponse>;

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  const model = response.data.listModelProviderBySlug.items[0];

  if (!model) {
    return;
  }

  return {
    id: model.id,
    title: model.name,
    slug: model.slug,
    description: model.description,
    website: model.website,
    author: model.author.displayName,
    authorId: model.author.id,
  } as ModelProvider;
}
