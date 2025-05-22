"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { ProjectRule } from "@/lib/models/project-rule-model";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Interface for the GraphQL response when fetching a project rule by slug
 */
interface ProjectRuleBySlugResponse {
  listRuleBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      tags?: string[];
      content?: string;
      sourceURL?: string;
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

/**
 * Fetches a project rule by its slug
 * @param slug The slug of the project rule to fetch
 * @returns The project rule or undefined if not found
 */
export async function fetchProjectRuleBySlug(slug: string) {
  const GET_PROJECT_RULE_BY_SLUG = `
  query ListProjectRules($slug: String!) {
    listRuleBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        tags
        content
        sourceURL
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

  // Using raw GraphQL client as the type generation for queries with secondary indexes can be buggy
  const response = (await appsync.graphql<ProjectRuleBySlugResponse>({
    query: GET_PROJECT_RULE_BY_SLUG,
    variables: { slug: slug },
  })) as GraphQLResult<ProjectRuleBySlugResponse>;

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  const projectRule = response.data.listRuleBySlug.items[0];

  if (!projectRule) {
    return;
  }

  return {
    id: projectRule.id,
    title: projectRule.name,
    slug: projectRule.slug,
    description: projectRule.description,
    tags: projectRule.tags,
    content: projectRule.content,
    sourceURL: projectRule.sourceURL,
    public: projectRule.public,
    author: projectRule.author?.displayName || "",
    authorId: projectRule.author?.id || "",
  } as ProjectRule;
}
