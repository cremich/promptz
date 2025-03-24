"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import {
  ProjectRule,
  projectRuleSearchParamsSchema,
} from "@/app/lib/definitions";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import {
  FilterCondition,
  buildTextSearchFilter,
  buildTagFilter,
} from "@/app/lib/filters";
import { z } from "zod";
import { GraphQLResult } from "aws-amplify/api";

interface FetchProjectRulesResult {
  projectRules: ProjectRule[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof projectRuleSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Fetches a single project rule by ID
 * @param id The ID of the project rule to fetch
 * @returns The project rule or undefined if not found
 */
export async function fetchProjectRule(id: string) {
  const { data: projectRule, errors } = await appsync.models.projectRule.get({
    id,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!projectRule) {
    return;
  }

  return mapToProjectRule(projectRule);
}

/**
 * Interface for the GraphQL response when fetching a project rule by slug
 */
interface ProjectRuleBySlugResponse {
  listRuleBySlug: {
    items: Schema["projectRule"]["type"][];
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
        owner_username
        owner
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

  return mapToProjectRule(projectRule);
}

/**
 * Searches for project rules based on provided parameters
 * @param params Search parameters for filtering project rules
 * @returns Object containing project rules and next token for pagination
 */
export async function searchProjectRules(
  params: SearchSchema,
): Promise<FetchProjectRulesResult> {
  try {
    // Validate search params
    const validatedParams = projectRuleSearchParamsSchema.parse(params);

    const filter: FilterCondition = {};
    const facets: FilterCondition[] = [];

    // Handle user-specific filter
    if (validatedParams.my) {
      const user = await fetchCurrentAuthUser();
      facets.push({ owner: { eq: `${user.id}::${user.username}` } });
    } else {
      filter.public = { eq: true };
    }

    // Build query filter
    if (validatedParams.query) {
      filter.or = buildTextSearchFilter(validatedParams.query).or;
    }

    // Handle tag-based filters
    if (params.tags) {
      const tagParams = Array.isArray(params.tags)
        ? params.tags
        : [params.tags];
      facets.push(...buildTagFilter(tagParams));
    }

    // Add facets to filter
    if (facets.length > 0) {
      filter.and = facets;
    }

    const {
      data: projectRules,
      errors,
      nextToken,
    } = await appsync.models.projectRule.list({
      filter,
      limit: 1000,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    // Map the project rules to our frontend model
    let projectRulesList = mapToProjectRules(projectRules);

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      projectRulesList = projectRulesList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      projectRules: projectRulesList,
      nextToken,
    };
  } catch (error) {
    console.error("Error fetching project rules:", error);
    throw error;
  }
}

/**
 * Maps a project rule from the database schema to the frontend model
 * @param projectRule The project rule from the database
 * @returns The mapped project rule for the frontend
 */
function mapToProjectRule(
  projectRule: Schema["projectRule"]["type"],
): ProjectRule {
  const tags: string[] = projectRule.tags
    ? projectRule.tags.filter(
        (tag): tag is NonNullable<typeof tag> => tag != null,
      )
    : [];

  return {
    id: projectRule.id,
    title: projectRule.name,
    description: projectRule.description || "",
    tags: tags,
    content: projectRule.content,
    author: projectRule.owner_username,
    authorId: projectRule.owner || "",
    public: projectRule.public || false,
    slug: projectRule.slug || "",
    sourceURL: projectRule.sourceURL || "",
    createdAt: projectRule.createdAt || "",
    updatedAt: projectRule.updatedAt || "",
  };
}

/**
 * Maps an array of project rules from the database schema to frontend models
 * @param projectRules Array of project rules from the database
 * @returns Array of mapped project rules for the frontend
 */
function mapToProjectRules(
  projectRules: Schema["projectRule"]["type"][],
): ProjectRule[] {
  return projectRules.map(mapToProjectRule);
}
