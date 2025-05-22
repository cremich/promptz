"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { Prompt } from "@/lib/models/prompt-model";

interface PromptBySlugResponse {
  listBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      tags?: string[];
      instruction?: string;
      sourceURL?: string;
      howto?: string;
      public?: string;
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

export async function fetchPromptSlug(id: string) {
  const { data, errors } = await appsync.models.prompt.get(
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

export async function fetchPromptBySlug(slug: string) {
  const GET_PROMPT_BY_SLUG = `
  query ListPrompts($slug: String!) {
    listBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        tags
        instruction
        sourceURL
        howto
        public
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

  const prompt = response.data.listBySlug.items[0];

  if (!prompt) {
    return;
  }

  return {
    id: prompt.id,
    title: prompt.name,
    slug: prompt.slug,
    description: prompt.description,
    tags: prompt.tags,
    instruction: prompt.instruction,
    sourceURL: prompt.sourceURL,
    howto: prompt.howto,
    public: prompt.public,
    author: prompt.author.displayName,
    authorId: prompt.author.id,
  } as Prompt;
}
