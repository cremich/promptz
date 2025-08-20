"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { Prompt } from "@/lib/models/prompt-model";

interface PromptBySlugResponse {
  listPromptBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      tags?: string[];
      content?: string;
      sourceURL?: string;
      howto?: string;
      scope?: string;
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

export async function fetchPromptBySlug(slug: string) {
  const GET_PROMPT_BY_SLUG = `
  query ListPrompts($slug: String!) {
    listPromptBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        tags
        content
        sourceURL
        howto
        scope
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
  const response = (await appsync.graphql<PromptBySlugResponse>({
    query: GET_PROMPT_BY_SLUG,
    variables: { slug: slug },
  })) as GraphQLResult<PromptBySlugResponse>;

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  const prompt = response.data.listPromptBySlug.items[0];

  if (!prompt) {
    return;
  }

  return {
    id: prompt.id,
    name: prompt.name,
    slug: prompt.slug,
    description: prompt.description,
    tags: prompt.tags,
    content: prompt.content,
    sourceURL: prompt.sourceURL,
    howto: prompt.howto,
    scope: prompt.scope,
    author: prompt.author ? prompt.author.displayName : "",
    authorId: prompt.author ? prompt.author.id : "",
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt,
  } as Prompt;
}
