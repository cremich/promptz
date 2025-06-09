"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { Model } from "@/lib/models/model-model";

interface ModelBySlugResponse {
  listModelBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      documentationURL?: string;
      author: {
        id?: string;
        displayName?: string;
      };
      provider: {
        id?: string;
        name?: string;
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

export async function fetchModelSlug(id: string) {
  const { data, errors } = await appsync.models.model.get(
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

export async function fetchModelBySlug(slug: string) {
  const GET_MODEL_BY_SLUG = `
  query ListModels($slug: String!) {
    listModelBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        documentationURL
        author {
          id
          displayName
        }
        provider {
          id
          name
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
  const response = (await appsync.graphql<ModelBySlugResponse>({
    query: GET_MODEL_BY_SLUG,
    variables: { slug: slug },
  })) as GraphQLResult<ModelBySlugResponse>;

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  const model = response.data.listModelBySlug.items[0];

  if (!model) {
    return;
  }

  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description,
    documentationURL: model.documentationURL,
    author: model.author.displayName,
    authorId: model.author.id,
    provider: model.provider.name,
    providerId: model.provider.id,
  } as Model;
}
